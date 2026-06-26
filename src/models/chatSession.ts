import mongoose, {  Types, Schema } from "mongoose";


export interface chatSessionSchema {
    user1: Types.ObjectId,
    user2: Types.ObjectId,
    createdAt: Date,
    isAnnonymous: boolean
}


const chatSessionSchema = new Schema({
    user1: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    user2: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    isAnnonymous: {
        type: Boolean,
        default: true
    }
})

const ChatSession = mongoose.models.ChatSession || mongoose.model("ChatSession", chatSessionSchema)

export default ChatSession

