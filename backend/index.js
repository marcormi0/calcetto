const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();

const User = require("./models/User");
const Match = require("./models/Match");
const adminAuth = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(passport.initialize());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/load-match", adminAuth, async (req, res) => {
  const { date, players, result } = req.body;

  try {
    const newMatch = new Match({
      date,
      players: players.split(",").map((player) => player.trim()), // Assuming players are passed as comma-separated string
      result,
    });

    await newMatch.save();
    res.status(201).json({ message: "Match information loaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
