CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

INSERT INTO admins (email, password) VALUES (
    'admin@cec.com',
    '$2a$10$CwTycUXWue0Thq9StjUM0uJ8o.Z.8YytPRxv7ZG0CGZSzQzR4pL5a'
);

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  father_name VARCHAR(100),
  address TEXT,
  phone VARCHAR(15),
  course VARCHAR(100),
  joined_on DATE,
  aadhar VARCHAR(20),
  photo VARCHAR(255)  -- Store filename here (path on server)
);

CREATE TABLE certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  father_name VARCHAR(100),
  course VARCHAR(100),
  duration VARCHAR(50),
  issue_date DATE,
  type VARCHAR(50), -- 'Certificate' or 'Diploma'
  certificate_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  grade VARCHAR(20),
  completion_date DATE
);

ALTER TABLE certificates 
ADD COLUMN certificate_number VARCHAR(255),
ADD COLUMN grade VARCHAR(20),
ADD COLUMN completion_date DATE;



--! generate password
-- const bcrypt = require("bcryptjs");

-- async function generateHash() {
--   const hash = await bcrypt.hash("admin123", 10);
--   console.log("Hashed Password:", hash);
-- }

-- generateHash();


