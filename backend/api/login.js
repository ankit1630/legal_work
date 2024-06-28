const express = require('express');
const router = express.Router();

// DAO
const DAO = require('./../db/sqlite');
const dao = new DAO();

const CREATE_USER_TABLE = `
CREATE TABLE IF NOT EXISTS USER_TABLE (
 email TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 password TEXT NOT NULL
);
`;

// creating table, ONE TIME
dao.createTable(CREATE_USER_TABLE);

/**
 * Login user
 */
router.get("/", (req, res) => {
  return res.send("Hello World");
});

router.post("/signup", (req, res) => {
  res.send("hitting route signupp")
});

module.exports = router;