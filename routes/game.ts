const GameExpress = require("express");
const Gamerouter = GameExpress.Router();
const GameController = require("../controllers/game");

Gamerouter.get("/", GameController.getGameIcons);

module.exports = Gamerouter;
