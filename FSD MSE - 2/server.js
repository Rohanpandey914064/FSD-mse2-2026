require("dotenv").config();
const express = require("express");
const helmet = require("helmet");

const connectDB = require("./config/db");
const sanitize = require("./middleware/sanitize");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

connectDB();

app.use(helmet());
app.use(express.json());
app.use(sanitize);

app.get("/", (req, res) => {
  res.send("EventEase API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
