const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

// DAO
const DAO = require("./../db/sqlite");
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
  const { username, useremail, password } = req.body;

  // First, need to hash the password for security
  const hashedPassword = bcrypt.hashSync(password, 10);
  dao
    .run(`INSERT INTO USER_TABLE (email, name, password) VALUES (?, ?, ?)`, [
      useremail,
      username,
      hashedPassword,
    ])
    .then((result) => {
      const token = jwt.sign(req.body, "LOGIN_SECRET", {
        expiresIn: 86400, // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token, result });
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send("There was a problem registering the user.");
    });
});

module.exports = router;
