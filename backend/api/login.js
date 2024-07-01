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

const CREATE_COLLECTION_TABLE = `
CREATE TABLE IF NOT EXISTS COLLECTIONS (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 createdBy TEXT NOT NULL
);
`;

// creating table, ONE TIME
dao.createTable(CREATE_USER_TABLE);
dao.createTable(CREATE_COLLECTION_TABLE);

//verify token
const verifyToken = (token) => {
  try {
    jwt.verify(token, 'LOGIN_SECRET');
    return true;  // Token is valid and not expired
  } catch(error) {
    if(error instanceof jwt.TokenExpiredError) {
      // The token is expired
      console.log('Token expired');
    } else if(error instanceof jwt.JsonWebTokenError){
      // invalid token
      console.log('Invalid token');
    }
    return false;
  }
}

/**
 * Login user
 */
router.get("/", (req, res) => {
  const { useremail, password, token } = req.query;

  dao.get(`SELECT * FROM USER_TABLE WHERE email=?`, [useremail])
  .then((result) => {
    if (result.length > 1) {
      return res.status(400).send({error_msg: 'Invalid username or password'})
    }

    const userInfo = result[0];
    const isPasswordCorrect = bcrypt.compareSync(password, userInfo.password);

    if (!isPasswordCorrect) return res.status(400).send({error_msg: 'Invalid username or password'});
    
    const token = jwt.sign({ username: userInfo.username, useremail, password }, 'LOGIN_SECRET', {
        expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token, username: userInfo.name, useremail });
  })
  .catch((err) => {
    return res.status(400).send({error_msg: 'Invalid username or password'})
  });
});

/**
 * Sign up user
 */
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
      res.status(500).send({error_msg: "There was a problem registering the user."});
    });
});

module.exports = router;
