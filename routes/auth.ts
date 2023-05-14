const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth");

router.post("/signup", AuthController.registerNewUser);

router.post("/login", AuthController.loginUser);

router.post("/refreshTokens", AuthController.refreshTokens);

router.post("/logout", AuthController.logoutUser);

module.exports = router;
