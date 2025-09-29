import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    user:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    post:    { type: Schema.Types.ObjectId, ref: "Post", required: true },
    text:    { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;

