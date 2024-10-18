const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const passport = require("passport");

// Get all notifications for a user
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(20);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Mark a notification as read
router.put(
  "/:id/read",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { isRead } = req.body;
      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { isRead },
        { new: true }
      );
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
