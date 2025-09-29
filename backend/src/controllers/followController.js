import Follow from "../models/followModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js"; // нужно для populate

// 📌 Подписка на пользователя
export const followUser = async (req, res) => {
  try {
    const followerId = req.userId;             // текущий пользователь (из токена)
    const { id: followingId } = req.params;    // на кого подписываемся

    await Follow.follow(followerId, followingId);

    // создаём уведомление для пользователя, на которого подписались
    await Notification.create({
      recipient: followingId,
      sender: followerId,
      type: "follow",
    });

    res.json({ message: "✅ Подписка успешна" });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ message: "❌ Ошибка при подписке", error });
  }
};

// 📌 Отписка от пользователя
export const unfollowUser = async (req, res) => {
  try {
    const followerId = req.userId;
    const { id: followingId } = req.params;

    await Follow.unfollow(followerId, followingId);

    res.json({ message: "✅ Вы отписались" });
  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({ message: " Ошибка при отписке", error });
  }
};

// Получить всех подписчиков пользователя (кто подписан на него)
export const getFollowers = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const followers = await Follow.find({ following: userId })
      .populate("follower", "userName fullName profileImage"); // достаём данные подписчиков

    res.json(followers.map(f => f.follower));
  } catch (error) {
    console.error("Get followers error:", error);
    res.status(500).json({ message: "❌ Ошибка при получении подписчиков", error });
  }
};

// Получить всех, на кого подписан пользователь
export const getFollowing = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const following = await Follow.find({ follower: userId })
      .populate("following", "userName fullName profileImage"); // достаём данные подписок

    res.json(following.map(f => f.following));
  } catch (error) {
    console.error("Get following error:", error);
    res.status(500).json({ message: "❌ Ошибка при получении подписок", error });
  }
};


