
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConfigDb";

import { getServerSession} from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

import redisClient from "@/lib/ConfigRedis";
import AnnonymousMessage from "@/models/annonymousMessage";

export async function POST(request: NextRequest) {
    await dbConnect();


    try {

        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ message: "unauthorized user" }, { status: 401 })
        }

        const username = session.user.username
        const reqbody = await request.json();
        const { messageId } = reqbody

        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            return NextResponse.json(
                { message: "Invalid message id" },
                { status: 400 }
            );
        }


        
        const id = new mongoose.Types.ObjectId(messageId)
        const deleteMessage = await AnnonymousMessage.findByIdAndDelete({_id:id})
        if(!deleteMessage){
            return NextResponse.json({message:"cannot delete the message.Please try again"})
        }
        const cachekey = `messages:${username}`;
        const cachedMessage = await redisClient.lrange(cachekey, 0, -1);
        const updatedMessages = cachedMessage.filter(msg => {
            const msgObject = JSON.parse(msg);
            return msgObject._id !== messageId;
        })
        await redisClient.del(cachekey);
        if (updatedMessages.length > 0) {
            await redisClient.rpush(cachekey, ...updatedMessages);
        }


        return NextResponse.json({ message: "message deleted sucessfully" })


    } catch (error) {
        console.log("something went wrong during deleting the messages", error)
        return NextResponse.json({ message: "cannot delete message due to internal server error" }, { status: 500 })
    }

}