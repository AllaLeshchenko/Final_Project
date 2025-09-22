// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const postSchema = new Schema({
//   author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   images: [String], // URL-ы (рекомендуется хранить в S3/Cloudinary)
//   caption: String,
//   likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
//   comments: [{
//     user: { type: Schema.Types.ObjectId, ref: 'User' },
//     text: String,
//     createdAt: { type: Date, default: Date.now }
//   }]
// }, { timestamps: true });

// postSchema.index({ caption: 'text' });

// module.exports = mongoose.model('Post', postSchema);
