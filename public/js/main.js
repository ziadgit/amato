const socket = io();
const timerDiv = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');

socket.on('timer', (timer) => {
    timerDiv.textContent = timer;
});

startButton.addEventListener('click', () => {
    socket.emit('start_timer');
});

pauseButton.addEventListener('click', () => {
    socket.emit('pause_timer');
});

resetButton.addEventListener('click', () => {
    socket.emit('reset_timer');
});
