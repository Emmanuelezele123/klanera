import express, { Application, Request, Response, NextFunction } from "express";
const { fetchGameIcons } = require("../helpers/cloudinary");

exports.getGameIcons = async (req: Request, res: Response) => {
	try {
		const gameIcons = await fetchGameIcons();
		return res.status(200).json(gameIcons);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};
