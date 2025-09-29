import mongoose from "mongoose";

const { Schema } = mongoose;

const likeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

// Уникальность: один лайк на одного пользователя
likeSchema.index({ user: 1, post: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);
export default Like;

