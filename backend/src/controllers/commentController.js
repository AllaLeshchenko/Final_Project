import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationModel.js";

// Добавить комментарий
export const addComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Комментарий пустой" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Пост не найден" });

    const comment = await Comment.create({ user: userId, post: postId, text });

    // Увеличиваем счетчик комментариев
    await Post.incrementComments(postId);

    // Уведомление автору поста
    if (post.author.toString() !== userId.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: userId,
        type: "comment",
        post: postId,
        comment: comment._id,
      });
    }
    res.json({ message: "Комментарий добавлен", comment });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Удалить комментарий
export const deleteComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Комментарий не найден" });
    if (comment.user.toString() !== userId.toString())
      return res.status(403).json({ message: "Не автор комментария" });

    await Comment.findByIdAndDelete(commentId);
    await Post.decrementComments(comment.post);

    res.json({ message: "Комментарий удалён" });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Получить все комментарии к посту
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("user", "userName fullName profileImage")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Ошибка при получении комментариев", error: error.message });
  }
};
