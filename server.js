require("dotenv").config();
const app = require("./src/app");
const http = require('http');
const { initializeSocket } = require('./src/socket');

const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
