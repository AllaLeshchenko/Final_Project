import Post from '../models/postModel.js';

// Получение всех постов (лента)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username email');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Создание поста
export const createPost = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'Description required' });
    }

    let imageBase64 = null;

    if (req.file) {
      imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    } else {
      return res.status(400).json({ message: 'Photo required' });
    }

    const post = new Post({
      author: req.userId,
      image: imageBase64,
      description
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);

  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Удаление поста
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'You cannot delete this post.' });
    }

    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Получение конкретного поста по ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Обновление поста
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "You cannot edit this post." });
    }

    const { description } = req.body;

    if (description) post.description = description;

    if (req.file) {
      const imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      post.image = imageBase64;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);

  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



// Получение всех постов конкретного пользователя
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId }).populate('author', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};






