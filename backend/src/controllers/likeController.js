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

    await Like.like(userId, postId);

    // уведомляем автора поста
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
    res.status(500).json({ message: "Server error" });
  }
};

// Удалить лайк
export const unlikePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    await Like.unlike(userId, postId);

    res.json({ message: "Лайк удалён" });
  } catch (error) {
    console.error("Unlike error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

