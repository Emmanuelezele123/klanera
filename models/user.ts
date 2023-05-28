const mongoose = require("mongoose");
const { Schema } = mongoose;
var validateEmail = function (email: any) {
	var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return re.test(email);
};
const userSchema = new Schema(
	{
		firstName: {
			type: String,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: true,
			required: "Email address is required",
			validate: [validateEmail, "Please fill a valid email address"],
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Please fill a valid email address",
			],
		},
		profilePicture: {
			type: String,
			trim: true,
		},
		klaneraPointsBalance: {
			type: Number,
			default: 0,
		},
		username: {
			type: String,
		},
		phoneNumber: {
			type: String,
			trim: true,
		},
		state: {
			type: String,
			trim: true,
		},

		bankDetails: {
			bankName: {
				type: String,
				trim: true,
			},
			bankCode: {
				type: String,
				trim: true,
			},
			accountNumber: {
				type: String,
				trim: true,
			},
			accountName: {
				type: String,
				trim: true,
			},
			recipientCode: {
				type: String,
				trim: true,
			},
		},

		dateOfBirth: {
			type: String,
			trim: true,
		},

		password: {
			type: String,
			required: true,
		},
		verified: {
			type: Boolean,
			required: true,
		},
		refreshToken: { type: String },
		profileCompleted: {
			type: Boolean,
			required: true,
			default: false,
		},

		passwordResetToken: String,
		passwordResetTokenExpiration: Date,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
