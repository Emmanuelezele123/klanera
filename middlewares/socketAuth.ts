import { Server, Socket } from "socket.io";
const { decodeToken } = require("../helpers/jwtService");

interface SocketAuthData {
	auth: {
		token: String;
	};
}

interface SocketAuthResult {
	authenticated: boolean;
	user: any;
}

export const authenticateSocketUser = (
	io: Server,
	socket: Socket,
	data: SocketAuthData,
	callback: (result: SocketAuthResult) => void
) => {
	const { token } = data.auth;

	// decode token and perform authentication logic
	const decodedToken = decodeToken(token);

	if (decodedToken) {
		// authentication successful
		callback({
			authenticated: true,
			user: decodedToken, // pass any user information you want to make available
		});
	} else {
		// authentication failed
		callback({
			authenticated: false,
			user: null,
		});
	}
};
