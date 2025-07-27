const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middlewares/verifyToken");

// Multer storage setup
const studentStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/student_photos"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const uploadStudent = multer({ storage: studentStorage });

// Add new student
router.post("/", verifyToken, uploadStudent.single("photo"), async (req, res) => {
  const { name, father_name, address, phone, course, joined_date, aadhar } = req.body;
  const photo = req.file ? req.file.filename : null;

  try {
    await db.execute(
      `INSERT INTO students (name, father_name, address, phone, course, joined_date, aadhar, photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, father_name, address, phone, course, joined_date, aadhar, photo]
    );
    res.status(200).json({ message: "Student added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add student" });
  }
});

// Get students (with pagination optional)
router.get("/", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [students] = await db.execute("SELECT * FROM students LIMIT ? OFFSET ?", [limit, offset]);
    const [[{ total }]] = await db.execute("SELECT COUNT(*) as total FROM students");
    res.json({ students, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update student
router.put("/:id", verifyToken, async (req, res) => {
  const { name, father_name, phone, course, joined_date, address, aadhar } = req.body;
  const { id } = req.params;

  try {
    await db.execute(
      `UPDATE students SET name=?, father_name=?, phone=?, course=?, joined_date=?, address=?, aadhar=? WHERE id=?`,
      [name, father_name, phone, course, joined_date, address, aadhar, id]
    );
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

// Delete student
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM students WHERE id = ?", [id]);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;