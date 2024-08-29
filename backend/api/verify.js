const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

const verifyToken = (token) => {
  try {
    jwt.verify(token, "LOGIN_SECRET");
    return true; // Token is valid and not expired
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // The token is expired
      console.log("Token expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      // invalid token
      console.log("Invalid token");
    }
    return false;
  }
};

router.post("/", async (req, res) => {
    if (verifyToken(req.body.token)) {
        return res.status(200).send("Valid token");
    } else {
        return res.status(403).send("Invalid token")
    }
});

module.exports = router;
