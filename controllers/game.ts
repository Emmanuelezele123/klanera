import { Request, Response } from "express";
const { fetchGameIcons } = require("../helpers/cloudinary");

const games = [
	{
		label: "PUBG",
		value: "PUBG",
	},
	{
		label: "CallOfDuty",
		value: "Call of duty",
	},
	{
		label: "Dota",
		value: "Dota",
	},
	{
		label: "Valorant",
		value: "Valorant",
	},
	{
		label: "APEXLegends",
		value: "APEX Legends",
	},
	{
		label: "Fortnite",
		value: "Fortnite",
	},
	{
		label: "FIFA",
		value: "FIFA",
	},
	{
		label: "Chess",
		value: "Chess",
	},
	{
		label: "8BallPool",
		value: "8ball Pool",
	},
	{
		label: "BrawlStars",
		value: "Brawl Stars",
	},
	{
		label: "RocketLeague",
		value: "Rocket league",
	},
	{
		label: "FreeFire",
		value: "Free Fire",
	},
];

exports.getGameIcons = async (req: Request, res: Response) => {
	console.log("here");
	try {
		const response = await fetchGameIcons();
		const mapping: { [key: string]: string } = {};

		for (const icon of response.gameIcons) {
			const label = icon.publicId.split("/")[1];
			mapping[label] = icon.secureUrl;
		}

		const updatedGames = games.map((game) => {
			const label = game.label.trim();
			const imageUrl = mapping[label];
			return { ...game, icon: imageUrl };
		});

		return res.status(200).json(updatedGames);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};
