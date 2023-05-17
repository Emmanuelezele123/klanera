const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSurveySchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "user",
	},
	gamesOfInterest: {
		type: [String],
		required: true,
	},
	dailyGamingHours: {
		type: String,
		required: true,
	},
	earningFromGaming: {
		type: String,
		required: true,
	},
	howDidYouHearAboutUs: {
		type: String,
		required: true,
	},
	onlineOrOfflineGaming: {
		type: String,
		required: true,
	},
	bestGamingConsole: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("UserSurvey", userSurveySchema);
