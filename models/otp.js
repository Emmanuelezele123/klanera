const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "user",
	},
	otpText: {
		type: String,
		required: true,
	},
	createdAt: { type: Date, expires: "10m", default: Date.now }, // TTL index for 10 minutes
});

module.exports = mongoose.model("Otp", otpSchema);
