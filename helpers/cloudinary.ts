const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

function convertSnakeCaseToCamelCase(obj: any): any {
	if (Array.isArray(obj)) {
		return obj.map((item) => convertSnakeCaseToCamelCase(item));
	} else if (typeof obj === "object" && obj !== null) {
		const camelCaseObj: any = {};
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				const camelCaseKey = key.replace(/_([a-z])/g, (_, char) =>
					char.toUpperCase()
				);
				camelCaseObj[camelCaseKey] = convertSnakeCaseToCamelCase(obj[key]);
			}
		}
		return camelCaseObj;
	}
	return obj;
}

// Function to fetch avatars
exports.fetchAvatars = async () => {
	try {
		const { resources } = await cloudinary.api.resources({
			type: "upload",
			prefix: "",
			max_results: 100,
		});

		const foldersObject: any = {
			klaneraFemaleAvatar: [],
			klaneraMaleAvatar: [],
		};

		// Organize images by folders
		resources.forEach((resource: any) => {
			const folder = resource.folder || "";

			if (folder === "klaneraFemaleAvatar" || folder === "klaneraMaleAvatar") {
				const { asset_id, public_id, secure_url } = resource;
				foldersObject[folder].push({ asset_id, public_id, secure_url });
			}
		});

		return convertSnakeCaseToCamelCase(foldersObject);
	} catch (error) {
		console.error("Error fetching images:", error);
		throw error;
	}
};

exports.fetchGameIcons = async () => {
	try {
		const { resources } = await cloudinary.api.resources({
			type: "upload",
			prefix: "",
			max_results: 100,
		});

		const gameIconsObject: any = {
			gameIcons: [],
		};

		resources.forEach((resource: any) => {
			const folder = resource.folder || "";
			if (folder === "gameIcons") {
				const { asset_id, public_id, secure_url } = resource;
				gameIconsObject[folder].push({ asset_id, public_id, secure_url });
			}
		});

		return convertSnakeCaseToCamelCase(gameIconsObject);
	} catch (error) {
		console.error("Error fetching images:", error);
		throw error;
	}
};
