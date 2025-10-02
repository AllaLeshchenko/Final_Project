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

// После создания подписки → увеличиваем follower/following
followSchema.post("save", async function(doc) {
  try {
    await User.updateOne({ _id: doc.follower }, { $inc: { followingCount: 1 } });
    await User.updateOne({ _id: doc.following }, { $inc: { followersCount: 1 } });
  } catch (err) {
    console.error("Error updating follow counts:", err);
  }
});

// После удаления подписки → уменьшаем follower/following
followSchema.post("findOneAndDelete", async function(doc) {
  if (doc) {
    try {
      await User.updateOne({ _id: doc.follower }, { $inc: { followingCount: -1 } });
      await User.updateOne({ _id: doc.following }, { $inc: { followersCount: -1 } });
    } catch (err) {
      console.error("Error decrementing follow counts:", err);
    }
  }
});

const Follow = mongoose.model("Follow", followSchema);
export default Follow;
