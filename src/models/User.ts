import mongoose, {Schema,Document} from "mongoose";

export interface Message extends Document{
     _id: string;
    content:string,
    createdAt:Date
    reply:string
}

// const messageSchema: Schema<Message>= new Schema({
//     content:{
//         type:String,
//         required:true
//     },
//     createdAt:{
//         type:Date,
//         required:true,
//         default:Date.now
//     }
// })



export interface User{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isAcceptingMessage:boolean,
    isVerified:boolean;
    profilePicture:string;
}


const userSchema:Schema<User>= new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:true,
        lowerCase:true,
        trim:true,
        index:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
       
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        trim:true,
        match:[/.+\@.+\..+/,'please use a valid email id'],
        index:true

        
    },
    verifyCode:{
        type:String,
        required:[true,"verifycode is required"],

        
    },
     verifyCodeExpiry:{
        type:Date,
        required:[true,"verifycode expirey is required"]
     },
     isVerified:{
        type:Boolean,
        required:true,
        default:false
 
     },
     isAcceptingMessage:{
        type:Boolean,
        required:true,
        default:false
 
     },
     profilePicture:{
        type:String,
        default:""
     }

})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",userSchema)

export default UserModel;
