import { NextRequest,NextResponse } from "next/server";
import { sendVerificationEmail } from "@/helpers/sendVerificationMail";
import User from "@/models/User";
import bcrypt from 'bcryptjs'
import { dbConnect } from "@/lib/ConfigDb";





export async function POST(request:NextRequest) {
    await dbConnect();
   try {
     const reqbody= await request.json();
     const {username,email,password} = reqbody
     const existingUserVerifiedByUsername= await User.findOne({
        username,
        isVerified:true
     })
     if(existingUserVerifiedByUsername){
        return NextResponse.json({
            success:false,
            message:"username is already taken"
        },{status:400})
     }

     const existingUserByEmail:any = await User.findOne({email});
      const verifyCode= Math.floor(100000+Math.random()*900000).toString();
     if(existingUserByEmail){
        if(existingUserByEmail.isVarified){
            return NextResponse.json({
            success:false,
            message:"email already registered"
         },{status:400})
        }
        else{
            const hashedPassword = await bcrypt.hash(password,10);
            existingUserByEmail.password=hashedPassword;
            existingUserByEmail.verifyCode=verifyCode;
            existingUserByEmail.verifyCodeExpiry= new Date(Date.now()+3600000);
            await existingUserByEmail.save();
            console.log("user exist but not verified")
        }
     }else{
        const salt = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(password,salt);
        
         const newUser = new User({
            username,
            email,
            password:hashedPassword,
            verifyCode,
            verifyCodeExpiry:new Date(Date.now()+60*60*1000),
            messages:[],
            isAcceptingMessage:true
         })
         await newUser.save();
        }

        // send verification email
        const emailResponse= await sendVerificationEmail(email,username,verifyCode);
        if(!emailResponse.success){
            return NextResponse.json({
                success:false,
                message:emailResponse.message},{status:500})
        }
        console.log(emailResponse)
         return NextResponse.json({
            success:true,
            message:"user registered successfully.please verify your email"
         },{status:201})

     
   } catch (error) {
    console.log("something went during registering the user",error)
   return NextResponse.json({message:"something went wrong during registering user"},{status:500})
   }

}