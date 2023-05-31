const AccountExpress = require("express");
const Accountrouter = AccountExpress.Router();
const AccountController = require("../controllers/account");

const authMiddleware = require("../middlewares/authentication");

Accountrouter.post("/resendOtp", AccountController.resendOtp);
Accountrouter.post("/verifyOtp", AccountController.verifyOtp);
Accountrouter.post("/passwordReset", AccountController.resetPassword);
Accountrouter.post("/passwordReset/:token", AccountController.changePassword);
Accountrouter.get(
	"/avatars",
	authMiddleware.authenticateUser,
	AccountController.getAvatars
);
Accountrouter.get(
	"/banks",
	authMiddleware.authenticateUser,
	AccountController.getBanks
);
Accountrouter.post(
	"/completeProfile",
	authMiddleware.authenticateUser,
	AccountController.completeUserProfile
);
Accountrouter.post("/recipient", AccountController.createRecipient);

module.exports = Accountrouter;
