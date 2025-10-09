import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

// 📩 Получить все сообщения между текущим пользователем и собеседником
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;    // id собеседника
    const currentUserId = req.userId; // из middleware protect

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
    console.error("Ошибка получения сообщений:", error);
    res.status(500).json({ message: "Ошибка получения сообщений" });
  }
};

// 💬 Получить список диалогов пользователя
export const getUserDialogs = async (req, res) => {
  try {
    const userId = req.userId; // из protect

    // Найти все сообщения, где пользователь участвовал
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    }).sort({ createdAt: -1 });

    // Собрать уникальных собеседников
    const dialogMap = new Map();

    for (const msg of messages) {
      const partnerId =
        msg.sender.toString() === userId.toString()
          ? msg.recipient.toString()
          : msg.sender.toString();

      if (!dialogMap.has(partnerId)) {
        dialogMap.set(partnerId, {
          lastMessage: msg.text,
          updatedAt: msg.createdAt,
        });
      }
    }

    // Получаем информацию о собеседниках
    const dialogs = await Promise.all(
      Array.from(dialogMap.entries()).map(async ([partnerId, info]) => {
        const user = await User.findById(partnerId).select("username avatar");
        if (!user) return null;
        return {
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
          lastMessage: info.lastMessage,
          updatedAt: info.updatedAt,
        };
      })
    );

    res.json(dialogs.filter(Boolean)); // убрать null если пользователь удалён
  } catch (err) {
    console.error("Ошибка getUserDialogs:", err);
    res.status(500).json({ message: "Ошибка при получении диалогов" });
  }
};
