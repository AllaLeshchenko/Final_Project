import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    sender:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text:      { type: String, required: true },
    isRead:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
