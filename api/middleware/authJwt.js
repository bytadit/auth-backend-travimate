const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

let invalidTokens = new Set();
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "Token tidak tersedia!",
    });
  }
  if (invalidTokens.has(token)) {
    return res.status(401).send({
      message: "Token diblokir. Anda harus login dahulu!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Tidak terautorisasi!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Akses Ditolak! Membutuhkan role admin!",
      });
      return;
    });
  });
};

isUser = (req, res, next) => {
  const userId = req.params.id; // assuming the user id is in the request parameters

  if (req.userId == userId) {
    next();
  } else {
    res.status(403).send({
      message: "Akses ditolak! Anda hanya dapat mengatur akun anda sendiri!",
    });
  }
};


const authCheck = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({ message: "Anda harus login terlebih dahulu!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Anda harus login terlebih dahulu!" });
    }

    // Fetch the user from the database if needed
    User.findByPk(decoded.id)
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "Anda harus login terlebih dahulu!" });
        }

        // Attach the user to the request object for further use if needed
        req.user = user;
        next();
      })
      .catch((error) => {
        return res.status(500).json({ message: "Terjadi kesalahan server internal!" });
      });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isUser: isUser,
  authCheck: authCheck,
  invalidateToken: (token) => invalidTokens.add(token),
};

module.exports = authJwt;
