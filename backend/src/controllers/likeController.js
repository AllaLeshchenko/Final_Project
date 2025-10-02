import Like from "../models/likeModel.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationModel.js";

// Лайк поста
export const likePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Пост не найден" });

    // Создаём лайк, но обрабатываем дубликат
    try {
      await Like.create({ user: userId, post: postId });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ message: "Вы уже лайкнули этот пост" });
      } else {
        throw err;
      }
    }

    // Увеличиваем счётчик лайков
    await Post.incrementLikes(postId);

    // Уведомление автору поста
    if (post.author.toString() !== userId.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: userId,
        type: "like",
        post: postId,
      });
    }

    res.json({ message: "Пост лайкнут" });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Удаление лайка
export const unlikePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    const deleted = await Like.findOneAndDelete({ user: userId, post: postId });
    if (deleted) {
      await Post.decrementLikes(postId); // уменьшаем счётчик лайков
    }

    res.json({ message: "Лайк удалён" });
  } catch (error) {
    console.error("Unlike error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Получить всех, кто лайкнул пост
export const getPostLikes = async (req, res) => {
  try {
    const postId = req.params.postId.trim(); // убираем лишние пробелы/переносы

    const likes = await Like.find({ post: postId })
      .populate("user", "userName fullName profileImage");

    res.json(likes.map(like => like.user));
  } catch (error) {
    console.error("Get post likes error:", error);
    res.status(500).json({ message: "Ошибка при получении лайков", error: error.message });
  }
};
