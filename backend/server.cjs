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
  const { name, father_name, address, phone, course, joined_on, aadhar } = req.body;
  const photo = req.file ? req.file.filename : null;

  try {
    await db.execute(
      `INSERT INTO students (name, father_name, address, phone, course, joined_on, aadhar, photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, father_name, address, phone, course, joined_on, aadhar, photo]
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


// Route using token
app.get("/api/admin/data", verifyToken, (req, res) => {
  res.json({ message: "Secure data" });
});





