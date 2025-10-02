import Notification from "../models/notificationModel.js";

// Получить все уведомления для текущего пользователя
export const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })                              // новые сверху
      .populate("sender", "userName fullName profileImage") // чтобы видеть кто
      .populate("post", "content")                          // если лайк/коммент → подтянем пост
      .populate("comment", "text");                         // если коммент → подтянем текст

    res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Отметить все уведомления как прочитанные
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: "Все уведомления отмечены как прочитанные" });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Удалить одно уведомление
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Уведомление не найдено" });
    }

    if (notification.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Нет доступа" });
    }

    await notification.deleteOne();

    res.json({ message: "Уведомление удалено" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
