import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../../redux/slices/postSlice";
import Post from "../Post/Post";
import styles from "./Feed.module.css";

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  if (loading) {
    return <div className={styles.message}>Загрузка постов...</div>;
  }

  if (error) {
    return <div className={styles.message}>Ошибка: {error}</div>;
  }

  if (!posts.length) {
    return <div className={styles.message}>Постов пока нет</div>;
  }

  return (
    <div className={styles.feed}>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
