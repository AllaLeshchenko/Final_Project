import mongoose from "mongoose";
import User from "./userModel.js";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    author:  { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    image:   { type: String, default: "" }, // base64 или URL

    // Счётчики
    likesCount:     { type: Number, default: 0 },
    commentsCount:  { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Хуки для обновления postsCount у User 

// После создания поста → увеличиваем postsCount у автора
postSchema.post("save", async function (doc) {
  if (this.isNew) {
    await User.updateOne({ _id: doc.author }, { $inc: { postsCount: 1 } }).exec();
  }
});

// После удаления поста → уменьшаем postsCount у автора
postSchema.post("deleteOne", { document: true }, async function () {
  const doc = this;
  await User.updateOne({ _id: doc.author }, { $inc: { postsCount: -1 } }).exec();
});

const Post = mongoose.model("Post", postSchema);
export default Post;
