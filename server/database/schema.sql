CREATE DATABASE IF NOT EXISTS bugtracker_plus;
USE bugtracker_plus;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('org_admin','project_admin','developer','tester') NULL,
  status ENUM('pending','active') NOT NULL DEFAULT 'pending',
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  password_reset_requested BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE bugs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('Open','In Progress','Resolved','Closed','Reopened') NOT NULL DEFAULT 'Open',
  priority ENUM('Low','Medium','High','Critical') NOT NULL DEFAULT 'Medium',
  screenshots JSON NULL,
  created_by INT NOT NULL,
  assigned_to INT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_assigned (assigned_to)
);

CREATE TABLE bug_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bug_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bug_id) REFERENCES bugs(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_bug (bug_id),
  INDEX idx_user (user_id)
);
