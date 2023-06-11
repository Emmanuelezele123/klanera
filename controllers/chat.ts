import express, { Application, Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
const { fetchGameIcons } = require("../helpers/cloudinary");
const Message = require("../models/message");
const { emitNewMessage } = require("./chatSocket");

interface AuthRequest extends Request {
	individualUsers: any;
}

exports.getAllMessages = async (req: Request, res: Response) => {
	try {
		const messages = await Message.find({});
		return res.status(200).json(messages);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};
