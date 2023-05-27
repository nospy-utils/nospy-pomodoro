var focusTimeTarget = 0;
var focusTimeLeft = 0;
var restTimeTarget = 0;
var restTimeLeft = 0;
var focusToggle = false;
var paused = false;

function displayTime(time) {
	var minutes = Math.floor(time / 60);
	var seconds = time % 60;
	var display = minutes.toString().padStart(2,'0') + ":" 
		+ seconds.toString().padStart(2,'0');
	document.getElementById("countdown").textContent = display;
}

function displayCurrentPhase() {
	if (focusToggle) {
		document.getElementById("currentPhase").textContent = "Focus";
	} else {
		document.getElementById("currentPhase").textContent = "Rest";	
	}
}

function countdown(callbackFocus, callbackRest) {
	var interval = setInterval(function() {
		var minutes;
		var seconds;

		if (paused) {
			clearInterval(interval);
		}

		if (focusToggle) {
			focusTimeLeft--;
			displayTime(focusTimeLeft);
			if (focusTimeLeft <= 0) {
				callbackFocus();
				focusTimeLeft = focusTimeTarget;
				focusToggle = false;
			}
		} else {
			restTimeLeft--;
			displayTime(restTimeLeft);
			if (restTimeLeft <= 0) {
				callbackRest();
				restTimeLeft = restTimeTarget;
				focusToggle = true;
			}
		}
		displayCurrentPhase();
	}, 1000);
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

	paused = false;
	focusToggle = true;
	
	countdown(() => {
		notify("Focus Time's Up! - Take a break");
	}, () => {
		notify("Break Time's Up! - Get back to work");
	});
}

function stop() {
	paused = true;
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
	if(requestNotificationPermission()) {
		var notification = new Notification(message);
	}
}

function toggleControls() {
	var startButton = document.getElementById("start");
	var stopButton = document.getElementById("stop");

	if(startButton.disabled) {
		startButton.disabled = false;
		stopButton.disabled = true;
	} else {
		startButton.disabled = true;
		stopButton.disabled = false;
	}

}

document.getElementById("start").addEventListener("click", start);
document.getElementById("stop").addEventListener("click", stop);

