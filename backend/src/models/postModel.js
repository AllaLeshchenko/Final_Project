import mongoose from "mongoose";
import User from "./userModel.js";
import Like from "./likeModel.js";
import Comment from "./commentModel.js";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 2000 },
    image: { type: String, default: "" }, 
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// После сохранения поста → увеличиваем postsCount у автора
postSchema.pre("save", async function(next) {
  if (this.isNew) {
    try {
      await User.findByIdAndUpdate(this.author, { $inc: { postsCount: 1 } });
    } catch (err) {
      console.error("Error incrementing postsCount:", err);
    }
  }
  next();
});

// После удаления поста → уменьшаем postsCount у автора
postSchema.pre("deleteOne", { document: true }, async function (next) {
  try {
    await User.updateOne(
      { _id: this.author },
      { $inc: { postsCount: -1 } }
    ).exec();
    next();
  } catch (err) {
    next(err);
  }
});

// Методы для лайков
postSchema.statics.incrementLikes = async function(postId) {
  await this.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
};

postSchema.statics.decrementLikes = async function(postId) {
  await this.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
};

// Методы для комментариев
postSchema.statics.incrementComments = async function(postId) {
  await this.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
};

postSchema.statics.decrementComments = async function(postId) {
  await this.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } });
};

// Виртуальные поля для populating
postSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

const Post = mongoose.model("Post", postSchema);
export default Post;

