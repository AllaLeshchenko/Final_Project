import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationModel.js";

// Добавить комментарий
export const addComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Пост не найден" });

    const comment = await Comment.create({
      text,
      post: postId,
      author: userId,
    });

    // уведомляем автора поста
    if (post.author.toString() !== userId.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: userId,
        type: "comment",
        post: postId,
        comment: comment._id,
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Удалить комментарий
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Комментарий не найден" });

    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Нет прав для удаления" });
    }

    await comment.deleteOne();

    res.json({ message: "Комментарий удалён" });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

