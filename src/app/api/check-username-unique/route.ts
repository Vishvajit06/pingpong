import { NextRequest,NextResponse } from "next/server";
import { dbConnect } from "@/lib/ConfigDb";
import { usernameValidation } from "@/schemas/signUpSchema";
import UserModel from "@/models/User";
import z from "zod";




const usernameQuerySchema=z.object({
    username:usernameValidation
})

export async function GET(request:NextRequest) {
    await dbConnect();
    try {
            const {searchParams}=new URL(request.url)
            const queryParam = {
                username:searchParams.get('username')
            }

            const result = usernameQuerySchema.safeParse(queryParam);
            if(!result.success){
                const usernameErrors = result.error.format().username?._errors
                return NextResponse.json({
                    message:usernameErrors?.length ?usernameErrors?.join(','):"username is invalid",
                    success:false
                },{status:400})
            }

            const {username}=result.data
            const existingVerifiedUser = await UserModel.findOne({username:username,isVarified:true})
            console.log(existingVerifiedUser)
            if(existingVerifiedUser){
                return NextResponse.json({
                    message:"username is already taken",
                    success:false
                },{status:400})
            }

          return NextResponse.json({
                    message:"username is unique",
                    success:true
                },{status:200})

    } catch (error) {
        console.log("error in checking username",error)
        return NextResponse.json({
            message:"error in checking username",
            success:false
        },{status:500})
    }
}