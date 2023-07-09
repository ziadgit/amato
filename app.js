const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
let timer = 25 * 60; // Pomodoro timer is traditionally 25 minutes

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

app.get('/', (req, res) => {
    res.render('index', { timer: formatTime(timer) });
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('start_timer', () => {
        setInterval(() => {
            if(timer > 0) {
                timer--;
                io.emit('timer', formatTime(timer));
            }
        }, 1000);
    });

    socket.on('reset_timer', () => {
        timer = 25 * 60;
        io.emit('timer', formatTime(timer));
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
