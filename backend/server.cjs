// ✅ Cloudinary-integrated Express.js Backend (with MySQL, Certificates, Diplomas, Students)

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const db = require("./db.cjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// 🔥 Cloudinary setup
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage definitions
const studentPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "students", allowed_formats: ["jpg", "jpeg", "png"] },
});
const certPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "certificates", allowed_formats: ["jpg", "jpeg", "png"] },
});
const diplomaPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "diplomas", allowed_formats: ["jpg", "jpeg", "png"] },
});

const upload_student = multer({ storage: studentPhotoStorage });
const cert_upload = multer({ storage: certPhotoStorage });
const diploma_upload = multer({ storage: diplomaPhotoStorage });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Middleware for token verification
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ Admin Login
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute("SELECT * FROM admins WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ message: "Email not found" });

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Student Add
app.post("/api/admin/students", upload_student.single("photo"), async (req, res) => {
  const { name, father_name, address, phone, course, joined_date, aadhar } = req.body;
  const photo = req.file ? req.file.path : null;
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

// ✅ Certificate Add
app.post("/api/certificates", verifyToken, cert_upload.single("photo"), async (req, res) => {
  const {
    name, fatherName, course, duration, issueDate,
    certificateType, grade, aadharNumber, phoneNumber,
  } = req.body;

  const photoPath = req.file ? req.file.path : null;

  try {
    const [result] = await db.execute(
      `INSERT INTO certificates (name, father_name, course, duration, issue_date, type, grade, photo, aadhar, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, fatherName, course, duration, issueDate, certificateType, grade, photoPath, aadharNumber, phoneNumber]
    );

    const newId = result.insertId;
    const certificateNumber = newId + 2193;

    await db.execute("UPDATE certificates SET certificate_number = ? WHERE id = ?", [certificateNumber, newId]);

    res.json({ message: "Certificate saved successfully", id: newId, certificateNumber });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ message: "Database insert failed" });
  }
});

// ✅ Diploma Add
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  return "D";
}

app.post("/api/diplomas", diploma_upload.single("photo"), async (req, res) => {
  const { name, fatherName, course, institute, phone, aadhar, dateOfCompilation, dateOfGeneration } = req.body;
  const subjects = ["A.C.C.", "D.C.A.", "D.T.P.", "TALLY 9.0", "TALLY 9.4"];
  const marks = [];
  let total = 0;

  subjects.forEach((subject) => {
    const t1 = getRandomInt(90, 98);
    const p1 = getRandomInt(40, 48);
    const t2 = getRandomInt(90, 98);
    const p2 = getRandomInt(40, 48);
    total += t1 + p1 + t2 + p2;
    marks.push({ term: "I", subject, theory: t1, practical: p1 });
    marks.push({ term: "II", subject, theory: t2, practical: p2 });
  });

  const percentage = parseFloat(((total / 1500) * 100).toFixed(2));
  const grade = generateGrade(percentage);
  const photoPath = req.file ? req.file.path : null;

  try {
    const [diplomaResult] = await db.execute(
      `INSERT INTO diplomas (name, father_name, course, institute, photo, compilation_date, generation_date, total, percentage, grade, diploma_number, phone, aadhar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, fatherName, course, institute, photoPath, dateOfCompilation, dateOfGeneration, total, percentage, grade, null, phone, aadhar]
    );

    const diplomaId = diplomaResult.insertId;
    const diplomaNumber = 2350 + diplomaId;

    await db.execute("UPDATE diplomas SET diploma_number = ? WHERE id = ?", [diplomaNumber, diplomaId]);

    for (const m of marks) {
      await db.execute(
        `INSERT INTO diploma_marks (diploma_id, term, subject, theory, practical, diploma_number)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [diplomaId, m.term, m.subject, m.theory, m.practical, diplomaNumber]
      );
    }

    res.json({ message: "Diploma created", id: diplomaId });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ message: "Failed to insert diploma" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
