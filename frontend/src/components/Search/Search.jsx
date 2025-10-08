import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ добавляем
import { searchUsers, clearResults } from "../../redux/slices/searchSlice";
import styles from "./Search.module.css";

function Search() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ создаём навигацию
  const { results, loading, error } = useSelector((state) => state.search);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query.trim().length > 1) {
      const timeout = setTimeout(() => {
        dispatch(searchUsers(query));
      }, 400);
      return () => clearTimeout(timeout);
    } else {
      dispatch(clearResults());
    }
  }, [query, dispatch]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Search Users</h2>

      <input
        type="text"
        placeholder="Enter userName or fullName..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.input}
      />

      <div className={styles.results}>
        {results.map((user) => (
          <div
            key={user._id}
            className={styles.userItem}
            onClick={() => navigate(`/profile/${user._id}`)} 
          >
            <img
              src={user.profileImage || "/default-avatar.png"}
              alt={user.userName}
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.userName}</span>
              <span className={styles.fullName}>{user.fullName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;

