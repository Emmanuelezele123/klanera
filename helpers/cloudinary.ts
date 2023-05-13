const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to fetch avatars
exports.fetchAvatars = async () => {
	try {
		const { resources } = await cloudinary.api.resources({
			type: "upload",
			prefix: "",
			max_results: 100,
		});

		const foldersObject: any = {
			"Klanera Female Avatar": [],
			"Klanera Male Avatar": [],
		};

		// Organize images by folders
		resources.forEach((resource: any) => {
			const folder = resource.folder || "";

			if (
				folder === "Klanera Female Avatar" ||
				folder === "Klanera Male Avatar"
			) {
				const { asset_id, public_id, secure_url } = resource;
				foldersObject[folder].push({ asset_id, public_id, secure_url });
			}
		});

		return foldersObject;
	} catch (error) {
		console.error("Error fetching images:", error);
		throw error;
	}
};
