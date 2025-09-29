import mongoose from "mongoose";
import User from "./userModel.js";

const { Schema } = mongoose;

const followSchema = new Schema(
  {
    follower:  { type: Schema.Types.ObjectId, ref: "User", required: true },
    following: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Запретим дубли и самоподписку
followSchema.index({ follower: 1, following: 1 }, { unique: true });
followSchema.pre("save", function (next) {
  if (this.follower.equals(this.following)) {
    return next(new Error("Нельзя подписаться на самого себя"));
  }
  next();
});

// Методы для подписки / отписки с обновлением счётчиков 
followSchema.statics.follow = async function (followerId, followingId) {
  if (followerId.equals(followingId)) throw new Error("Нельзя подписаться на самого себя");

  const res = await this.updateOne(
    { follower: followerId, following: followingId },
    { $setOnInsert: { follower: followerId, following: followingId } },
    { upsert: true }
  ).exec();

  if (res.upsertedCount === 1) {
    await User.updateOne({ _id: followerId }, { $inc: { followingCount: 1 } }).exec();
    await User.updateOne({ _id: followingId }, { $inc: { followersCount: 1 } }).exec();
  }
};

followSchema.statics.unfollow = async function (followerId, followingId) {
  const res = await this.deleteOne({ follower: followerId, following: followingId }).exec();

  if (res.deletedCount && res.deletedCount > 0) {
    await User.updateOne({ _id: followerId }, { $inc: { followingCount: -1 } }).exec();
    await User.updateOne({ _id: followingId }, { $inc: { followersCount: -1 } }).exec();
  }
};

const Follow = mongoose.model("Follow", followSchema);
export default Follow;
