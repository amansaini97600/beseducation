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
const certPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "certificates", allowed_formats: ["jpg", "jpeg", "png"] },
});
const diplomaPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "diplomas", allowed_formats: ["jpg", "jpeg", "png"] },
});

const cert_upload = multer({ storage: certPhotoStorage });
const diploma_upload = multer({ storage: diplomaPhotoStorage });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const allowedOrigins = [
  "https://beseducation.in",
  "https://www.beseducation.in",
  "http://localhost:5173", // (dev ke liye optional)
];
app.use(
  cors({
    origin: function (origin, callback) {
      // mobile apps / curl etc. ke liye origin null ho sakta hai
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

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
    const [rows] = await db.execute("SELECT * FROM admins WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email not found" });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Certificate Add
app.post(
  "/api/certificates",
  verifyToken,
  cert_upload.single("photo"),
  async (req, res) => {
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

    const photoPath = req.file ? req.file.path : null;

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

      res.json({
        message: "Certificate saved successfully",
        id: newId,
        certificateNumber,
      });
    } catch (err) {
      console.error("Insert error:", err);
      res.status(500).json({ message: "Database insert failed" });
    }
  }
);

// Backend route
app.get("/api/certificates/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute(
      "SELECT * FROM certificates WHERE id = ?",
      [id]
    );
    if (result.length === 0)
      return res.status(404).json({ message: "Not found" });
    res.json(result[0]);
  } catch (err) {
    console.error("Error in fetch by ID:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//todo search certificate list
app.get("/api/certificates", verifyToken, async (req, res) => {
  try {
    const [result] = await db.execute(
      "SELECT * FROM certificates ORDER BY id DESC"
    );
    res.json(result);
  } catch (err) {
    console.error("Fetch all error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// todo edit certificate
app.put(
  "/api/certificates/:id",
  verifyToken,
  cert_upload.single("photo"),
  async (req, res) => {
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

    const photoPath = req.file
      ? "/uploads/cert_photos/" + req.file.filename
      : null;

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
  }
);

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
  const {
    name,
    fatherName,
    course,
    institute,
    phone,
    aadhar,
    dateOfCompilation,
    dateOfGeneration,
  } = req.body;
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
      [
        name,
        fatherName,
        course,
        institute,
        photoPath,
        dateOfCompilation,
        dateOfGeneration,
        total,
        percentage,
        grade,
        null,
        phone,
        aadhar,
      ]
    );

    const diplomaId = diplomaResult.insertId;
    const diplomaNumber = 2350 + diplomaId;

    await db.execute("UPDATE diplomas SET diploma_number = ? WHERE id = ?", [
      diplomaNumber,
      diplomaId,
    ]);

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

app.get("/api/diplomas/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute("SELECT * FROM diplomas WHERE id = ?", [
      id,
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Diploma not found" });
    }

    res.json(result[0]);
  } catch (err) {
    console.error("Error fetching diploma:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/diplomas/:id/marks", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM diploma_marks WHERE diploma_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No marks found" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Error fetching diploma marks:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//todo diploma list
app.get("/api/diplomas", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM diplomas ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Diploma fetch error:", err);
    res.status(500).json({ message: "Failed to fetch diplomas" });
  }
});

// todo edit diploma
app.put("/api/diplomas/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    father_name,
    course,
    phone,
    aadhar,
    compilation_date,
    generation_date,
  } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE diplomas 
       SET name = ?, father_name = ?, course = ?, phone = ?, aadhar = ?, compilation_date = ?, generation_date = ?
       WHERE id = ?`,
      [
        name,
        father_name,
        course,
        phone,
        aadhar,
        compilation_date,
        generation_date,
        id,
      ]
    );

    res.json({ message: "Diploma updated successfully" });
  } catch (err) {
    console.error("Error updating diploma:", err);
    res.status(500).json({ message: "Failed to update diploma" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
