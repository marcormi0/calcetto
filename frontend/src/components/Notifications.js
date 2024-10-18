import React, { useState, useEffect, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (user && token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isRead: true }),
      });
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    setIsOpen(false);

    switch (notification.type) {
      case "match_loaded":
        navigate("/vote-match");
        break;
      // Add more cases for different notification types
      case "profile_update":
        navigate("/profile");
        break;
      case "new_match_history":
        navigate("/match-history");
        break;
      // Add a default case if needed
      default:
        console.log("No specific route for this notification type");
    }
  };

  if (!user) {
    return null; // Don't render anything if user is not logged in
  }

  return (
    <div className="notifications-container">
      <button className="notification-icon" onClick={() => setIsOpen(!isOpen)}>
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="notification-counter">{unreadCount}</span>
        )}
      </button>
      {isOpen && (
        <div className="notifications-dropdown" ref={dropdownRef}>
          <div className="notifications-header">{t("Notifications")}</div>
          {notifications.length === 0 ? (
            <p className="no-notifications">{t("No notifications")}</p>
          ) : (
            <ul className="notifications-list">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`notification-item ${
                    !notification.isRead ? "unread" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {notification.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
