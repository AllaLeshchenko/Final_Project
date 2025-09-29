import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true }, // кому
    sender:    { type: Schema.Types.ObjectId, ref: "User", required: true }, // кто
    type: {
      type: String,
      enum: ["follow", "like", "comment"],
      required: true,
    },
    post:     { type: Schema.Types.ObjectId, ref: "Post" },     // если лайк/коммент
    comment:  { type: Schema.Types.ObjectId, ref: "Comment" }, // если комментарий
    isRead:   { type: Boolean, default: false },                // прочитано или нет
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

