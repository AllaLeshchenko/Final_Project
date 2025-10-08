import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers, clearResults } from "../../redux/slices/searchSlice";
import styles from "./Search.module.css";

function Search() {
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.search);

  const [query, setQuery] = useState("");

  // Отправляем запрос при вводе
  useEffect(() => {
    if (query.trim().length > 1) {
      const timeout = setTimeout(() => {
        dispatch(searchUsers(query));
      }, 400); // небольшая задержка, чтобы не спамить сервер
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

      {loading && <div className={styles.message}>Searching...</div>}
      {error && <div className={styles.error}>Error: {error}</div>}
      {!loading && results.length === 0 && query.length > 1 && (
        <div className={styles.message}>No users found</div>
      )}

      <div className={styles.results}>
        {results.map((user) => (
          <div key={user._id} className={styles.userItem}>
            <img
              src={
                user.profileImage
                  ? user.profileImage
                  : "/default-avatar.png" 
              }
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

