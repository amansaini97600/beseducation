const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middlewares/verifyToken");

const diplomaStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/diploma_photos"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const diplomaUpload = multer({ storage: diplomaStorage });

// Add diploma
router.post("/", verifyToken, diplomaUpload.single("photo"), async (req, res) => {
  const {
    name,
    fatherName,
    course,
    duration,
    issueDate,
    certificateType,
    grade,
    aadharNumber,
    phoneNumber,
  } = req.body;

  const photoPath = req.file ? "/uploads/diploma_photos/" + req.file.filename : null;

  try {
    const [result] = await db.execute(
      `INSERT INTO diplomas (name, father_name, course, duration, issue_date, type, grade, photo, aadhar, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        fatherName,
        course,
        duration,
        issueDate,
        certificateType,
        grade,
        photoPath,
        aadharNumber,
        phoneNumber,
      ]
    );

    const newId = result.insertId;
    const diplomaNumber = newId + 1874;

    await db.execute(
      "UPDATE diplomas SET diploma_number = ? WHERE id = ?",
      [diplomaNumber, newId]
    );

    res.json({ message: "Diploma saved successfully", id: newId, diplomaNumber });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ message: "Database insert failed" });
  }
});

// Get all diplomas
router.get("/", verifyToken, async (req, res) => {
  try {
    const [result] = await db.execute("SELECT * FROM diplomas ORDER BY id DESC");
    res.json(result);
  } catch (err) {
    console.error("Fetch all error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get diploma by ID
router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute("SELECT * FROM diplomas WHERE id = ?", [id]);
    if (result.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(result[0]);
  } catch (err) {
    console.error("Fetch by ID error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update diploma
router.put("/:id", verifyToken, diplomaUpload.single("photo"), async (req, res) => {
  const { id } = req.params;
  const {
    name,
    fatherName,
    course,
    duration,
    issueDate,
    certificateType,
    grade,
    diplomaNumber,
    phoneNumber,
    aadharNumber,
  } = req.body;

  const photoPath = req.file ? "/uploads/diploma_photos/" + req.file.filename : null;

  try {
    let query = `UPDATE diplomas SET 
      name = ?, father_name = ?, course = ?, duration = ?, issue_date = ?, type = ?, grade = ?, diploma_number = ?, phone = ?, aadhar = ?`;

    const params = [
      name,
      fatherName,
      course,
      duration,
      issueDate,
      certificateType,
      grade,
      diplomaNumber,
      phoneNumber,
      aadharNumber,
    ];

    if (photoPath) {
      query += `, photo = ?`;
      params.push(photoPath);
    }

    query += ` WHERE id = ?`;
    params.push(id);

    await db.execute(query, params);

    res.json({ message: "Diploma updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Database update failed" });
  }
});

// Search diploma by number
router.get("/search/:diplomaNo", async (req, res) => {
  const { diplomaNo } = req.params;
  try {
    const [result] = await db.execute(
      "SELECT * FROM diplomas WHERE diploma_number = ?",
      [diplomaNo]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Diploma not found" });
    }

    res.json(result[0]);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;