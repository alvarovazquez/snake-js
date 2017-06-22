snakeJs.start();

document.addEventListener('snake-js-score-up', function (event) {
	document.getElementById('score-value').innerHTML = event.detail.score;
});

document.addEventListener('snake-js-start', function (event) {
	document.getElementById('score-value').innerHTML = 0;
});

document.addEventListener('snake-js-end', function (event) {
	if (confirm('Your score: ' + event.detail.score + '. Play again?')) {
		snakeJs.start();
	}
});