const express = require("express");
const router = express.Router();
const db = require("../db.cjs");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middlewares/verifyToken");

// Multer config
const certStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/cert_photos"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const certUpload = multer({ storage: certStorage });

// Add certificate
router.post("/", verifyToken, certUpload.single("photo"), async (req, res) => {
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

  const photoPath = req.file ? "/uploads/cert_photos/" + req.file.filename : null;

  try {
    const [result] = await db.execute(
      `INSERT INTO certificates (name, father_name, course, duration, issue_date, type, grade, photo, aadhar, phone)
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
    const certificateNumber = newId + 2193;

    await db.execute(
      "UPDATE certificates SET certificate_number = ? WHERE id = ?",
      [certificateNumber, newId]
    );

    res.json({ message: "Certificate saved successfully", id: newId, certificateNumber });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ message: "Database insert failed" });
  }
});

// Get all certificates
router.get("/", verifyToken, async (req, res) => {
  try {
    const [result] = await db.execute("SELECT * FROM certificates ORDER BY id DESC");
    res.json(result);
  } catch (err) {
    console.error("Fetch all error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get certificate by ID
router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute("SELECT * FROM certificates WHERE id = ?", [id]);
    if (result.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(result[0]);
  } catch (err) {
    console.error("Error in fetch by ID:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update certificate
router.put("/:id", verifyToken, certUpload.single("photo"), async (req, res) => {
  const { id } = req.params;
  const {
    name,
    fatherName,
    course,
    duration,
    issueDate,
    certificateType,
    grade,
    certificateNumber,
    phoneNumber,
    aadharNumber,
  } = req.body;

  const photoPath = req.file ? "/uploads/cert_photos/" + req.file.filename : null;

  try {
    let query = `UPDATE certificates SET 
      name = ?, father_name = ?, course = ?, duration = ?, issue_date = ?, type = ?, grade = ?, certificate_number = ?, phone = ?, aadhar = ?`;

    const params = [
      name,
      fatherName,
      course,
      duration,
      issueDate,
      certificateType,
      grade,
      certificateNumber,
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

    res.json({ message: "Certificate updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Database update failed" });
  }
});

// Search certificate by registration number
router.get("/search/:regNo", async (req, res) => {
  const { regNo } = req.params;
  try {
    const [result] = await db.execute(
      "SELECT * FROM certificates WHERE certificate_number = ?",
      [regNo]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json(result[0]);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;