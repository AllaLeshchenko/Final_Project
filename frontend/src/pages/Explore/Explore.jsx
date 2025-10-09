import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../../redux/slices/postSlice";
import Layout from "../../components/Layout/Layout";
import styles from "./Explore.module.css";

const Explore = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const [visiblePosts, setVisiblePosts] = useState(12);
  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
      setVisiblePosts((prev) => Math.min(prev + 12, posts.length));
    }
  };

  return (
    <Layout>
      <div
        className={styles.postsContainer}
        ref={containerRef}
        onScroll={handleScroll}
      >
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        {!loading && !error && (
          <div className={styles.postsSection}>
            {posts.length === 0 ? (
              <p className={styles.noPosts}>No posts yet</p>
            ) : (
              <div className={styles.postsGrid}>
                {posts.slice(0, visiblePosts).map((post) => (
                  <img
                    key={post._id}
                    src={
                      post.image?.startsWith("data:image")
                        ? post.image
                        : post.image?.startsWith("http")
                        ? post.image
                        : `/uploads/${post.image}`
                    }
                    alt="post"
                    className={styles.postImage}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Explore;


