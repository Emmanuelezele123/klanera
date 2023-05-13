import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
const cookieParser = require("cookie-parser");
import connectDB from "../config/db";
const authRouter = require("../routes/auth");
const accountRouter = require("../routes/account");
const User = require("../models/user");
const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: [
			"https://klanera.vercel.app",
			"http://localhost:3000",
			"http://localhost:3001",
		],
	})
);
app.use("/api/v1/user", authRouter);
app.use("/api/v1/account", accountRouter);

// Root route of express app
app.get("/", (req, res) => {
	res.send("klanera api");
});

connectDB(app);
