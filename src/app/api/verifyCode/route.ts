import { NextRequest,NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConfigDb";
import UserModel, { User } from "@/models/User";



export async function POST(request:NextRequest) {
    await dbConnect();
try {
    const reqBody = await request.json()
    const {username,code}= reqBody
  const decodedUsername=  decodeURIComponent(username) ;


 const user:any= await UserModel.findOne({username:decodedUsername})
 if(!user){
    return NextResponse.json({
        message:"user not found",
        success:false
    },{status:400})
 }

 const isCodeValid = user.verifyCode === code;
 const isCodeNotExpired= user.verifyCodeExpiry.getTime() > Date.now();
 if(isCodeValid && isCodeNotExpired ){
    user.isVerified = true;
   await user.save()
   return NextResponse.json({
        message:"user has been verified succesfully",
        success:true
    },{status:200})
 }
else{
    if(!isCodeValid){
        return NextResponse.json({
                message:"code is incorrect",
                success:false
            },{status:400})
    }
    else{
        return NextResponse.json({
                message:"code is expired please try again",
                success:false
            },{status:400})
    }
}

} catch (error) {
    console.log("something went wrong during code verification",error)
    return NextResponse.json({
        message:"something went wrong during code verification",
        success:false
    },{status:500})
}
}