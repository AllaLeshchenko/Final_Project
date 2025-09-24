import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;

    if (!fullName || !userName || !email || !password) {
      return res.status(400).json({
        error: "Full name, user name, email, password are required!",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const newUser = new User({
      fullName,
      userName,
      email,
      password,
    });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { _id: newUser._id, userName, email },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Error with registering user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    console.log(password)
    console.log(user.password)
    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Создаём JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Сохраняем токен в httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // в продакшене только HTTPS
      sameSite: "Strict", // можно "None" если фронт и бэк на разных доменах
      maxAge: 60 * 60 * 1000, // 1 час
    });

    res.json({ message: "User logged in successfully" });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Server error with login user" });
  }
};