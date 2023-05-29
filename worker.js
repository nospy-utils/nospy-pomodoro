/*
 * Browsers tend to limit the amount of work a tab can do while inactive. 
 * Although this is relevant for saving battery, it also means that having a 
 * countdown timer in a tab that is not visible will not work as expected.
 * 
 * The workaround is to use the workers API as they are background threads 
 * that don't get throttled by the browser (yet).
 */
function workerCounter() {
    setInterval(() => {
		postMessage('tick');
	}, 1000);
}

workerCounter();