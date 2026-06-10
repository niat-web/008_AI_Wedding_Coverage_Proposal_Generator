-- MySQL Schema for thereelshoot AI Wedding Coverage Proposal Generator
-- You can run this script directly inside your MySQL client to set up the database and tables.

CREATE DATABASE IF NOT EXISTS thereelshoot_db;
USE thereelshoot_db;

CREATE TABLE IF NOT EXISTS proposals (
  id VARCHAR(50) PRIMARY KEY,
  couple_names VARCHAR(255) NOT NULL,
  wedding_date VARCHAR(50) NOT NULL, -- Stored as YYYY-MM-DD
  venue VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  events TEXT NOT NULL,              -- JSON array string containing selected events
  package_type VARCHAR(50) NOT NULL,
  special_requests TEXT,
  theme VARCHAR(20) NOT NULL DEFAULT 'dark', -- 'dark' or 'light'
  proposal TEXT NOT NULL,            -- JSON string containing generated proposal content
  created_at VARCHAR(100) NOT NULL   -- ISO String timestamp
);
