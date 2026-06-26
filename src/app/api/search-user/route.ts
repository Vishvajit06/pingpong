import { dbConnect } from "@/lib/ConfigDb";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request:NextRequest){
    await dbConnect();
    try {

        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({message:"Unauthorized access"},{status:401})
        }

        const {username} = await request.json();
  
        if(!username?.trim()){
            return NextResponse.json({message:"please provide the valid username"})
        }
        const search = username.toLowerCase();

        const users = await UserModel.find(
          {  username:{
                $gte:search,
                $lt: search + "\uffff"
            }
            },
            {
                _id:0,
                username:1,
                profilePicture:1
            }
        )
        .sort({username:1})
        .limit(10)
        .lean()



        return NextResponse.json({message:"user fetched successfuly",data:users},{status:200})


        
    } catch (error) {
        console.log("something went wrong during sending reply",error)
        return NextResponse.json({messsage:"internal server error"},{status:500})
    }
    

}