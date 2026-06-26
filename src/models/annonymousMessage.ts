
import mongoose, {Schema,Types} from "mongoose";


export interface MessageSchema{
    senderId:Types.ObjectId;
    receiverId:Types.ObjectId;
    content:string;
    tag:string;
    createdAt: Date;
    updatedAt: Date;
    reply?:string;

}

const messageSchema:Schema<MessageSchema> = new Schema({
    senderId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    receiverId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    content:{
        type:String,
        required:true
    },
    tag:{
      type: String,
      enum: ["crush", "roast", "advice", "confession", "general"],
      default: "general",
      index: true
    },
    // sentiment: {
    //   type: String,
    //   enum: ["positive", "neutral", "toxic"],
    //   default: "neutral"
    // },
    reply:{
        type:String,
        default:""
    },

 

}, {timestamps:true})

 const AnnonymousMessage = (mongoose.models.AnnonymousMessage as mongoose.Model<MessageSchema>) || mongoose.model("AnnonymousMessage",messageSchema)

 export default AnnonymousMessage