require("dotenv").config();
require("./auth");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("./utils/sendEmail");
const passport = require("passport");

const User = require("./models/User");
const playerRoutes = require("./routes/players");
const playerStatsRoutes = require("./routes/playerStats");
const matchesRoutes = require("./routes/matches");

const fs = require("fs").promises;
const path = require("path");

const app = express();
app.use(express.json());
app.use(passport.initialize());

if (process.env.NODE_ENV === "dev") {
  const cors = require("cors");
  const corsOptions = {
    origin: "https://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  app.use(cors(corsOptions));
} else {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//import players routes
app.use("/players", playerRoutes);

//import player stats routes
app.use("/playerStats", playerStatsRoutes);

//import matches routes
app.use("/matches", matchesRoutes);

app.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log(`Registration attempt with existing email: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString("hex");

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      isVerified: false,
    });

    await newUser.save();

    // Send verification email
    const verificationLink = `${
      process.env.NODE_ENV === "dev"
        ? process.env.APP_DOMAIN_DEV
        : process.env.APP_DOMAIN
    }/verify/${verificationToken}`;
    const emailText = `Please click this link to verify your email: ${verificationLink}`;
    const emailHtml = `<p>Please click this link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`;

    await sendEmail(email, "Verify Your Email", emailText, emailHtml);

    console.log(
      `Verification email sent to: ${email} at ${new Date().toISOString()}`
    );

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(`Error during registration: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Email verification route
app.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    let message, templatePath;

    if (!user) {
      console.log(`Invalid verification attempt with token: ${token}`);
      message = "Invalid or expired verification token";
      templatePath = path.join(__dirname, "views", "verification-error.html");
    } else {
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();

      console.log(
        `User verified: ${user.email} at ${new Date().toISOString()}`
      );
      message = "Email verified successfully. You can now log in.";
      templatePath = path.join(__dirname, "views", "verification-success.html");
    }

    // Read the HTML file
    let html = await fs.readFile(templatePath, "utf8");

    // Replace the placeholder with the actual message
    html = html.replace("{{message}}", message);

    // Send the HTML response
    res.send(html);
  } catch (error) {
    console.error(`Error during email verification: ${error.message}`);

    // Read the error HTML file
    const errorTemplatePath = path.join(
      __dirname,
      "views",
      "verification-error.html"
    );
    let errorHtml = await fs.readFile(errorTemplatePath, "utf8");

    // Replace the placeholder with a generic error message
    errorHtml = errorHtml.replace(
      "{{message}}",
      "An error occurred during email verification. Please try again later."
    );

    res.status(500).send(errorHtml);
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Failed login attempt for non-existent user: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      console.log(`Login attempt by unverified user: ${email}`);
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(
        `Failed login attempt (incorrect password) for user: ${email}`
      );
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    console.log(`User logged in: ${user.email} at ${new Date().toISOString()}`);

    res.json({ token });
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

if (process.env.NODE_ENV === "dev") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  const https = require("https");
  const fs = require("fs");
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  };

  const HTTPS_PORT = process.env.HTTPS_PORT || 443;
  https.createServer(options, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
  });
}
