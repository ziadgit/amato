const socket = io();
const timerDiv = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const favDialog = document.getElementById("favDialog");
const showLog = document.getElementById("show");

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

showLog.addEventListener('click', () => {
	let completedPomodoros = JSON.parse(localStorage.getItem('completedPomodoros')) || [];
    let logDiv = document.getElementById('log');
    logDiv.innerHTML = '';
	let reversedPomodoros = [...completedPomodoros].reverse();
    reversedPomodoros.forEach(function(pomodoro) {
        let logItem = document.createElement('div');
        let date = new Date(pomodoro);
        logItem.textContent = date.toLocaleString(); // Converts the date into a string, using the current locale's conventions.
        logDiv.appendChild(logItem);
});
});

socket.on('pomodoro_end', () => {
	// If you want to play a sound, uncomment the following line
    new Audio('/sounds/beep.wav').play();
    // alert("Pomodoro is over!");
    favDialog.showModal();
});

socket.on('pomodoro_completed', (completedAt) => {
	console.log('boo');
    let completedPomodoros = JSON.parse(localStorage.getItem('completedPomodoros')) || [];
    completedPomodoros.push(completedAt);
    localStorage.setItem('completedPomodoros', JSON.stringify(completedPomodoros));
});

