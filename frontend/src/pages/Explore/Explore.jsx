import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../../redux/slices/postSlice";
import Layout from "../../components/Layout/Layout";
import styles from "./Explore.module.css";

const Explore = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  return (
    <Layout>
      <div className={styles.postsContainer}>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        {!loading && !error && (
          <div className={styles.postsSection}>
            {posts.length === 0 ? (
              <p className={styles.noPosts}>No posts yet</p>
            ) : (
              <div className={styles.postsGrid}>
                {posts.slice(0, 12).map((post) => (
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
