import Follow from "../models/followModel.js";
import Notification from "../models/notificationModel.js";

// Подписка на пользователя
export const followUser = async (req, res) => {
  try {
    const followerId = req.userId;
    const { id: followingId } = req.params;

    if (followerId === followingId) {
      return res.status(400).json({ message: "Нельзя подписаться на себя" });
    }

    // Проверка: есть ли уже подписка
    const existing = await Follow.findOne({ follower: followerId, following: followingId });
    if (existing) {
      return res.status(400).json({ message: "Вы уже подписаны" });
    }

    const follow = await Follow.create({ follower: followerId, following: followingId });

    await Notification.create({
      recipient: followingId,
      sender: followerId,
      type: "follow",
    });

    res.json({ message: "✅ Подписка успешна", follow });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ message: "Ошибка при подписке", error: error.message });
  }
};

// Отписка от пользователя
export const unfollowUser = async (req, res) => {
  try {
    const followerId = req.userId;
    const { id: followingId } = req.params;

    const follow = await Follow.findOneAndDelete({ follower: followerId, following: followingId });
    if (!follow) {
      return res.status(404).json({ message: "Подписка не найдена" });
    }

    res.json({ message: "Вы отписались" });
  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({ message: "Ошибка при отписке", error: error.message });
  }
};

// Получить всех подписчиков
export const getFollowers = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const followers = await Follow.find({ following: userId })
      .populate("follower", "userName fullName profileImage");
    res.json(followers.map(f => f.follower));
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении подписчиков", error: error.message });
  }
};

// Получить всех, на кого подписан
export const getFollowing = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const following = await Follow.find({ follower: userId })
      .populate("following", "userName fullName profileImage");
    res.json(following.map(f => f.following));
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении подписок", error: error.message });
  }
};


