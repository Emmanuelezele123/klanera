const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth");

router
	.post("/signup", AuthController.registerNewUser)
	.post("/login", AuthController.loginUser)
	.post("/refreshTokens", AuthController.refreshTokens)
	.post("/logout", AuthController.logoutUser);

module.exports = router;
