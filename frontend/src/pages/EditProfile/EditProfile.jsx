import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { fetchUserById, updateUserProfile } from "../../redux/slices/userSlice";
import styles from "./EditProfile.module.css";

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading } = useSelector((state) => state.user);
  const { user: authUser } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (authUser?._id) {
      dispatch(fetchUserById(authUser._id));
    }
  }, [dispatch, authUser]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setUserName(user.userName || "");
      setBio(user.bio || "");
      setProfileImage(user.profileImage || "");
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("userName", userName);
    formData.append("bio", bio);
    if (profileImage.startsWith("data:image")) {
      // добавляем только если новое изображение
      const blob = fetch(profileImage).then((res) => res.blob());
      blob.then((b) => {
        formData.append("profileImage", b, "profile.jpg");
        dispatch(updateUserProfile(formData)).then(() => {
          navigate(`/profile/${authUser._id}`);
        });
      });
    } else {
      dispatch(updateUserProfile(formData)).then(() => {
        navigate(`/profile/${authUser._id}`);
      });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <div className={styles.container}>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.imageSection}>
            <img
              src={profileImage || "/default-avatar.png"}
              alt="avatar"
              className={styles.avatar}
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <label>
            Full Name
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>

          <label>
            Username
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>

          <label>
            Bio
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </label>

          <button type="submit" className={styles.saveBtn}>
            Save changes
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default EditProfile;
