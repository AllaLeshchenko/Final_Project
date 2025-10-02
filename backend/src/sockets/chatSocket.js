import Message from "../models/messageModel.js";

// карта онлайн-пользователей (userId → socketId)
const onlineUsers = new Map();

export default function initChatSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Новый пользователь подключился:", socket.id);

    // регистрация пользователя в онлайне
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(` Пользователь ${userId} онлайн`);
    });

    // событие отправки сообщения
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

    // событие отключения
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
}
