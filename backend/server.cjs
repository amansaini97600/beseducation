const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const studentRoutes = require("./routes/studentRoutes.cjs");
const certificateRoutes = require("./routes/certificateRoutes.cjs");
const diplomaRoutes = require("./routes/diplomaRoutes.cjs");
const notesRoutes = require("./routes/notesRoutes.cjs");
const authRoutes = require("./routes/authRoutes.cjs");

// API endpoints
app.use("/api/students", studentRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/diplomas", diplomaRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});