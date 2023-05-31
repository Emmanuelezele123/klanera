import express, { Application, Request, Response, NextFunction } from "express";
require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Otp = require("../models/otp");
const UserSurvey = require("../models/userSurvey");

const {
	createToken,
	createAccessToken,
	createRefreshToken,
	decodeToken,
	generateToken,
} = require("../helpers/jwtService");
const { fetchAvatars } = require("../helpers/cloudinary");
const sendEmail = require("../helpers/sendEmail");
const { fetchBanks, createTransferRecipient } = require("../helpers/paystack");

const expiryDate = process.env.EXPIRY_DATE;

exports.completeUserProfile = async (req: Request, res: Response) => {
	try {
		const {
			id,
			firstName,
			lastName,
			phoneNumber,
			profilePic,
			state,
			bankName,
			bankCode,
			accountNumber,
			accountName,
			recipientCode,
			dateOfBirth,
			gamesOfInterest,
			dailyGamingHours,
			earningFromGaming,
			howDidYouHearAboutUs,
			onlineOrOfflineGaming,
			bestGamingConsole,
		} = req.body;

		const user = await User.findOne({ _id: id });

		if (!user) {
			return res.status(404).json({ message: "user not found" });
		}

		if (!user.verified) {
			return res.status(400).json({ message: "user not verified" });
		}

		if (user.profileCompleted) {
			return res
				.status(400)
				.json({ message: "user profile already completed" });
		}

		// Check for missing required fields
		if (
			!firstName ||
			!lastName ||
			!phoneNumber ||
			!profilePic ||
			!state ||
			!bankName ||
			!bankCode ||
			!accountNumber ||
			!accountName ||
			!recipientCode ||
			!dateOfBirth
		) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		user.firstName = firstName;
		user.lastName = lastName;
		user.phoneNumber = phoneNumber;
		user.profilePic = profilePic;
		user.state = state;
		user.dateOfBirth = dateOfBirth;

		user.bankDetails = {
			bankName,
			bankCode,
			accountNumber,
			accountName,
			recipientCode,
		};

		const userSurvey = await UserSurvey.findOne({ userId: id });
		if (!userSurvey) {
			const newUserSurvey = new UserSurvey({
				userId: id,
				gamesOfInterest,
				dailyGamingHours,
				earningFromGaming,
				howDidYouHearAboutUs,
				onlineOrOfflineGaming,
				bestGamingConsole,
			});

			await newUserSurvey.save();
		}

		const accessToken = createAccessToken(user);
		const refreshToken = createRefreshToken(user);

		user.refreshToken = refreshToken;
		user.profileCompleted = true;
		const savedUser = await user.save();

		const returnedUser = {
			id: savedUser._id,
			email: savedUser.email,
			profilePic: savedUser.profilePic,
			verified: savedUser.verified,
			profileCompleted: savedUser.profileCompleted,
		};

		const cookieOptions: any = {
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			sameSite: "none",
			secure: true,
		};

		res.cookie("refreshToken", refreshToken, cookieOptions);

		return res.status(200).json({
			message: "user profile completed successfully",
			returnedUser,
			accessToken,
			refreshToken,
		});
	} catch (err: any) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
};

exports.resendOtp = async (req: Request, res: Response) => {
	try {
		const user = await User.findOne({ email: req.body.email }).select("_id");

		if (!user) {
			return res
				.status(404)
				.json({ message: "User not found with " + req.body.email });
		}
		const userId: string = user._id.toString();

		const otp = Math.floor(1000 + Math.random() * 9000).toString();
		const newOtp = new Otp({
			userId: userId,
			otpText: otp,
		});
		const result = await newOtp.save();
		sendEmail(
			"Otp verification Code for Klanera app ",
			`Your verification code is ${otp}`,
			req.body.email
		);

		return res.status(200).json({ message: "otp sent successfully" });
	} catch (err: any) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
};

exports.verifyOtp = async (req: Request, res: Response) => {
	const otp = req.body.otp;
	const email = req.body.email;
	try {
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const userId: string = user._id.toString();

		const otps = await Otp.findOne({ userId: userId, otpText: otp });

		if (otps) {
			await Otp.deleteMany({ userId: userId });
			user.verified = true;
			await user.save();

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
				profilePic: user.profilePic,
				verified: user.verified,
				profileCompleted: user.profileCompleted,
			};
			return res.status(200).json({
				success: true,
				message: "Pin Correct !! Your account has been verified ",
				returnedUser,
				accessToken,
			});
		} else {
			return res.status(401).json({ message: "Invalid Otp" });
		}
	} catch (err: any) {
		console.log(err.message);
		console.error(err);
		return res.json({ Error: err.message });
	}
};

exports.resetPassword = async (req: Request, res: Response) => {
	try {
		const foundUser = await User.findOne({ email: req.body.email });
		if (!foundUser) {
			return res.status(404).json({ message: "User not found" });
		}

		// Generate a password reset token and set it on the user's account
		const passwordResetToken = generateToken();
		foundUser.passwordResetToken = passwordResetToken;
		foundUser.passwordResetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour from now
		await foundUser.save();

		// Send a password reset email to the user's email address with a link containing the password reset token
		const link = `${process.env.BASE_URL}/reset-password?token=${passwordResetToken}`;
		sendEmail("Change Password", link, foundUser.email);

		return res
			.status(200)
			.json({ message: "Password reset email sent successfully" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};

exports.changePassword = async (req: Request, res: Response) => {
	try {
		// Find the user with the password reset token
		const foundUser = await User.findOne({
			passwordResetToken: req.params.token,
			passwordResetTokenExpiration: { $gt: Date.now() },
		});
		if (!foundUser) {
			return res
				.status(404)
				.json({ message: "Invalid or expired password reset token" });
		}

		// Hash the new password and update the user's password on their account
		const hashedPassword = bcrypt.hashSync(req.body.newPassword, 10);
		foundUser.password = hashedPassword;
		foundUser.passwordResetToken = undefined;
		foundUser.passwordResetTokenExpiration = undefined;
		await foundUser.save();

		return res.status(200).json({ message: "Password changed successfully" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};

exports.getAvatars = async (req: Request, res: Response) => {
	try {
		const avatars = await fetchAvatars();
		return res.status(200).json({ avatars });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};

exports.getBanks = async (req: Request, res: Response) => {
	try {
		const banks = await fetchBanks();
		return res.status(200).json({ banks });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};

exports.createRecipient = async (req: Request, res: Response) => {
	try {
		const { _id, accountNumber, bankCode } = req.body;
		const recipient = await createTransferRecipient(accountNumber, bankCode);

		return res.status(200).json(recipient.data);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};
6;
