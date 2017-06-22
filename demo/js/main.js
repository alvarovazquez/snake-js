var changeDirectionUpEvent = document.createEvent('customEvent'),
	changeDirectionDownEvent = document.createEvent('customEvent'),
	changeDirectionLeftEvent = document.createEvent('customEvent'),
	changeDirectionRightEvent = document.createEvent('customEvent'),
	buttonUp = document.getElementById('button-up'),
	buttonDown = document.getElementById('button-down'),
	buttonLeft = document.getElementById('button-left'),
	buttonRight = document.getElementById('button-right');

snakeJs.start();

// Game events
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

// Virtual keyboard events
// Initialization of custom events
changeDirectionUpEvent.initCustomEvent('snake-js-change-direction-up', true, true, {});
changeDirectionDownEvent.initCustomEvent('snake-js-change-direction-down', true, true, {});
changeDirectionLeftEvent.initCustomEvent('snake-js-change-direction-left', true, true, {});
changeDirectionRightEvent.initCustomEvent('snake-js-change-direction-right', true, true, {});

// Add event handlers for direction button clicks
buttonUp.addEventListener('click', function (event) {
	document.dispatchEvent(changeDirectionUpEvent);
});

buttonDown.addEventListener('click', function (event) {
	document.dispatchEvent(changeDirectionDownEvent);
});

buttonLeft.addEventListener('click', function (event) {
	document.dispatchEvent(changeDirectionLeftEvent);
});

buttonRight.addEventListener('click', function (event) {
	document.dispatchEvent(changeDirectionRightEvent);
});