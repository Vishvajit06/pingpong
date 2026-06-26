import mongoose, { Schema, Types, Document } from "mongoose";

export interface IChatRequest extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const chatRequestSchema: Schema<IChatRequest> = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const ChatRequest =
  mongoose.models.ChatRequest ||
  mongoose.model<IChatRequest>("ChatRequest", chatRequestSchema);

export default ChatRequest;