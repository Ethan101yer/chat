const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const crypto = require('crypto');

let publicKeys = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('publicKey', (key) => {
        publicKeys.push({ id: socket.id, key: key });
    });

    socket.on('chat message', (msg) => {
        publicKeys.forEach(client => {
            if (client.id !== socket.id) {
                io.to(client.id).emit('chat message', msg);
            }
        });
    });

    socket.on('disconnect', () => {
        publicKeys = publicKeys.filter(client => client.id !== socket.id);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
