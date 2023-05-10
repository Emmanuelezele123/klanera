const mongoose = require("mongoose");
const { Schema } = mongoose;
var validateEmail = function (email: any) {
	var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return re.test(email);
};
const userSchema = new Schema(
	{
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
		username: {
			type: String,
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
