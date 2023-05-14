const GameExpress = require("express");
const Gamerouter = GameExpress.Router();
const GameController = require("../controllers/game");

Gamerouter.get("/icons", GameController.getGameIcons);

module.exports = Gamerouter;
