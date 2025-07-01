const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const db = require("./db.cjs");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


// async function generateHash() {
//   const hash = await bcrypt.hash("admin123", 10);
//   console.log("Hashed Password:", hash);
// }

// generateHash();



app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM admins WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email not found" });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
// console.log("Form Password:", password);

//     console.log("Password Match?", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    
    
    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });
//     console.log("Form Email:", email);
// console.log("DB Email:", admin.email);
// console.log("DB Hash:", admin.password);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// POST route to add student
app.post("/api/admin/students", upload.single("photo"), async (req, res) => {
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

app.get("/api/students", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM students ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students" });
  }
});



app.put("/api/students/:id", verifyToken, async (req, res) => {
  const { name, father_name, phone, course, joined_date, address, aadhar } = req.body;
  const { id } = req.params;

  try {
    await db.execute(
      `UPDATE students SET name=?, father_name=?, phone=?, course=?, joined_date=?, address=?, aadhar=? WHERE id=?`,
      [name, father_name, phone, course, joined_date, address, aadhar, id]
    );
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

app.delete("/api/students/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM students WHERE id = ?", [id]);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

app.get("/api/students", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [students] = await db.execute(
      "SELECT * FROM students LIMIT ? OFFSET ?", [limit, offset]
    );
    const [[{ total }]] = await db.execute("SELECT COUNT(*) as total FROM students");

    res.json({ students, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// add certificates

app.post("/api/certificates", verifyToken, async (req, res) => {
  const {
    name,
    fatherName,
    course,
    duration,
    issueDate,
    certificateType,
    certificateNumber,
    grade,
    completionDate
  } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO certificates 
        (name, father_name, course, duration, issue_date, type, certificate_number, grade, completion_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        fatherName,
        course,
        duration,
        issueDate,
        certificateType,
        certificateNumber || null,
        grade,
        completionDate || null,
      ]
    );

    // Send back the newly inserted certificate's ID
    res.json({ message: "Certificate saved successfully", id: result.insertId });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ message: "Database insert failed" });
  }
});

// Backend route
app.get("/api/certificates/:id", verifyToken, async (req, res) => {
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


// Route using token
app.get("/api/admin/data", verifyToken, (req, res) => {
  res.json({ message: "Secure data" });
});





