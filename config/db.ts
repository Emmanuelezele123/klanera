import mongoose, { ConnectOptions } from "mongoose";
import { config } from "dotenv";
import { Application } from "express";
import { Socket } from "socket.io";
const socket = require("socket.io");

config();

const { MONGO_URI }: NodeJS.ProcessEnv = process.env;

const connectDB = (app: Application) => {
	const options: any = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	mongoose
		.connect(MONGO_URI!, options)
		.then(() => {
			const server = app.listen(process.env.PORT || 3000, () => {
				console.log("klanera APP is running on");
			});

			const io = socket(server, {
				cors: {
					origin: "http://localhost:5000",
					credentials: true,
				},
			});

			io.on("connection", () => {
				console.log("A user connected");
			});

			require("../config/socket")(io);
		})
		.catch((err: Error) => {
			console.log(err.message);
			console.error(err);
		});
};

export default connectDB;
