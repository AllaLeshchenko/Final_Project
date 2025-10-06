import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectToDatabase from "./src/config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import postRoutes from "./src/routes/postRoutes.js";
import searchRoutes from "./src/routes/searchRoutes.js";
import followRoutes from "./src/routes/followRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import likeRoutes from "./src/routes/likeRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import initChatSocket from "./src/sockets/chatSocket.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// MIDDLEWARE 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS (разрешаем фронтенду работать с API)
const corsOptions = {
  origin: "http://localhost:5173",                // фронтенд на Vite
  methods: ["GET", "POST", "PUT", "DELETE"],      // для авторизации через куки/токены
  credentials: true,
};
app.use(cors(corsOptions));

// ROUTES 
app.get("/", (_req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);                  // регистрация, логин
app.use("/api/users", userRoutes);                 // профиль, обновление
app.use("/api/posts", postRoutes);                 // посты CRUD
app.use("/api/search", searchRoutes);              // поиск пользователей
app.use("/api/follows", followRoutes);             // подписки (если созданы)
app.use("/api/notifications", notificationRoutes); // уведомления
app.use("/api/messages", messageRoutes);           // история сообщений
app.use("/api/likes", likeRoutes);                 // лайки для постов
app.use("/api/comments", commentRoutes);           // комментарии для постов
app.use("/uploads", express.static("uploads"));



// SOCKET.IO 
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initChatSocket(io);

// SERVER START 
server.listen(PORT, async () => {
  try {
    await connectToDatabase();
    console.log(`Server running on: http://localhost:${PORT}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
  }
});

