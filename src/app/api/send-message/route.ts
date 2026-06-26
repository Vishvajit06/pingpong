import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConfigDb";
import UserModel from "@/models/User";
import redisClient from "@/lib/ConfigRedis";
import { checkRateLimit } from "@/helpers/redisRatelLimit";
import { getClientIp } from "@/helpers/getClientInfo";
import { checkToxicity } from "@/helpers/checkToxicity";
import AnnonymousMessage from "@/models/annonymousMessage";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "@/models/User";
import { pusherServer } from "@/lib/pusherServer";



export async function POST(request: NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ message: "unauthorized user" }, { status: 401 })
    }
    const { username, content} = await request.json();

    if(username==session.user.username){
        return NextResponse.json({message:"Cannot send message to yourself"},{status:400})
    }
    try {

        const ip = getClientIp(request);
        const rateLimit = await checkRateLimit(ip);
        if (!rateLimit.success) {
            return NextResponse.json({
                message: "you exhausted your limit of sending messages per minute please retry after 1-min ",
                success: true,
            }, { status: 200 })
        }
        else {
            // checking abusive
            const { isToxic, reason } = await checkToxicity(content);
            console.log(isToxic)
            console.log(reason)
            if (isToxic) {
                return NextResponse.json({
                    success: false,
                    message: "your message contain abusive or toxic word", reason
                },
                    { status: 400 }
                )
            }



            const user = await UserModel.findOne({ username })
            if (!user) {
                return NextResponse.json({
                    message: "user does not exists",
                    success: false
                }, { status: 400 })
            }
            if (!user.isAcceptingMessage) {
                return NextResponse.json({
                    message: "user is not accepting the messages",
                    success: false
                }, { status: 400 })
            }

                const session = await getServerSession(authOptions)
                const senderData =  session?.user as User

                const sender = await UserModel.findOne({username:senderData.username})
            const newMessage = await AnnonymousMessage.create({
                senderId:sender?._id,
                receiverId: user._id,
                content,
            })


            const cacheMessage = {
                _id: newMessage._id,
                content: newMessage.content,
                tag: newMessage.tag,
                reply: newMessage.reply || "",
                createdAt: newMessage.createdAt,
            };


            // redis integration
            const cacheKey = `messages:${username}`; // it will create data like messages:username->['hii','hello'] like this


            // const cached = await redisClient.get(cacheKey);
            // if(cached){
            //     // const msg = await JSON.parse(cached);// get the aray of messages
            //     // msg.unshift(newMessage); // push at the top
            //     // if(msg.length>200) msg.pop();// pop older one if length of array is over 200
            //     // await redisClient.set(cacheKey,JSON.stringify(msg)); // update the cache 
            // }else{
            //     await redisClient.set(cacheKey,JSON.stringify([newMessage])) // new cache created
            // }

            // more optimized
            await redisClient
                .multi()
                .lpush(cacheKey, JSON.stringify(cacheMessage))
                .ltrim(cacheKey, 0, 199)
                .expire(cacheKey, 600)
                .exec();

            await pusherServer.trigger(
                `user-${user._id}`,
                "new-message",
                {
                    title:"New Annonymous Message"
                }
            )
            
            return NextResponse.json({
                message: "message sent sucessfully",
                success: true,
                data:cacheMessage
            }, { status: 200 })
        }

    } catch (error) {
        console.log("something went wrong during sending messages(internal server error)",error)
        return NextResponse.json({
            message: "something went wrong during sending messages",
            success: false
        }, { status: 500 })
    }
}