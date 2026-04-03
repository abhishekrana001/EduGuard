const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 🔐 CSP Fix
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; connect-src 'self' https://api.github.com;"
    );
    next();
});

// 📁 Static files
app.use(express.static("public"));

// 📂 Routes
const chatRoute = require("./routes/chat");
const checkerRoute = require("./routes/checker");
const quizRoutes = require("./routes/quiz");

app.use("/api/chat", chatRoute);
app.use("/api/check", checkerRoute);
app.use("/api/quiz", quizRoutes);

// 🏠 Test route
app.get("/", (req, res) => {
    res.send("🚀 EduGuard AI Server is Running...");
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});