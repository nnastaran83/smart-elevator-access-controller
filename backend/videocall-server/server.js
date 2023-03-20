//cd videocall-server
//npm start

const express = require('express');
const socket = require('socket.io');


//Default port
const PORT = 3000;//TODO: Check the port

const app = express();

//Create the server
const server = app.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`);
    console.log(`http://localhost:${PORT}`);

});


//Create the socket
const io = socket(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'] // TODO: Check if these are the right methods
    }
});


//When a user connects, do the callback
io.on('connection', (socket) => {
    socket.emit('connection', null);
    console.log('new user connected');
    console.log(socket.id);//for each user there is a different socket id
});