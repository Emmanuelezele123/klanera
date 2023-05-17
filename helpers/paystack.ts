const axios = require("axios");
require("dotenv").config();

const { PAYSTACK_SECRET_KEY } = process.env;

exports.fetchBanks = async () => {
	try {
		const response = await axios.get(
			"https://api.paystack.co/bank?currency=NGN",
			{
				headers: {
					Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error fetching banks:", error);
		throw error;
	}
};

exports.createTransferRecipient = async (
	accountNumber: string,
	bankCode: string
) => {
	try {
		const response = await axios.post(
			"https://api.paystack.co/transferrecipient",
			{
				type: "nuban",
				account_number: accountNumber,
				bank_code: bankCode,
				currency: "NGN",
			},
			{
				headers: {
					Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error creating transfer recipient:", error);
		throw error;
	}
};
