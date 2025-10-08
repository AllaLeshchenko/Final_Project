import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // <- обязательно добавить
import likeIcon from "../../assets/like.png";
import commentIcon from "../../assets/comment.png";
import avatarFrame from "../../assets/post.png"; 
import MyPost from "../MyPost/MyPost"; 
import { timeAgo } from "../../ui/timeAgo";
import css from "./Post.module.css";

const Post = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  // синхронизируем локальное состояние, если пост обновился
  useEffect(() => {
    setIsLiked(post.isLiked);
    setLikesCount(post.likesCount);
  }, [post]);

  // берём комментарии из Redux
  const comments = useSelector(state =>
    state.comments.comments.filter(c => c.postId === post._id)
  );

  useEffect(() => {
    setCommentsCount(comments.length);
  }, [comments]);


  const handleLikeToggle = async () => {
    const token = localStorage.getItem("token");
    const url = `/api/likes/${post._id}/${isLiked ? "unlike" : "like"}`;
    const method = isLiked ? "DELETE" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setIsLiked(!isLiked);
        setLikesCount((prev) => prev + (isLiked ? -1 : 1));
      }
    } catch (err) {
      console.error("Like toggle error:", err);
    }
  };

  const formatLikes = (num) => num.toLocaleString("ru-RU");

  if (!post) return null;

  return (
    <>
      <div className={css.postCard}>
        {/* Header */}
        <div className={css.postHeader}>
          <div className={css.avatarWrapper}>
            <img src={avatarFrame} alt="frame" className={css.avatarFrame} />
            <img
              src={post.author.profileImage}
              alt={post.author.userName}
              className={css.avatar}
            />
          </div>
          <span className={css.userName}>{post.author.userName}</span>
          <span className={css.date}>{timeAgo(post.createdAt)}</span>
        </div>

        {/* Post image */}
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className={css.postImage}
            onClick={() => setIsModalOpen(true)}
          />
        )}

        {/* Actions */}
        <div className={css.actions}>
          <img
            src={likeIcon}
             alt="like"
            onClick={handleLikeToggle}
             className={`${css.icon} ${isLiked ? css.liked : ""}`}
           />
           <span className={css.count}>{likesCount}</span>

           <img src={commentIcon} alt="comment" className={css.icon} />
           <span className={css.count}>{post.commentsCount || 0}</span>     
           </div>
          <div className={css.likesText}>{formatLikes(likesCount)} likes</div>

        {/* Content */}
        <div className={css.content}>
          <div className={css.userLine}>
            <span className={css.bold}>{post.author.userName}</span>
            {post.author.bio && <span className={css.bio}>{post.author.bio}</span>}
          </div>
          <p className={css.text}>
            {expanded || post.content.length < 80
              ? post.content
              : `${post.content.slice(0, 55)}... `}
            {post.content.length > 120 && (
              <button
                className={css.more}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "less" : "more"}
              </button>
            )}
          </p>
        </div>

        <div className={css.viewAll}>
          View all comments ({post.commentsCount || 0})
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <MyPost
          post={post}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default Post;



// import React, { useState } from "react";
// import likeIcon from "../../assets/like.png";
// import commentIcon from "../../assets/comment.png";
// import avatarFrame from "../../assets/post.png"; 
// import MyPost from "../MyPost/MyPost"; 
// import { timeAgo } from "../../ui/timeAgo";

// import css from "./Post.module.css";

// const Post = ({ post }) => {
//   const [isLiked, setIsLiked] = useState(post.isLiked);
//   const [likesCount, setLikesCount] = useState(post.likesCount);
//   const [expanded, setExpanded] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false); 

//   const handleLikeToggle = async () => {
//     const token = localStorage.getItem("token");
//     const url = `/api/likes/${post._id}/${isLiked ? "unlike" : "like"}`;
//     const method = isLiked ? "DELETE" : "POST";

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.ok) {
//         setIsLiked(!isLiked);
//         setLikesCount((prev) => prev + (isLiked ? -1 : 1));
//       }
//     } catch (err) {
//       console.error("Like toggle error:", err);
//     }
//   };

//   const formatLikes = (num) => num.toLocaleString("ru-RU");

//   return (
//     <>
//       <div className={css.postCard}>
//         {/* Header */}
//         <div className={css.postHeader}>
//           <div className={css.avatarWrapper}>
//             <img src={avatarFrame} alt="frame" className={css.avatarFrame} />
//             <img
//               src={post.author.profileImage}
//               alt={post.author.userName}
//               className={css.avatar}
//             />
//           </div>

//           <span className={css.userName}>{post.author.userName}</span>

//           <span className={css.date}>{timeAgo(post.createdAt)}</span>
        
//         </div>

//         {/* Post image */}
//         {post.image && (
//           <img
//             src={post.image}
//             alt="Post"
//             className={css.postImage}
//             onClick={() => setIsModalOpen(true)} // открытие модального окна
//           />
//         )}

//         {/* Actions */}
//         <div className={css.actions}>
//           <img
//             src={likeIcon}
//             alt="like"
//             onClick={handleLikeToggle}
//             className={`${css.icon} ${isLiked ? css.liked : ""}`}
//           />
//           <span className={css.count}>{likesCount}</span>

//           <img src={commentIcon} alt="comment" className={css.icon} />
//           <span className={css.count}>{post.commentsCount || 0}</span>
//         </div>

//         <div className={css.likesText}>{formatLikes(likesCount)} likes</div>

//         {/* Content */}
//         <div className={css.content}>
//           <div className={css.userLine}>
//             <span className={css.bold}>{post.author.userName}</span>
//             {post.author.bio && <span className={css.bio}>{post.author.bio}</span>}
//           </div>
//           <p className={css.text}>
//             {expanded || post.content.length < 80
//               ? post.content
//               : `${post.content.slice(0, 55)}... `}
//             {post.content.length > 120 && (
//               <button
//                 className={css.more}
//                 onClick={() => setExpanded(!expanded)}
//               >
//                 {expanded ? "less" : "more"}
//               </button>
//             )}
//           </p>
//         </div>

//         {/* View all comments */}
//         <div className={css.viewAll}>
//           View all comments ({post.commentsCount || 0})
//         </div>
//       </div>

//       {/* Модальное окно */}
//       {isModalOpen && (
//         <MyPost post={post} onClose={() => setIsModalOpen(false)} />
//       )}
//     </>
//   );
// };

// export default Post;


