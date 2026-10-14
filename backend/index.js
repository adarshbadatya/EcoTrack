require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db")
const activityroutes =require("./routes/activityroutes");
const authroutes = require("./routes/authroutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/activities",activityroutes);
app.use("/api/auth",authroutes);

app.get("/test", (req, res) => {
    res.send("EcoTrack test route working");
});
app.get("/api/auth/protected-test", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected route working 🔐",
    user: req.user,
  });
});

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "EcoTrack API is running 🌱"
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`EcoTrack server running on http://localhost:${PORT}`);
});