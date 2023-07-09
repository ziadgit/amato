const socket = io();
const timerDiv = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const favDialog = document.getElementById("favDialog");

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

socket.on('pomodoro_end', () => {
	// If you want to play a sound, uncomment the following line
    new Audio('/sounds/beep.wav').play();
    // alert("Pomodoro is over!");
    favDialog.showModal();
});
