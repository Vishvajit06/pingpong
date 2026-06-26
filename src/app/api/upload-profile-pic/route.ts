import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConfigDb";
import cloudinary from "@/helpers/cloudinary";
import UserModel from "@/models/User";



export async function POST(req:NextRequest){
    await dbConnect()
   try {
     const session = await getServerSession(authOptions)
     if(!session){
         return NextResponse.json({message:"unauthorized access "},{status:400})
     }
     const body = await req.formData()
     const file = body.get("image") as File
 
     if(!file){
         return NextResponse.json({message:"please provide a vaild file"},{status:402})
     }
 
     const bytes = await file.arrayBuffer();
     const buffer = Buffer.from(bytes)

     let result;

    try {
         result = await new Promise<any>((resolve,reject)=>{
                cloudinary.uploader.upload_stream(
                    {
                    folder:"profile-picture"
                    },(error,result)=>{
                        if(error){ 
                            reject(error)
                            return
                        }
                        else resolve(result)
                    }
            ).end(buffer)
        })
    } catch (error) {
        return NextResponse.json({message:"unable to upload profile pic"},{status:500})
    }

    const user = await UserModel.findByIdAndUpdate(
                    session.user._id,
                    {
                      profilePicture:result.secure_url
                    }
                )
    if(!user){
        return NextResponse.json({message:"unable to update the user profile"},{status:400})
    }
    
    return NextResponse.json({message:"user profile updated",url:result.secure_url},{status:200})

   } catch (error) {
    console.log("something went wrong during profile update",error)
    return NextResponse.json({message:"internal server error during profile update"},{status:500})
   }

}