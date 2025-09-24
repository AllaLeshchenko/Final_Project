import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // предполагается, что есть модель User
    required: true
  },
  image: {
    type: String, // Base64 строка
    required: true
  },
  description: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);

export default Post;
