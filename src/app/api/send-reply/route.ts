import AnnonymousMessage from "@/models/annonymousMessage";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { pusherServer } from "@/lib/pusherServer";
import redisClient from "@/lib/ConfigRedis";


export async function POST(request:NextRequest) {

    const {messageId,reply} = await request.json();
    
    const session = await getServerSession(authOptions)
    console.log(session)
    if(!session){
        return NextResponse.json({message:"unauthorized access"},{status:401})
    }
    const id = session?.user._id
    const username = session?.user?.username
   
    if(!messageId || !reply){
       
        return NextResponse.json({message:"unable to send the reply. Please provide proper credential"},{status:404})
    }
    try {

        const updatedMessages = await AnnonymousMessage.findOneAndUpdate(
            {
                _id:messageId,
                receiverId:id,
                reply: "" 
            
            },
            {
                $set:{
                    reply:reply,
                }
            },
            {
                new:true
            }
        )

        await redisClient.del(`messages:${username}`)






        if(!updatedMessages){
            console.log("cannot update message")
            return NextResponse.json({message:"caanot found message or unauthorized user or already replied "})
        }

        await pusherServer.trigger(
            `user-${updatedMessages.senderId}`,
            "new-reply",
            {
                title:"reply came from someone"
            }
        )

        return NextResponse.json({message:"reply sent sucessfully",},{status:200})
        
    } catch (error) {
        console.log("something went wrong during sending reply",error)

        return NextResponse.json({
            message:"something went wrong during sending reply",
            error
        },{status:500})
    }
}