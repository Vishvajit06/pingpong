import { NextAuthOptions ,User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/ConfigDb";
import UserModel from "@/models/User";



export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials: {
     email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials:any):Promise<any>{
        await dbConnect();
        try {

          const user:any=  await UserModel.findOne({
                $or:[
                    { email: credentials.email },
                    { username: credentials.username },
                ]
            })
            if(!user){
                console.log(credentials.identifier.email)
                throw new Error("noo user found with this email")
            }
            if(!user.isVerified){
                throw new Error("please verify your email before login")
            }
           const isPasswordCorrect= await bcrypt.compare(credentials.password,user.password)
           if(isPasswordCorrect){
            return user
           }else{
            throw new Error("password is incorrect")
           }

        } catch (error:any) {
            throw new Error(error);
        }
    }
        })
    ],
    callbacks: {
    async session({ session, token }) {
        if(token){
            session.user._id=token._id,
            session.user.isVerified=token.isVerified,
            session.user.isAcceptingMessages=token.isAcceptingMessages,
            session.user.username=token.username
            session.user.profilePicture = token.profilePicture
        }

      return session
    },
    async jwt({ token, user , trigger,session }) {
        if(user){
            token._id=user._id,
            token.isVerified=user.isVerified,
            token.isAcceptingMessages=user.isAcceptingMessages,
            token.username=user.username
            token.profilePicture = user.profilePicture
        }
         if (trigger === "update") {
        token.profilePicture = session.profilePicture;
        }
      return token
    }
},
    pages:{
        signIn:"/sign-in"
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}