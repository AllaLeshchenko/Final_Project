import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  deleteNotification, 
  clearNotifications,
} from "../../redux/slices/notificationSlice";
import { timeAgo } from "../../ui/timeAgo";
import { Check } from "lucide-react"; 
import styles from "./Notification.module.css";

const Notification = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector(
    (state) => state.notifications
  );
  const { user: authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchNotifications());
    return () => {
      dispatch(clearNotifications());
    };
  }, [dispatch]);

  if (loading) return <div className={styles.message}>Loading...</div>;
  if (error)
    return (
      <div className={styles.message}>
        Error: {error || "Error loading notifications"}
      </div>
    );

  if (!notifications.length)
    return <div className={styles.message}>No new notifications</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Notifications</h2>
      <h3 className={styles.subtitle}>New</h3>

      <div className={styles.list}>
        {notifications.map((n) => (
          <div className={styles.item} key={n._id}>
            <button
              className={styles.checkBtn}
              onClick={() => dispatch(deleteNotification(n._id))}
              title="Mark as read"
            >
              <Check size={18} />
            </button>
            <img
              src={
                n.sender?.profileImage ||
                "https://via.placeholder.com/40x40.png?text=User"
              }
              alt={n.sender?.userName}
              className={styles.avatar}
            />
            <div className={styles.textBlock}>
              <div className={styles.textRow}>
                <span className={styles.userName}>{n.sender?.userName}</span>
                <span className={styles.action}>
                  {n.type === "like" && " liked your photo"}
                  {n.type === "comment" && " commented your photo"}
                  {n.type === "follow" && " started following you"}
                </span>
              </div>
              <div className={styles.time}>{timeAgo(n.createdAt)}</div>
            </div>
            {n.post?.image && (
              <img
                src={n.post.image}
                alt="Post"
                className={styles.postThumb}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;


