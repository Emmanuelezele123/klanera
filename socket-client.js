const io = require("socket.io-client");

const socket = io("http://localhost:5000"); // Replace with your server URL

// Custom event listeners
socket.on("newMessage", (data) => {
	console.log(data);
});

// Custom event emitter functions
const sendMessage = async (token, message) => {
	try {
		await socket.emit("sendMessage", {
			auth: {
				token: token,
			},
			message: message,
		});
	} catch (error) {
		console.error("Failed to send chat:", error.message);
	}
};

const token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjI5ZDhmMjQxZGRmZmE1YmYxYzM4MyIsImVtYWlsIjoiYWxhYmlhbHZpbkBnbWFpbC5jb20iLCJpYXQiOjE2ODY0NjMzMzQsImV4cCI6MTY4NjQ2NDIzNH0.CsPuRi6SkQkxoDsDnAo7qUEpYS5iZPhy2hILoqP5jdo"; // Replace with the actual token
const message = "Hello Postman";

// Usage example
setInterval(() => {
	sendMessage(token, message);
}, 10000);
