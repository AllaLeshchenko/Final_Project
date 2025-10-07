import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Like from "../models/likeModel.js";
import Comment from "../models/commentModel.js";
import Follow from "../models/followModel.js";

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

    // Сохраняем пост — хук pre('save') автоматически увеличит postsCount
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
      .populate("author", "userName fullName bio profileImage");

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Проверяем лайк
    const like = await Like.findOne({ user: req.userId, post: post._id });
    const isLiked = !!like;

    // Получаем все комментарии к посту
    const comments = await Comment.find({ post: post._id })
      .populate("user", "userName fullName profileImage")
      .sort({ createdAt: -1 });

    res.json({
      _id: post._id,
      content: post.content,
      image: post.image,
      likesCount: post.likesCount,
      commentsCount: comments.length,
      createdAt: post.createdAt,
      author: post.author,
      isLiked,
      comments,
    });
  } catch (error) {
    console.error("Get post by id error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Получить все посты с автором, статусом лайка и количеством комментариев
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "userName fullName bio profileImage")
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    let likedPostIds = [];
    if (req.userId) {
      const likes = await Like.find({ user: req.userId }).select("post");
      likedPostIds = likes.map((like) => like.post.toString());
    }

    const postIds = posts.map((p) => p._id);
    const commentsByPost = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$post",
          comments: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
    ]);

    const commentsMap = {};
    for (const entry of commentsByPost) {
      commentsMap[entry._id.toString()] = {
        count: entry.count,
        comments: entry.comments.slice(0, 2),
      };
    }

    const result = await Promise.all(
      posts.map(async (post) => {
        const postId = post._id.toString();
        const commentsData = commentsMap[postId] || { count: 0, comments: [] };

        const populatedComments = await Comment.populate(commentsData.comments, {
          path: "user",
          select: "userName fullName profileImage",
        });

        // Проверяем подписку на автора
        const isFollowed = req.userId
          ? !!(await Follow.exists({ follower: req.userId, following: post.author._id }))
          : false;

        return {
          _id: post._id,
          content: post.content,
          image: post.image,
          likesCount: post.likesCount,
          commentsCount: commentsData.count,
          createdAt: post.createdAt,
          author: post.author,
          isLiked: likedPostIds.includes(postId),
          isFollowed,               // <-- новое поле
          lastComments: populatedComments,
        };
      })
    );

    res.json(result);
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
    if (post.author.toString() !== req.userId) return res.status(403).json({ message: "Not authorized" });

    await Post.findByIdAndDelete(req.params.id);

    // уменьшаем postsCount
    await User.findByIdAndUpdate(req.userId, { $inc: { postsCount: -1 } });

    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Delete post error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

