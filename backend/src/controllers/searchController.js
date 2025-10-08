import User from "../models/userModel.js";
import Post from "../models/postModel.js";

// Поиск пользователей по имени или username 
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q; // запрос из строки ?q=...
    if (!query) {
      return res.status(400).json({ message: "Введите строку для поиска" });
    }

    const users = await User.find({
  $or: [
    { fullName: { $regex: "^" + query, $options: "i" } },
    { userName: { $regex: "^" + query, $options: "i" } }
  ]
}).select("-password");

    res.json(users);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Получить всех пользователей
export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Получить все посты конкретного пользователя
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ author: userId })
      .populate("author", "userName fullName profileImage")
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "This user has no posts yet" });
    }

    res.json(posts);
  } catch (error) {
    console.error("Get user posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Explore: случайные посты 
export const explorePosts = async (_req, res) => {
  try {
    // Берём случайные посты через aggregate
    const posts = await Post.aggregate([{ $sample: { size: 20 } }]); 
    res.json(posts);
  } catch (error) {
    console.error("Explore error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
