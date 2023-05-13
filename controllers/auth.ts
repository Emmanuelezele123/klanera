const User = require("../models/user");
const Otp = require("../models/otp");
import express, { Application, Request, Response, NextFunction } from "express";
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendEmail = require("../helpers/sendEmail");
require("dotenv").config();
const expiryDate = process.env.EXPIRY_DATE;
const {
	createToken,
	createAccessToken,
	createRefreshToken,
	decodeToken,
} = require("../helpers/jwtService");

exports.registerNewUser = async (req: Request, res: Response) => {
	try {
		const existingEmail = await User.findOne({ email: req.body.email });
		if (existingEmail) {
			return res
				.status(400)
				.json({ message: "a user with this email already exists" });
		}
		const newUser = await User.create({
			email: req.body.email,
			password: req.body.password,
			verified: "false",
			profileCompleted: "false",
		});
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		newUser.password = hashedPassword;

		const savedUser = await newUser.save();

		const token = createToken(savedUser);
		if (!token) {
			return res.status(500).json({
				message: "sorry, we could not authenticate you, please login",
			});
		}

		try {
			const otp = Math.floor(1000 + Math.random() * 9000).toString();
			const newOtp = new Otp({
				userId: newUser._id,
				otpText: otp,
			});
			const result = await newOtp.save();
			await sendEmail(
				"Otp verification Code for Klanera app ",
				`Your verification code is ${otp}`,
				newUser.email
			);
		} catch (err: any) {
			console.error(err);
			return res.status(500).json({ error: err.message });
		}

		return res
			.status(200)
			.json({ status: "Success", message: "New klanera user added" });
	} catch (err: any) {
		return res.status(500).json({ error: err.message });
	}
};

exports.loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Email address not found" });
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(401).json({ message: "Incorrect password" });
		}

		const accessToken = createAccessToken(user);
		const refreshToken = createRefreshToken(user);

		user.refreshToken = refreshToken;
		await user.save();

		const cookieOptions: any = {
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			sameSite: "none",
			secure: true,
		};
		res.cookie("refreshToken", refreshToken, cookieOptions);

		const returnedUser = {
			id: user._id,
			email: user.email,
			verified: user.verified,
			profileCompleted: user.profileCompleted,
		};

		return res.status(200).json({
			success: true,
			message: "User logged in successfully",
			returnedUser,
			accessToken,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server error" });
	}
};

exports.refreshTokens = async (req: Request, res: Response) => {
	try {
		const refreshToken = req.cookies["refreshToken"];
		if (!refreshToken) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		let decodedToken = decodeToken(refreshToken);
		// check if token is valid
		if (!decodedToken) {
			return res.status(402).json({ message: "empty token" });
		}

		const user = await User.findById(decodedToken.id).lean(false);

		if (!user || user.refreshToken !== refreshToken) {
			return res.status(401).json({ message: "no user found with this token" });
		}
		const newRefreshToken = createRefreshToken(user);
		const accessToken = createAccessToken(user);
		user.refreshToken = newRefreshToken;
		await user.save();

		const cookieOptions: any = {
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			sameSite: "none",
			secure: true,
		};

		res.cookie("refreshToken", newRefreshToken, cookieOptions);

		const returnedUser = {
			id: user._id,
			email: user.email,
			verified: user.verified,
			profileCompleted: user.profileCompleted,
		};

		return res.status(200).json({
			success: true,
			message: "Token refreshed ",
			returnedUser,
			accessToken,
		});
	} catch (err: any) {
		console.log(err.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

exports.logoutUser = async (req: Request, res: Response) => {
	try {
		const token = req.cookies["refreshToken"];
		if (token) {
			const userId = decodeToken(token).id;
			const user = await User.findOne({ _id: userId });
			if (!user) {
				return res.status(401).json({ message: "No user logged in" });
			}
			user.refreshToken = "";
			await user.save();
			res.clearCookie("refreshToken");
			return res.status(200).json({
				success: true,
				message: "User logged out successfully",
			});
		} else {
			return res.status(401).json({ message: "User is not logged in" });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server error" });
	}
};
