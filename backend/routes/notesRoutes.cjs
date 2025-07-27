const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middlewares/verifyToken");

const notesStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/notes"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const uploadNotes = multer({ storage: notesStorage });

// Add note
router.post("/", verifyToken, uploadNotes.single("file"), async (req, res) => {
  const { title, description } = req.body;
  const filePath = req.file ? "/uploads/notes/" + req.file.filename : null;

  try {
    await db.execute(
      `INSERT INTO notes (title, description, file) VALUES (?, ?, ?)`,
      [title, description, filePath]
    );
    res.json({ message: "Note uploaded successfully" });
  } catch (err) {
    console.error("Insert note error:", err);
    res.status(500).json({ message: "Database insert failed" });
  }
});

// Get all notes
router.get("/", verifyToken, async (req, res) => {
  try {
    const [notes] = await db.execute("SELECT * FROM notes ORDER BY id DESC");
    res.json(notes);
  } catch (err) {
    console.error("Fetch notes error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete note
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM notes WHERE id = ?", [id]);
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ message: "Failed to delete note" });
  }
});

module.exports = router;
