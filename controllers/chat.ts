import express, { Application, Request, Response, NextFunction } from "express";
const { fetchGameIcons } = require("../helpers/cloudinary");
const Message = require("../models/message");

interface AuthRequest extends Request {
	individualUsers: any;
}

exports.getAllMessages = async (req: Request, res: Response) => {
	try {
		const messages = await Message.find();
		return res.status(200).json(messages);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};

exports.createMessage = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.individualUsers;
		const { message } = req.body;
		const newMessage = new Message({
			userId: id,
			message,
		});
		await newMessage.save().then(() => {
			return res.status(200).json({ message: "Message created successfully" });
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};
