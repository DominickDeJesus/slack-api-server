require("dotenv").config();
const { createServer } = require("http");
const express = require("express");
const { createEventAdapter } = require("@slack/events-api");
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const port = process.env.PORT || 3000;
const slackEvents = createEventAdapter(slackSigningSecret);

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on("message", (event) => {
	console.log(
		`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`
	);
});

// Create an express application
const app = express();

// Plug the adapter in as a middleware
app.use("/slack/events", slackEvents.requestListener());

// Example: If you're using a body parser, always put it after the event adapter in the middleware stack
app.use(express.json());

// Initialize a server for the express app - you can skip this and the rest if you prefer to use app.listen()
const server = createServer(app);
server.listen(port, () => {
	// Log a message when the server is ready
	console.log(`Listening for events on ${server.address().port}`);
});
