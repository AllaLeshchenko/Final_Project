import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserById, clearUser } from "../../redux/slices/userSlice";
import Layout from "../../components/Layout/Layout";
import MyPost from "../../components/MyPost/MyPost";
import styles from "./Profile.module.css";
import axios from "axios";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();

  const { user, loading, error } = useSelector((state) => state.user);
  const { user: authUser } = useSelector((state) => state.auth);

  const isMyProfile = authUser?._id === userId;

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  // Загружаем пользователя и его посты
  useEffect(() => {
    dispatch(fetchUserById(userId));

    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/posts/user/${userId}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Ошибка загрузки постов:", err);
      }
    };
    fetchPosts();

    return () => {
      dispatch(clearUser());
      setPosts([]);
    };
  }, [dispatch, userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>User not found</p>;

  // Обрезаем bio до 300 символов
  const shortBio =
    user.bio && user.bio.length > 300
      ? user.bio.slice(0, 300) + "...more"
      : user.bio;

  return (
    <Layout>
      <div className={styles.profileContainer}>
        {/* Верхняя часть профиля */}
        <div className={styles.topSection}>
          {/* Аватар */}
          <div className={styles.avatarWrapper}>
            <img
              src={user.profileImage || "/default-avatar.png"}
              alt="profile"
              className={styles.avatar}
            />
            <img
              src="/src/assets/profileImg.png"
              alt="frame"
              className={styles.avatarFrame}
            />
          </div>

          {/* Информация справа */}
          <div className={styles.userInfo}>
            <div className={styles.usernameRow}>
              <h2 className={styles.username}>{user.userName}</h2>
              {isMyProfile && (
                <button
                  className={styles.editButton}
                  onClick={() => navigate("/edit-profile")}
                >
                  Edit profile
                </button>
              )}
            </div>

            <div className={styles.stats}>
              <p>
                <strong>{user.postsCount}</strong> posts
              </p>
              <p>
                <strong>{user.followersCount}</strong> followers
              </p>
              <p>
                <strong>{user.followingCount}</strong> following
              </p>
            </div>

            <div className={styles.bioSection}>
              <p className={styles.bio}>{shortBio}</p>
            </div>
          </div>
        </div>

        {/* Сетка постов */}
        <div className={styles.postsSection}>
          {posts.length === 0 ? (
            <p className={styles.noPosts}>No posts yet</p>
          ) : (
            <div className={styles.postsGrid}>
              {posts.map((post) => (
                <img
                  key={post._id}
                  src={
                      post.image.startsWith("data:image")
                        ? post.image
                        : post.image.startsWith("http")
                        ? post.image
                        : `/uploads/${post.image}`
                    }
                  alt="post"
                  className={styles.postImage}
                  onClick={() => setSelectedPost(post)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Модальное окно поста */}
        {selectedPost && (
          <MyPost post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </div>
    </Layout>
  );
}

export default Profile;

