const AccountExpress = require("express");
const Accountrouter = AccountExpress.Router();
const AccountController = require("../controllers/account");

const authMiddleware = require("../middlewares/authentication");

Accountrouter.post("/resendOtp", AccountController.resendOtp);
Accountrouter.post("/verifyOtp", AccountController.verifyOtp);
Accountrouter.post("/passwordReset", AccountController.resetPassword);
Accountrouter.post("/passwordReset/:token", AccountController.changePassword);
Accountrouter.post("/recipient", AccountController.createRecipient);
Accountrouter.use(authMiddleware.authenticateUser);
Accountrouter.get("/avatars", AccountController.getAvatars);
Accountrouter.get("/banks", AccountController.getBanks);
Accountrouter.post("/completeProfile", AccountController.completeUserProfile);

module.exports = Accountrouter;
