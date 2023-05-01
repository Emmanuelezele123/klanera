const AccountExpress = require("express");
const Accountrouter = AccountExpress.Router();
const AccountController = require("../controllers/account");


Accountrouter.post('/resendOtp', AccountController.resendOtp)
Accountrouter.post('/verifyOtp', AccountController.verifyOtp)
Accountrouter.post('/passwordReset', AccountController.resetPassword)
Accountrouter.post('/passwordReset/:token', AccountController.changePassword)


module.exports = Accountrouter