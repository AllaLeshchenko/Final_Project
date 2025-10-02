import Message from "../models/messageModel.js";

// Получить все сообщения между текущим пользователем и собеседником
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;    // id собеседника
    const currentUserId = req.userId; // из protect

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender recipient", "username avatar");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения сообщений" });
  }
};

