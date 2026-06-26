import { NextRequest,NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConfigDb";
import UserModel from "@/models/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request:NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User =session?.user as User
    if(!session || !session.user){
        console.log("user is not authenticated")
        return NextResponse.json({
            message:"user is not authenticated",
            success:false
        },{status:400})
    }
    const userID = user?._id
    const {acceptMessages}= await request.json()
    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            userID,
            {
                isAcceptingMessage:acceptMessages
            },
            {new:true}
        )
        if(!updatedUser){
            return NextResponse.json({
            message:"something went wrong during toggling accepting message",
            success:false
        },{status:400})
        }
        
       return NextResponse.json({
        message:"message accepting toggled successfully",
        success:true,
        updatedUser
       },{status:200})
        
    } catch (error) {
        console.log("something went wrong during toggling accepting message",error)
        return NextResponse.json({
            message:"something went wrong during toggling accepting message",
            success:false
        },{status:500})
    }
}


export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User
     if(!session || !session.user){
         console.log("user is not authenticated");
         return NextResponse.json({
             message:"user is not authenticated",
             success:false
         },{
             status:400
         })
     }
     const userID= user._id

    try {
        const newUser= await UserModel.findById(userID)
        if(!newUser){
             return NextResponse.json({
            message:"user not found during getting message acceptance status",
            success:false
        },{status:400})
        }
        const isAcceptingMessage = newUser.isAcceptingMessage
        return NextResponse.json({
            message:"user fetched succesfully",
            success:true,
            isAcceptingMessage
        },{status:400})
    } catch (error) {
        console.log("something went wrong during message accepting toggle",error)
        return NextResponse.json({
            message:"something went wrong during message accepting toggle",
            success:false
        },{status:500})
    }
}