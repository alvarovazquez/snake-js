var snakeJs = (function () {
	var snakeGame,

		GRID_WIDTH = 25,
		GRID_HEIGHT = GRID_WIDTH,
		GRID_TYPES = {
			SQUARE: {
				type: 'square'
			},
			SNAKE: {
				type: 'snake',
				subtypes: {
					HEAD: 'alive',
					TAIL: 'tail',
					DEAD: 'dead'
				}
			},
			FOOD: {
				type: 'food'
			}
		},
		SNAKE_INITIAL_SIZE = 1,
		SNAKE_MOVEMENT_INTERVAL = 200,
		SNAKE_MOVEMENT_INTERVAL_STEP = 10,
		SNAKE_MOVEMENT_INTERVAL_MIN = 40,
		SNAKE_INITIAL_POS_X = Math.floor(	GRID_WIDTH / 2),
		SNAKE_INITIAL_POS_Y = Math.floor(	GRID_HEIGHT / 2),
		SNAKE_DIRECTION_UP = 'up',
		SNAKE_DIRECTION_DOWN = 'down',
		SNAKE_DIRECTION_LEFT = 'left',
		SNAKE_DIRECTION_RIGHT = 'right',

		grid,
		snake,
		headPosition,
		tailLength,
		direction,
		score,
		movementIntervalId,
		movementInterval;

	function _bindEvents() {
		document.addEventListener('snake-js-change-direction-left', _changeDirectionLeft);
		document.addEventListener('snake-js-change-direction-up', _changeDirectionUp);
		document.addEventListener('snake-js-change-direction-right', _changeDirectionRight);
		document.addEventListener('snake-js-change-direction-down', _changeDirectionDown);
	}

	function _unbindEvents() {
		document.removeEventListener('snake-js-change-direction-left', _changeDirectionLeft);
		document.removeEventListener('snake-js-change-direction-up', _changeDirectionUp);
		document.removeEventListener('snake-js-change-direction-right', _changeDirectionRight);
		document.removeEventListener('snake-js-change-direction-down', _changeDirectionDown);
	}

	function _moveUp() {
		if (headPosition.y > 0) {
			headPosition.y--;
		} else {
			headPosition.y = GRID_HEIGHT;
		}
	}

	function _moveDown() {
		if (headPosition.y < GRID_HEIGHT - 1) {
			headPosition.y++;
		} else {
			headPosition.y = 0;
		}
	}

	function _moveLeft() {
		if (headPosition.x > 0) {
			headPosition.x--;
		} else {
			headPosition.x = GRID_WIDTH - 1;
		}
	}

	function _moveRight() {
		if (headPosition.x < GRID_WIDTH - 1) {
			headPosition.x++;
		} else {
			headPosition.x = 1;
		}
	}

	function _move() {
		var scoreUpEvent,
			levelUpEvent;

		switch (direction) {
			case SNAKE_DIRECTION_UP:
				_moveUp();
				break;
			case SNAKE_DIRECTION_DOWN:
				_moveDown();
				break;
			case SNAKE_DIRECTION_LEFT:
				_moveLeft();
				break;
			case SNAKE_DIRECTION_RIGHT:
				_moveRight();
				break;
			default:
				_end();
				throw "Something went wrong! Snake is trying to move in a direction that does not exist :S";
		}

		if (!_checkCollision()) {
			if (_checkFood()) {
				_eat(headPosition);

				tailLength++;

				score++;
				scoreUpEvent = document.createEvent('customEvent');
				scoreUpEvent.initCustomEvent('snake-js-score-up', true, true, { score: score });
				document.dispatchEvent(scoreUpEvent);

				if (score % 2 === 0 && movementInterval > SNAKE_MOVEMENT_INTERVAL_MIN) {
					movementInterval -= SNAKE_MOVEMENT_INTERVAL_STEP;

					levelUpEvent = document.createEvent('customEvent');
					levelUpEvent.initCustomEvent('snake-js-level-up', true, true, {});
					document.dispatchEvent(levelUpEvent);
				}

				_updateSnake();
				_generateFood();
			} else {
				_updateSnake();
			}

			_resetMovement();
		} else {
			_end();
		}
	}

	function _changeDirectionUp() {
		if (direction !== SNAKE_DIRECTION_UP &&
			direction !== SNAKE_DIRECTION_DOWN) {
			direction = SNAKE_DIRECTION_UP;
			_move();
		}
	}

	function _changeDirectionDown() {
		if (direction !== SNAKE_DIRECTION_DOWN &&
			direction !== SNAKE_DIRECTION_UP) {
			direction = SNAKE_DIRECTION_DOWN;
			_move();
		}
	}

	function _changeDirectionLeft() {
		if (direction !== SNAKE_DIRECTION_LEFT &&
			direction !== SNAKE_DIRECTION_RIGHT) {
			direction = SNAKE_DIRECTION_LEFT;
			_move();
		}
	}

	function _changeDirectionRight() {
		if (direction !== SNAKE_DIRECTION_RIGHT &&
			direction !== SNAKE_DIRECTION_LEFT) {
			direction = SNAKE_DIRECTION_RIGHT;
			_move();
		}
	}

	function _resetMovement() {
		window.clearInterval(movementIntervalId);

		movementIntervalId = window.setInterval(_move, movementInterval);
	}

	function _stopMovement() {
		window.clearInterval(movementIntervalId);
	}

	function _checkCollision() {
		var i = 1;

		for (; i < snake.length; i++) {
			if (snake[i].position.x === headPosition.x &&
				snake[i].position.y === headPosition.y) {
				return true;
			}
		}

		return false;
	}

	function _checkFood() {
		if (grid[headPosition.y][headPosition.x].type === GRID_TYPES.FOOD.type) {
			return true;
		}

		return false;
	}

	function _eat(position) {
		var foodSquare = grid[position.y][position.x];

		if (foodSquare.type === GRID_TYPES.FOOD.type) {
			foodSquare.type = GRID_TYPES.SQUARE.type;
		}
	}

	function _generateFood() {
		var foodGeneratedEvent,
			xPos = Math.floor(Math.random() * (GRID_WIDTH - 1)),
			yPos = Math.floor(Math.random() * (GRID_HEIGHT - 1)),
			i = 0;

		for (; i < snake.length; i++) {
			if (snake[i].position.x === xPos && snake[i].position.y === yPos) {
				// Food was generated in a place where the snake already is.
				// Recursively generate in a different place.
				_generateFood();

				return;
			}
		}

		grid[yPos][xPos].type = GRID_TYPES.FOOD.type;

		foodGeneratedEvent = document.createEvent('customEvent');
		foodGeneratedEvent.initCustomEvent('snake-js-food-generated', true, true, {
			position: {
				x: xPos,
				y: yPos,
			},
			type: GRID_TYPES.FOOD.type
		});
		document.dispatchEvent(foodGeneratedEvent);
	}

	function _updateSnake() {
		var snakeUpdatedEvent,
			i = 0;

		if (snake.length === tailLength) {
			snake.pop();
		}

		snake.unshift({
			position: {
				x: headPosition.x,
				y: headPosition.y
			}
		});

		snakeUpdatedEvent = document.createEvent('customEvent');
		snakeUpdatedEvent.initCustomEvent('snake-js-snake-updated', true, true, { snake: snake });
		document.dispatchEvent(snakeUpdatedEvent);
	}

	function _initValues() {
		grid = [];
		snake = [];
		headPosition = {
			x: SNAKE_INITIAL_POS_X,
			y: SNAKE_INITIAL_POS_Y
		};
		tailLength = SNAKE_INITIAL_SIZE;
		direction = SNAKE_DIRECTION_RIGHT;

		movementInterval = SNAKE_MOVEMENT_INTERVAL;
		movementIntervalId = undefined;

		score = 0;
	}

	function _initGrid() {
		var i = 0,
			j;

		grid = [];

		for (; i < GRID_HEIGHT; i++) {
			grid.push([]);
			for (j = 0; j < GRID_WIDTH; j++) {
				grid[i].push({
					type: GRID_TYPES.SQUARE.type
				});
			}
		}
	}

	function _initSnake() {
		var i = 1;

		snake = [];

		snake[0] = {
			position: {
				x: SNAKE_INITIAL_POS_X,
				y: SNAKE_INITIAL_POS_Y
			},
			type: GRID_TYPES.SNAKE.subtypes.HEAD
		};
		// TODO Take into account if snake tail is too long
		for (; i < tailLength; i++) {
			snake[i] = {
				position: {
					x: snake[0].x - 1,
					y: snake[0].y
				},
				type: GRID_TYPES.SNAKE.subtypes.TAIL
			};
		}
	}

	function _initFood() {
		_generateFood();
	}

	function _initMovement() {
		_resetMovement();
	}

	function _init() {
		var initEvent = document.createEvent('customEvent'),
			initData;

		_bindEvents();

		_initValues();
		_initGrid();
		_initSnake();

		// TODO return a copy of the game data instead of original one?
		initData = {
			snake: snake,
			grid: grid
		};

		initEvent.initCustomEvent('snake-js-init', true, true, initData);
		document.dispatchEvent(initEvent);

		return initData;
	}

	function _start() {
		var startEvent = document.createEvent('customEvent');

		_initFood();
		_initMovement();

		startEvent.initCustomEvent('snake-js-start', true, true, {});
		document.dispatchEvent(startEvent);
	}

	function _pause() {
		// TODO Next feature to add
		throw "Feature not implemented yet";
	}

	function _end() {
		var endEvent = document.createEvent('customEvent');

		_stopMovement();

		_unbindEvents();

		endEvent.initCustomEvent('snake-js-end', true, true, { score: score });
		document.dispatchEvent(endEvent);
	}

	snakeGame = {
		init: _init,
		start: _start,
		pause: _pause,
		changeDirectionUp: _changeDirectionUp,
		changeDirectionDown: _changeDirectionDown,
		changeDirectionLeft: _changeDirectionLeft,
		changeDirectionRight: _changeDirectionRight
	};

	return snakeGame;
})();