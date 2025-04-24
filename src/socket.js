const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join a room for specific call
        socket.on('join-call', (callId) => {
            socket.join(callId);
            console.log(`User ${socket.id} joined call: ${callId}`);
        });

        // Handle WebRTC signaling
        socket.on('offer', (data) => {
            socket.to(data.callId).emit('offer', data.offer);
        });

        socket.on('answer', (data) => {
            socket.to(data.callId).emit('answer', data.answer);
        });

        socket.on('ice-candidate', (data) => {
            socket.to(data.callId).emit('ice-candidate', data.candidate);
        });

        // Handle call ending
        socket.on('end-call', (callId) => {
            io.to(callId).emit('call-ended');
            socket.leave(callId);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

module.exports = {
    initializeSocket,
    getIO
};