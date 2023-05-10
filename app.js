const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const EventSource = require('eventsource');

// Configura la aplicación Express
const app = express();
app.use(express.static(__dirname + '/public'));

// Crea el servidor HTTP
const server = http.createServer(app);

// Crea la conexión WebSocket
const io = socketio(server);

// Maneja las conexiones WebSocket
io.on('connection', socket => {
    console.log('Cliente conectado');
    socket.on('test', (r) => {
        console.log(r)
    })

    const liveVideoId = '1335188787060453';
    const accessToken = 'EAAdtoiFPzWIBAGdP1Kmm8VO8YLozQZCuh2WDzLcaf8MsiAHJOmGLR8PG7nouV1dUj9fucpE4eCXZCPuiFoa2z8Yrc3pYyJVf1Ff5bGQchRPfhASz4qevZCx8zDmkLCNzE2yzrA8lmAk51eVrwWvFZA5AYcQdYYfLTEv8OdT8uEjl0KENrl2V';

    const source = new EventSource(`https://streaming-graph.facebook.com/${liveVideoId}/live_comments?access_token=${accessToken}`);

    source.onopen = () => {
        console.log('Conexión establecida');
    };

    source.onerror = (error) => {
        console.error(`Error en la conexión: ${error}`);
    };
    source.onmessage = (event) => {
        console.log(JSON.parse(event.data))
        io.emit('nuevo_comentario', event);
    };
    // Maneja el evento "disconnect" cuando el cliente se desconecta
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Inicia el servidor HTTP
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});