import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    userName: { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio:      { type: String, default: "", trim: true },
    profileImage: { type: String, default: "" }, // base64 строка

    // Счётчики 
    postsCount:     { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Хеширование пароля перед сохранением
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Виртуальные поля 
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
  justOne: false,
});

userSchema.virtual("followers", {
  ref: "Follow",
  localField: "_id",
  foreignField: "following",
  justOne: false,
  options: {
    populate: { path: "follower", model: "User" },
  },
});

userSchema.virtual("following", {
  ref: "Follow",
  localField: "_id",
  foreignField: "follower",
  justOne: false,
  options: {
    populate: { path: "following", model: "User" },
  },
});

const User = mongoose.model("User", userSchema);
export default User;

