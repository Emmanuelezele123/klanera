import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
const cookieParser = require("cookie-parser");
import connectDB from "../config/db";
const authRouter = require("../routes/auth");
const accountRouter = require("../routes/account");
const gameRouter = require("../routes/game");
const chatRouter = require("../routes/chat");
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: [
			"https://klaneradev.vercel.app",
			"http://localhost:3000",
			"http://localhost:3001",
		],
	})
);
app.use("/api/v1/user", authRouter);
app.use("/api/v1/account", accountRouter);
app.use("/api/v1/game", gameRouter);
app.use("/api/v1/message", chatRouter);

// Root route of express app
app.get("/", (req, res) => {
	res.send("klanera api");
});

connectDB(app);
