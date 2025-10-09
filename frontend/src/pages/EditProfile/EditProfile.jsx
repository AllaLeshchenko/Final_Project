import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUserById,
  updateUserProfile,
  clearUser,
} from "../../redux/slices/userSlice";
import Layout from "../../components/Layout/Layout";
import styles from "./EditProfile.module.css";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authUser = useSelector((state) => state.auth.user);
  const { user, loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    profileImage: null,
    userName: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (authUser?._id) {
      dispatch(fetchUserById(authUser._id));
    }
    return () => {
      dispatch(clearUser());
    };
  }, [dispatch, authUser]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        bio: user.bio || "",
        userName: user.userName || "",
        profileImage: null,
      });
      setPreviewImage(user.profileImage || "");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("bio", formData.bio);
      data.append("userName", formData.userName);
      if (formData.profileImage) data.append("profileImage", formData.profileImage);

      await dispatch(updateUserProfile(data)).unwrap();
      setMessage("Profile updated successfully!");
      navigate(`/profile/${authUser._id}`);
    } catch (err) {
      console.error("Update error:", err);
      setMessage("Error updating profile.");
    }
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <Layout>
      <div className={styles.container}>
        <h2 className={styles.title}>Edit Profile</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.topSection}>
            <img
              src={previewImage || "/default-avatar.png"}
              alt="Avatar"
              className={styles.avatar}
            />
            <div className={styles.infoBlock}>
              <p className={styles.userName}>{formData.userName}</p>
              <p className={styles.bio}>{formData.bio || "No bio yet"}</p>
            </div>

            <label className={styles.newPhotoBtn}>
              New photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
            </label>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>About</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className={styles.textarea}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.saveBtn}>
            {loading ? "Saving..." : "Save"}
          </button>

          {message && <p className={styles.message}>{message}</p>}
        </form>
      </div>
    </Layout>
  );
};

export default EditProfile;


// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { fetchUserById, updateUserProfile, clearUser,} from "../../redux/slices/userSlice";
// import styles from "./EditProfile.module.css";

// const EditProfile = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Получаем auth.user (авторизованный пользователь)
//   const authUser = useSelector((state) => state.auth.user);
//   const { user, loading } = useSelector((state) => state.user);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     bio: "",
//     profileImage: null,
//     userName: "",
//   });
//   const [previewImage, setPreviewImage] = useState("");
//   const [message, setMessage] = useState("");

//   // Загружаем профиль по ID при монтировании
//   useEffect(() => {
//     if (authUser?._id) {
//       dispatch(fetchUserById(authUser._id));
//     }
//     return () => {
//       dispatch(clearUser());
//     };
//   }, [dispatch, authUser]);

//   // Когда данные юзера загрузились — заполняем форму
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         fullName: user.fullName || "",
//         bio: user.bio || "",
//         userName: user.userName || "",
//         profileImage: null,
//       });
//       setPreviewImage(user.profileImage || "");
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setMessage("");
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, profileImage: file });
//       setPreviewImage(URL.createObjectURL(file));
//       setMessage("");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//    const data = new FormData();
//      data.append("fullName", formData.fullName);
//      data.append("bio", formData.bio);
//      data.append("userName", formData.userName);
//      if (formData.profileImage) data.append("profileImage", formData.profileImage);


//       await dispatch(updateUserProfile(data)).unwrap();
//       setMessage("Profile updated successfully!");

//       // 🔽 Переход обратно в профиль
//       navigate(`/profile/${authUser._id}`);
//     } catch (err) {
//       console.error("Update error:", err);
//       setMessage("Error updating profile.");
//     }
//   };

//   if (loading) return <p>Загрузка...</p>;

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <h2 className={styles.title}>Edit profile</h2>

//         <form onSubmit={handleSubmit} className={styles.form}>
//           <div className={styles.avatarSection}>
//             <img
//               src={previewImage || "/default-avatar.png"}
//               alt="Avatar"
//               className={styles.avatar}
//             />
//             <label className={styles.newPhotoLabel}>
//               New photo
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className={styles.fileInput}
//               />
//             </label>
//           </div>

//           <div className={styles.field}>
//             <label>Username</label>
//             <input
//               type="text"
//               name="userName"
//               value={formData.userName}
//               onChange={handleChange}
//               className={styles.input}
//             />
//             </div>


//           <div className={styles.field}>
//             <label>Full name</label>
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               className={styles.input}
//             />
//           </div>

//           <div className={styles.field}>
//             <label>About</label>
//             <textarea
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               className={styles.textarea}
//             />
//           </div>

//           <button type="submit" disabled={loading} className={styles.button}>
//             {loading ? "Saving..." : "Save"}
//           </button>

//           {message && <p className={styles.message}>{message}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import styles from "./EditProfile.module.css";

// const EditProfile = () => {
//   const [userData, setUserData] = useState({
//     fullName: "",
//     bio: "",
//     profileImage: "",
//     userName: "",
//   });
//   const [previewImage, setPreviewImage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("/api/users/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUserData({
//           fullName: res.data.fullName || "",
//           bio: res.data.bio || "",
//           profileImage: res.data.profileImage || "",
//           userName: res.data.userName || "",
//         });
//         setPreviewImage(res.data.profileImage || "");
//       } catch (err) {
//         console.error("Ошибка загрузки профиля:", err);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleChange = (e) => {
//     setUserData({ ...userData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUserData({ ...userData, profileImage: file });
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("fullName", userData.fullName);
//       formData.append("bio", userData.bio);
//       if (userData.profileImage instanceof File) {
//         formData.append("profileImage", userData.profileImage);
//       }

//       const res = await axios.put("/api/users/profile", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setUserData(res.data);
//       setPreviewImage(res.data.profileImage);
//       setMessage("Профиль успешно обновлён!");
//     } catch (err) {
//       console.error(err);
//       setMessage("Ошибка при обновлении профиля.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <h2 className={styles.title}>Edit profile</h2>

//         <form onSubmit={handleSubmit} className={styles.form}>
//           <div className={styles.avatarSection}>
//             <img
//               src={previewImage || "/default-avatar.png"}
//               alt="Avatar"
//               className={styles.avatar}
//             />
//             <label className={styles.newPhotoLabel}>
//               New photo
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className={styles.fileInput}
//               />
//             </label>
//           </div>

//           <div className={styles.field}>
//             <label>Username</label>
//             <input
//               type="text"
//               disabled
//               value={userData.userName}
//               className={styles.inputDisabled}
//             />
//           </div>

//           <div className={styles.field}>
//             <label>Full name</label>
//             <input
//               type="text"
//               name="fullName"
//               value={userData.fullName}
//               onChange={handleChange}
//               className={styles.input}
//             />
//           </div>

//           <div className={styles.field}>
//             <label>About</label>
//             <textarea
//               name="bio"
//               value={userData.bio}
//               onChange={handleChange}
//               className={styles.textarea}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={styles.button}
//           >
//             {loading ? "Saving..." : "Save"}
//           </button>

//           {message && <p className={styles.message}>{message}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;

