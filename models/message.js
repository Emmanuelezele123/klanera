const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "user",
	},
	message: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	createdAt: { type: Date, expires: "30m", default: Date.now }, // TTL index for 10 minutes
});

module.exports = mongoose.model("message", messageSchema);
