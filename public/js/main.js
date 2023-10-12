const socket = io();
const timerDiv = document.getElementById('timer');
const durationDiv = document.getElementById('duration');
// const progress = document.getElementById('tomate');
const pomoButton = document.getElementById('tomato');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const shortButton = document.getElementById('short');
const longButton = document.getElementById('long');
const favDialog = document.getElementById("favDialog");
const showLog = document.getElementById('show');

socket.on('timer', (timer) => {
    timerDiv.textContent = timer;
});

socket.on('progress', (timer) => {
    const mins = Math.floor(timer / 60);
//    progress.max = durationDiv.textContent;
//    progress.value = durationDiv.textContent - mins - 1;
});

socket.on('duration', (duration) => {
    durationDiv.textContent = duration;
})

pomoButton.addEventListener('click', () => {
    socket.emit('set_pomo');
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

shortButton.addEventListener('click', () =>  {
    socket.emit('short_break');
});

longButton.addEventListener('click', () =>  {
    socket.emit('long_break');
});

showLog.addEventListener('click', () => {
	let completedPomodoros = JSON.parse(localStorage.getItem('completedPomodoros')) || [];
    let logDiv = document.getElementById('log');
    if (showLog.innerHTML == 'Show Log') {
        showLog.innerHTML = 'Hide Log';
        logDiv.innerHTML = '';
        let reversedPomodoros = [...completedPomodoros].reverse();
        reversedPomodoros.forEach(function(pomodoro) {
            let logItem = document.createElement('div');
            let date = new Date(pomodoro);
            logItem.textContent = date.toLocaleString(); // Converts the date into a string, using the current locale's conventions.
            logDiv.appendChild(logItem);
             });
    }
    else {
        showLog.innerHTML = 'Show Log';
        logDiv.innerHTML = '';
    }
});

socket.on('pomodoro_end', () => {
	// If you want to play a sound, uncomment the following line
    //    progress.value = progress.max;
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

