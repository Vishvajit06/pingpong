import {  NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConfigDb";

import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import redisClient from "@/lib/ConfigRedis";
import AnnonymousMessage from "@/models/annonymousMessage";

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        console.log("user is not authenticated")
        return NextResponse.json({
            message: "user is not authenticated",
            success: false
        }, { status: 400 })
    }
    const userID = new mongoose.Types.ObjectId(user._id)

    const username = user?.username || ""
    const cacheKey = `messages:${username}`;
    try {

        const cached = (await redisClient.lrange(cacheKey, 0, 199)) as string[];
        if (cached && cached.length > 0) {
            const messages = cached.map((m) => JSON.parse(m));
            return NextResponse.json({
                messages: messages,
                success: true
            }, { status: 201 })
        }

        //    const user = await UserModel.aggregate([
        //     {$match:{_id:userID}},
        //     {$unwind:'$messages'},
        //     {$sort:{'messages.createdAt':-1}},
        //     {$group:{_id:'$_id', messages:{$push:'$messages'}}}
        //    ])
        //    console.log(user[0].messages)




        const serverMessages = await AnnonymousMessage.find({ receiverId: userID }).select("_id content reply")

        if(serverMessages.length > 0){

            const messages = serverMessages || [];
            if (messages.length > 0) {
                const serialized = messages.map((m: any) => JSON.stringify(m));
                // cast to any to avoid TypeScript spread-tuple restriction for redis rPush
                await (redisClient as any).rpush(cacheKey, ...serialized);
                await redisClient.expire(cacheKey, 600);
            }
        }


        return NextResponse.json({
            messages: serverMessages,
            success: true
        }, { status: 201 })

    } catch (error) {
        console.log("something went wrong during messages fetching using aggregation", error)
        return NextResponse.json({
            message: "something went wrong during messages fetching using aggregation",
            success: false
        }, { status: 500 })
    }


}