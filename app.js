const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
let duration = 25; // Default Pomodoro duration
let timer = duration * 60;
let interval;
// let completedPomodoros = []; // Array to hold completed pomodoro timestamps

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('view engine', 'ejs');

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

app.get('/', (req, res) => {
    res.render('index', { timer: formatTime(timer) });
});

app.get('/log', (req, res) => {
    res.render('log', { completedPomodoros: completedPomodoros });
});

app.get('/settings', (req, res) => {
    res.render('settings', { duration: duration });
});

app.post('/settings', (req, res) => {
    duration = Number(req.body.duration);
    timer = duration * 60;
    res.redirect('/');
});

io.on('connection', (socket) => {
    console.log('a user connected');
	socket.on('start_timer', () => {
        clearInterval(interval); // Ensure no other intervals are running
        interval = setInterval(() => {
            if(timer > 0) {
                timer--;
                io.emit('timer', formatTime(timer));
            } else {
                clearInterval(interval); // Stop the interval when timer reaches 0
                io.emit('pomodoro_end');
                io.emit('pomodoro_completed', new Date()); // Send the completion time
				console.log('foo');
            }
        }, 1000);
    });

    socket.on('pause_timer', () => {
        clearInterval(interval);
    });

    socket.on('set_pomo', () => {
        clearInterval(interval);
        duration = 25;
        timer = duration * 60;
        io.emit('timer', formatTime(timer));
    });

    socket.on('reset_timer', () => {
        clearInterval(interval);
        timer = duration * 60;
        io.emit('timer', formatTime(timer));
    });
	
    socket.on('short_break', () => {
        clearInterval(interval);
        duration = 5;
        timer = duration * 60;
        io.emit('timer', formatTime(timer));
    });

    socket.on('long_break', () => {
        clearInterval(interval);
        duration = 10;
        timer = duration * 60;
        io.emit('timer', formatTime(timer));
    });
	
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
