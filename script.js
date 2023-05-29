var focusTimeTarget = 0;
var focusTimeLeft = 0;
var restTimeTarget = 0;
var restTimeLeft = 0;
var focusToggle = false;
var doVisualUpdates = true;
var worker = undefined;

function displayTime() {
	var time = focusToggle ? focusTimeLeft : restTimeLeft;
	var minutes = Math.floor(time / 60);
	var seconds = time % 60;
	var display = minutes.toString().padStart(2, '0') + ":"
		+ seconds.toString().padStart(2, '0');
	document.getElementById("countdown").textContent = display;
}

function displayCurrentPhase() {
	if (focusToggle) {
		document.getElementById("currentPhase").textContent = "Focus";
	} else {
		document.getElementById("currentPhase").textContent = "Rest";
	}
}

function updateUI() {
	// inactive tabs get throttled by the browser so 
	// we don't want to update UI not visible which 
	// saves baterry significantly
	if (!doVisualUpdates) {
		return;
	}

	displayTime();
	displayCurrentPhase();
}

function updateCounters() {
	if (focusToggle) {
		focusTimeLeft--;
		if (focusTimeLeft <= 0) {
			notify();
			focusTimeLeft = focusTimeTarget;
			focusToggle = false;
		}
	} else {
		restTimeLeft--;
		if (restTimeLeft <= 0) {
			notify();
			restTimeLeft = restTimeTarget;
			focusToggle = true;
		}
	}
}

function countdown() {
	worker = new Worker('worker.js')
	worker.onmessage = function (e) {
		updateUI();
		updateCounters();
	};	
}

function start() {
	if (!requestNotificationPermission()) {
		alert("Please allow notification to use this app");
		return;
	}

	toggleControls();

	var focusMinutes = parseInt(document.getElementById("focusMinutes").value);
	var focusSeconds = parseInt(document.getElementById("focusSeconds").value);
	focusTimeTarget = focusMinutes * 60 + focusSeconds;
	focusTimeLeft = focusTimeTarget;

	var restMinutes = parseInt(document.getElementById("restMinutes").value);
	var restSeconds = parseInt(document.getElementById("restSeconds").value);
	restTimeTarget = restMinutes * 60 + restSeconds;
	restTimeLeft = restTimeTarget;

	focusToggle = true;
	countdown();
}

function stop() {
	worker.terminate()
	toggleControls();
}

function requestNotificationPermission() {
	if (!("Notification" in window)) {
		alert("This browser does not support desktop notification");
		return false;
	} else if (Notification.permission === "denied") {
		alert("You have denied desktop notification");
		return false;
	} else if (Notification.permission === "granted") {
		return true;
	} else {
		Notification.requestPermission();
		return true;
	}
}

function notify(message) {
	var message = focusToggle ? "Focus Time's Up! - Take a break" : "Break Time's Up! - Get back to work";
	if (requestNotificationPermission()) {
		var notification = new Notification(message);
	}
}

function toggleControls() {
	var startButton = document.getElementById("start");
	var stopButton = document.getElementById("stop");

	if (startButton.disabled) {
		startButton.disabled = false;
		stopButton.disabled = true;
	} else {
		startButton.disabled = true;
		stopButton.disabled = false;
	}

}

document.getElementById("start").addEventListener("click", start);
document.getElementById("stop").addEventListener("click", stop);
document.addEventListener('visibilitychange', () => { doVisualUpdates = !document.hidden; });