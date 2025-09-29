import express from "express";
import http from "http"; // нужно для socket.io
import { Server } from "socket.io";
import connectToDatabase from "./src/config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import postRoutes from "./src/routes/postRoutes.js";
import searchRoutes from "./src/routes/searchRoutes.js";
import followRoutes from "./src/routes/followRoutes.js"; // если у тебя есть
import notificationRoutes from "./src/routes/notificationRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import Message from "./src/models/messageModel.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// MIDDLEWARE 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS (разрешаем фронтенду работать с API)
const corsOptions = {
  origin: "http://localhost:5173", // фронтенд на Vite
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // для авторизации через куки/токены
};
app.use(cors(corsOptions));

// ROUTES 
app.get("/", (_req, res) => {
  res.send("✅ API is running...");
});

app.use("/api/auth", authRoutes);                  // регистрация, логин
app.use("/api/users", userRoutes);                 // профиль, обновление
app.use("/api/posts", postRoutes);                 // посты CRUD
app.use("/api/search", searchRoutes);              // поиск пользователей
app.use("/api/follows", followRoutes);             // подписки (если созданы)
app.use("/api/notifications", notificationRoutes); // уведомления
app.use("/api/messages", messageRoutes);           // история сообщений

// SOCKET.IO 
// создаём http-сервер поверх express
const server = http.createServer(app);

// инициализация socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// карта онлайн-пользователей (userId → socketId)
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 Новый пользователь подключился:", socket.id);

  // регистрация пользователя в онлайне
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`✅ Пользователь ${userId} онлайн`);
  });

  // отправка сообщения
  socket.on("message", async ({ sender, recipient, text }) => {
    try {
      const message = await Message.create({ sender, recipient, text });

      // если получатель в сети — отправляем ему
      const recipientSocket = onlineUsers.get(recipient.toString());
      if (recipientSocket) {
        io.to(recipientSocket).emit("message", message);
      }
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  });

  // отключение
  socket.on("disconnect", () => {
    console.log(" Пользователь отключился:", socket.id);
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// SERVER START 
server.listen(PORT, async () => {
  try {
    await connectToDatabase();
    console.log(`Server running on: http://localhost:${PORT}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
  }
});

