const ChatExpress = require("express");
const Chatrouter = ChatExpress.Router();
const ChatController = require("../controllers/chat");

const auth = require("../middlewares/authentication");

Chatrouter.get("/", ChatController.getAllMessages);
// Chatrouter.post("/", auth.authenticateUser, ChatController.createMessage);

module.exports = Chatrouter;
