var changeDirectionUpEvent = document.createEvent('customEvent'),
	changeDirectionDownEvent = document.createEvent('customEvent'),
	changeDirectionLeftEvent = document.createEvent('customEvent'),
	changeDirectionRightEvent = document.createEvent('customEvent'),
	buttonUp = document.getElementById('button-up'),
	buttonDown = document.getElementById('button-down'),
	buttonLeft = document.getElementById('button-left'),
	buttonRight = document.getElementById('button-right'),
	guiGrid;

// GUI Methods
function _drawGrid(grid) {
	var body = document.getElementsByTagName('body')[0],
		htmlGrid = document.getElementById('grid'),
		row,
		square,
		i = 0,
		j;

	if (htmlGrid) {
		htmlGrid.parentNode.removeChild(htmlGrid);
	}

	htmlGrid = document.createElement('div');
	htmlGrid.setAttribute('id', 'grid');
	htmlGrid.setAttribute('class', 'grid');

	if (!guiGrid || !guiGrid.length) {
		guiGrid = [];
	}

	for (; i < grid.length; i++) {
		guiGrid.push([]);

		row = document.createElement('div');
		row.setAttribute('class', 'row');

		for (j = 0; j < grid[i].length; j++) {
			square = document.createElement('div');
			square.setAttribute('class', 'square');
			square.setAttribute('data-row', i + 1);
			square.setAttribute('data-col', j + 1);
			square.setAttribute('data-type', grid[i][j].type);
			square.setAttribute('data-original-type', grid[i][j].type);

			row.appendChild(square);

			guiGrid[i][j] = square;
		}

		htmlGrid.appendChild(row);
	}

	body.appendChild(htmlGrid);
}

function _drawSnake(snake) {
	var i = 0,
		j,
		snakePos;

	if (guiGrid) {
		// Reset all the snake squares to their original type
		for (; i < guiGrid.length; i++) {
			for (j = 0; j < guiGrid[i].length; j++) {
				if (guiGrid[i][j].getAttribute('data-type') === 'snake') {
					guiGrid[i][j].setAttribute(
						'data-type',
						guiGrid[i][j].getAttribute('data-original-type')
					);
				}
		 	}
	 	}

	 	// Redraw the whole snake
		for (i = 0; i < snake.length; i++) {
			snakePos = snake[i].position;
			guiGrid[snakePos.y][snakePos.x].setAttribute('data-type', 'snake');
		}
	}
}

function _drawFood(position, type) {
	var i = 0,
		j;

 	if (guiGrid && guiGrid.length) {
 		// Reset all the food squares to their original type
		for (; i < guiGrid.length; i++) {
			for (j = 0; j < guiGrid[i].length; j++) {
				if (guiGrid[i][j].getAttribute('data-type') === type) {
					guiGrid[i][j].setAttribute(
						'data-type',
						guiGrid[i][j].getAttribute('data-original-type')
					);
				}
		 	}
	 	}

	 	// Redraw food
		guiGrid[position.y][position.x].setAttribute('data-type', type);
 	}
}

function initGUI(grid, snake) {
	_drawGrid(grid);
	_drawSnake(snake);
}

// Event handlers
function _keyDownHandler(event) {
	switch (event.keyCode) {
		case 37:
			snakeJs.changeDirectionLeft();
			event.preventDefault();
			break;
		case 38:
			snakeJs.changeDirectionUp();
			event.preventDefault();
			break;
		case 39:
			snakeJs.changeDirectionRight();
			event.preventDefault();
			break;
		case 40:
			snakeJs.changeDirectionDown();
			event.preventDefault();
	}
}

// Controls initialization
// Event listeners for direction keys in hardware keyboard using game methods
document.addEventListener('keydown', _keyDownHandler);

// Event listeners for direction buttons using game events
changeDirectionUpEvent.initCustomEvent('snake-js-change-direction-up', true, true, {});
changeDirectionDownEvent.initCustomEvent('snake-js-change-direction-down', true, true, {});
changeDirectionLeftEvent.initCustomEvent('snake-js-change-direction-left', true, true, {});
changeDirectionRightEvent.initCustomEvent('snake-js-change-direction-right', true, true, {});

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

// Event handlers for "Start" button
document.getElementById('button-start').addEventListener('click', function () {
	snakeJs.start();
});

// Game event listeners
document.addEventListener('snake-js-init', function (event) {
	// GUI initialization when game is initialized
	initGUI(event.detail.grid, event.detail.snake);
});

document.addEventListener('snake-js-start', function (event) {
	// Initialize score when game starts
	document.getElementById('score-value').innerHTML = 0;
});

document.addEventListener('snake-js-end', function (event) {
	// Show a confirm dialog when game ends
	if (confirm('Your score: ' + event.detail.score + '. Play again?')) {
		snakeJs.init();
		snakeJs.start();
	}
});

document.addEventListener('snake-js-score-up', function (event) {
	// Update GUI when score changes
	document.getElementById('score-value').innerHTML = event.detail.score;
});

document.addEventListener('snake-js-snake-updated', function (event) {
	// Update GUI when snake is updated
	_drawSnake(event.detail.snake);
});

document.addEventListener('snake-js-food-generated', function (event) {
	// Update GUI when food is generated
	_drawFood(event.detail.position, event.detail.type);
});
// Gane initialization
snakeJs.init();