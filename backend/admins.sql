CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

INSERT INTO admins (email, password) VALUES (
    'admin@cec.com',
    '$2a$10$CwTycUXWue0Thq9StjUM0uJ8o.Z.8YytPRxv7ZG0CGZSzQzR4pL5a'
);
