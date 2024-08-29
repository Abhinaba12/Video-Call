const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const corsConfig = {
    origin: 'http://localhost:5173',
    credentials: true,
};

const authRoute = require('./routes/auth');
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('Connected to MongoDB');
    } catch (err) {
        throw (err);
    }
}

//middleware
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());

//routes
app.use('/api/auth', authRoute);

//websocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
// Maps roomID to an array of connected WebSocket clients
const rooms = {}; 

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        let msg = null;
        try {
            msg = JSON.parse(message);
        } catch (e) {
            console.log('Invalid JSON', e);
            return;
        }

        const { type, roomID } = msg;
        switch (type) {
            case 'join-room':
                if (!rooms[roomID]) {
                    rooms[roomID] = new Set();
                }
                rooms[roomID].add(ws);
                ws.roomID = roomID; 
                break;
            case 'offer':
                // Send offer to the other peer in the room
                broadcastToRoom(roomID, ws, JSON.stringify(msg));
                break;
            case 'answer':
                // Send answer to the other peer in the room
                broadcastToRoom(roomID, ws, JSON.stringify(msg));
                break;
            case 'ice-candidate':
                // Send new ICE candidate to the other peer in the room
                broadcastToRoom(roomID, ws, JSON.stringify(msg));
                break;
            case 'leave-call':
                // Broadcast the 'leave-call' message to other peer in the room
                broadcastToRoom(roomID, ws, JSON.stringify({ type: 'leave-call' }));
                break;
        }
    });

    ws.on('close', () => {
        // Remove the WebSocket from the room it was in
        const { roomID } = ws;
        if (rooms[roomID]) {
            rooms[roomID].delete(ws);
            if (rooms[roomID].size === 0) {
                // Clean up room if empty
                delete rooms[roomID];
            }
        }
    });
});

//Common function for handling the message broadcast to another peer in the room
function broadcastToRoom(roomID, senderSocket, message) {
    const peers = rooms[roomID];
    if (peers) {
        for (const peerSocket of peers) {
            if (peerSocket !== senderSocket) {
                peerSocket.send(message);
            }
        }
    }
}

//error handling
app.use((err, req, res, next) => {
    const errorMessage = err.message || "Something went wrong";
    const errorStatus = err.status || 500;
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
})

//server listening on port 8080
server.listen(8080, () => {
    connect();
    console.log('Server is running on port 8080');
});