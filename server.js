const express = require('express');
const path = require('path');
const Socket_IO = require('socket.io');
const chalk = require('chalk');

const app = express();

//server info
//const SERVER_HOST = '127.0.0.1'; 
const SERVER_PORT = process.env.PORT || 3000;
//const SERVER_ADDR =  SERVER_HOST+":"+SERVER_PORT;

//settings
app.set('port', SERVER_PORT);
//app.set('host', SERVER_HOST);
app.use(express.static(path.join(__dirname, 'public'))); //static files route

//start the server
const server = app.listen(app.get('port'), () =>{
    console.log("Server running on: "+ SERVER_PORT);
})

//Socket.io config
const io = Socket_IO.listen(server);

io.on('connection', (socket) => {
    socket.on('chat:message', (data) => {
        io.sockets.emit('chat:message', data);
    });

    socket.on('user:typing', (data) => {
        socket.broadcast.emit('user:typing', data);
    });

    socket.on('user:connect', (data) => {
        io.sockets.emit('user:connect', data);
        console.log('Nuevo cliente conectado: '+chalk.yellow(data)+" | Socket ID: "+chalk.green(socket.id));
    });

    socket.on('user:disconnect', (data) => {
        io.sockets.emit('user:disconnect', data);
    })
});




