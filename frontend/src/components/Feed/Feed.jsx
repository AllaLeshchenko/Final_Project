import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../../redux/slices/postSlice";
import Post from "../Post/Post";
import styles from "./Feed.module.css";

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  console.log("Redux posts:", posts);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  if (loading) {
    return <div className={styles.message}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.message}>Error: {error}</div>;
  }

  if (!posts.length) {
    return <div className={styles.message}>There are no posts yet</div>;
  }

  // ✅ Сортируем посты по дате создания: новые сверху
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className={styles.feed}>
      {sortedPosts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Feed;


