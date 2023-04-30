const AccountExpress = require("express");
const Accountrouter = AccountExpress.Router();
const AccountController = require("../controllers/account");


Accountrouter.post('/sendVerification', AccountController.sendVerification)
Accountrouter.post('/verifyEmail/:token', AccountController.verifyEmail)
Accountrouter.post('/passwordReset', AccountController.resetPassword)
Accountrouter.post('/passwordReset/:token', AccountController.changePassword)


module.exports = Accountrouter