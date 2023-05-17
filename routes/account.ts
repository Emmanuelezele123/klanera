const AccountExpress = require("express");
const Accountrouter = AccountExpress.Router();
const AccountController = require("../controllers/account");

Accountrouter.post("/resendOtp", AccountController.resendOtp);
Accountrouter.post("/verifyOtp", AccountController.verifyOtp);
Accountrouter.post("/passwordReset", AccountController.resetPassword);
Accountrouter.post("/passwordReset/:token", AccountController.changePassword);
Accountrouter.get("/avatars", AccountController.getAvatars);
Accountrouter.get("/banks", AccountController.getBanks);
Accountrouter.post("/completeProfile", AccountController.completeUserProfile);
Accountrouter.post("/recipient", AccountController.createRecipient);

module.exports = Accountrouter;
