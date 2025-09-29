import Message from "../models/messageModel.js";

// Получить историю чата между 2 пользователями
export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req; // текущий пользователь
    const { recipientId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "userName fullName profileImage")
      .populate("recipient", "userName fullName profileImage");

    res.json(messages);
  } catch (error) {
    console.error("Get chat history error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
