import { dbConnect } from "@/lib/ConfigDb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import AnnonymousMessage from "@/models/annonymousMessage";



export async function GET(){
    await dbConnect();
    try {

        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({message:"unauthorized access denied"},{status:404})
        }

        const userId = session?.user?._id;

        const message = await AnnonymousMessage.find({
            senderId:userId,
            reply:{
                $exists:true,
                $nin:["",null]
            }
        }).populate("receiverId"," profilePicture username")
        .limit(20).select("-_id -senderId")
        return NextResponse.json({message:"reply fetched sucessfully",data:message},{status:200})
        
    } catch (error) {
        console.log("some issue while fetching reply message",error)
        return NextResponse.json({message:"some issue in getting reply"},{status:500})
    }
}   