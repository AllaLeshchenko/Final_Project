import Post from "../models/postModel.js";

// Создание поста (требуется авторизация)
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const newPost = new Post({
      author: req.userId,
      content,
    });

    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      newPost.image = base64Image;
    }

    await newPost.save();

    res.status(201).json({ message: "Post created", post: newPost });
  } catch (error) {
    console.error("Create post error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Получение поста по ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "userName fullName profileImage");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ post });
  } catch (error) {
    console.error("Get post error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Получение всех постов (лента)
export const getAllPosts = async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "userName fullName profileImage")
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.json(posts);
  } catch (error) {
    console.error("Get all posts error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Получение постов конкретного пользователя
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "userName fullName profileImage")
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "This user has no posts yet" });
    }

    res.json(posts);
  } catch (error) {
    console.error("Get user posts error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Обновление поста (требуется авторизация)
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!req.body.content && !req.file) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    if (req.body.content) post.content = req.body.content;

    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      post.image = base64Image;
    }

    await post.save();
    res.json({ message: "Post updated", post });
  } catch (error) {
    console.error("Update post error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Удаление поста (требуется авторизация)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Delete post error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


