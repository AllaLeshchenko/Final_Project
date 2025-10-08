import React, { useEffect, useState } from "react";
import styles from "./MyPost.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostComments, clearComments } from "../../redux/slices/commentSlice";
import { toggleLike, addComment } from "../../redux/slices/postSlice";
import likeIcon from "../../assets/like.png";
import commentIcon from "../../assets/comment.png";

const MyPost = ({ post, onClose }) => {
  const dispatch = useDispatch();
  const { comments, loading } = useSelector((state) => state.comments);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (post?._id) dispatch(fetchPostComments(post._id));
    return () => dispatch(clearComments());
  }, [dispatch, post]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    dispatch(addComment({ postId: post._id, text: newComment }));
    setNewComment("");
  };

  if (!post) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Левая часть: изображение */}
        <div className={styles.imageSection}>
          <img src={post.image} alt="Post" className={styles.postImage} />
        </div>

        {/* Правая часть: контент */}
        <div className={styles.infoSection}>
          {/* Верхний блок: аватар + имя + кнопка */}
          <div className={styles.topRow}>
            <img src={post.author?.profileImage || "/default-avatar.png"} alt="Author" className={styles.avatar} />
            <span className={styles.username}>{post.author?.userName}</span>
            <button className={styles.followButton}>Подписаться</button>
          </div>

          {/* Контент поста */}
          <div className={styles.postContent}>
            <img src={post.author?.profileImage || "/default-avatar.png"} alt="Author" className={styles.avatar} />
            <p className={styles.postText}>{post.content}</p>
          </div>

          {/* Комментарии */}
          <div className={styles.commentsSection}>
            {loading ? (
              <p className={styles.loading}>Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className={styles.noComments}>No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className={styles.commentItem}>
                  <img src={comment.user?.profileImage || "/default-avatar.png"} alt={comment.user?.userName} className={styles.avatar} />
                  <div className={styles.commentText}>
                    <span className={styles.commentAuthor}>{comment.user?.userName}</span>
                    <p>{comment.text}</p>
                    <span className={styles.commentTime}>
                      {/* Пример: отображение разницы времени */}
                      {Math.floor((Date.now() - new Date(comment.createdAt)) / 3600000)} ч назад
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Нижний блок: действия и отправка комментария */}
          <div className={styles.actionsSection}>
            <img src={likeIcon} alt="Like" className={styles.icon} onClick={() => dispatch(toggleLike(post._id))} />
            <img src={commentIcon} alt="Comment" className={styles.icon} />
            <div className={styles.addComment}>
              <input
                type="text"
                placeholder="Написать комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleAddComment}>Отправить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPost;


// import React, { useEffect } from "react";
// import styles from "./MyPost.module.css";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchPostComments,
//   clearComments,
// } from "../../redux/slices/commentSlice";

// const MyPost = ({ post, onClose }) => {
//   const dispatch = useDispatch();
//   const { comments, loading } = useSelector((state) => state.comments);

//   // Загружаем комментарии
//   useEffect(() => {
//     if (post?._id) {
//       dispatch(fetchPostComments(post._id));
//     }
//     return () => {
//       dispatch(clearComments());
//     };
//   }, [dispatch, post]);

//   if (!post) return null;

//   return (
//     <div className={styles.overlay} onClick={onClose}>
//       <div
//         className={styles.modal}
//         onClick={(e) => e.stopPropagation()} // предотвратить закрытие при клике по контенту
//       >
//         {/* Левая часть с изображением */}
//         <div className={styles.imageSection}>
//           <img
//             src={post.image}
//             alt="Post"
//             className={styles.postImage}
//           />
//         </div>

//         {/* Правая часть */}
//         <div className={styles.infoSection}>
//           {/* Верхняя часть */}
//           <div className={styles.header}>
//             <div className={styles.headerUser}>
//               <img
//                 src={post.author?.profileImage || "/default-avatar.png"}
//                 alt="Author"
//                 className={styles.profileSmall}
//               />
//               <span className={styles.username}>{post.author?.userName}</span>
//             </div>
//             <button className={styles.closeButton} onClick={onClose}>
//               ✕
//             </button>
//           </div>

//           {/* Контент поста */}
//           <div className={styles.contentBlock}>
//             <div className={styles.contentHeader}>
//               <img
//                 src={post.author?.profileImage || "/default-avatar.png"}
//                 alt="Author"
//                 className={styles.profileSmall}
//               />
//               <p className={styles.postText}>{post.content}</p>
//             </div>
//           </div>

//           {/* Комментарии */}
//           <div className={styles.commentsSection}>
//             {loading ? (
//               <p className={styles.loading}>Loading comments...</p>
//             ) : comments.length === 0 ? (
//               <p className={styles.noComments}>No comments yet</p>
//             ) : (
//               comments.map((comment) => (
//                 <div key={comment._id} className={styles.commentItem}>
//                   <img
//                     src={comment.user?.profileImage || "/default-avatar.png"}
//                     alt={comment.user?.userName || "user"}
//                     className={styles.profileSmall}
//                   />
//                   <div className={styles.commentText}>
//                     <span className={styles.commentAuthor}>
//                       {comment.user?.userName}
//                     </span>
//                     <p>{comment.text}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyPost;



