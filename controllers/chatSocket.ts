import { Server, Socket } from "socket.io";
const Message = require("../models/message");
const { authenticateSocketUser } = require("../middlewares/socketAuth");
const { decodeToken } = require("../helpers/jwtService");

interface SocketAuthResult {
	authenticated: boolean;
	user: any;
}

exports.socketHandler = (io: Server) => {
	io.on("connection", (socket: Socket) => {
		console.log("A user connected");
		socket.on("sendMessage", async (data) => {
			try {
				authenticateSocketUser(
					io,
					socket,
					data,
					async (result: SocketAuthResult) => {
						if (result.authenticated) {
							const { message } = data;

							const newMessage = await new Message({
								userId: result.user.id,
								message: message,
							}).save();

							const returnedMessage = {
								userId: newMessage.userId,
								message: newMessage.message,
							};

							// Emit the new message to connected clients
							io.emit("newMessage", returnedMessage);
							// socket.emit("authenticated", { message: "User authenticated" });
						} else {
							// handle authentication failure
							socket.emit("authenticationFailed", {
								message: "Authentication failed",
							});

							// Disconnect the socket
							socket.disconnect();
						}
					}
				);
			} catch (err) {
				console.log(err);
				socket.emit("newMessage", "Error creating message");
			}
		});

		socket.on("disconnect", () => {
			console.log("A user disconnected");
		});
	});
};
