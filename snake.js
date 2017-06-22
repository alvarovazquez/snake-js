var snakeJs = (function () {
	var snakeGame,

		PLAYGROUND_WIDTH = 25,
		PLAYGROUND_HEIGHT = 	PLAYGROUND_WIDTH,
		SNAKE_INITIAL_SIZE = 1,
		SNAKE_MOVEMENT_INTERVAL = 200,
		SNAKE_MOVEMENT_INTERVAL_STEP = 10,
		SNAKE_MOVEMENT_INTERVAL_MIN = 40,
		SNAKE_INITIAL_POS_X = Math.floor(	PLAYGROUND_WIDTH / 2),
		SNAKE_INITIAL_POS_Y = Math.floor(	PLAYGROUND_HEIGHT / 2),
		SNAKE_DIRECTION_UP = 'up',
		SNAKE_DIRECTION_DOWN = 'down',
		SNAKE_DIRECTION_LEFT = 'left',
		SNAKE_DIRECTION_RIGHT = 'right',

		position = {
			x: SNAKE_INITIAL_POS_X,
			y: SNAKE_INITIAL_POS_Y
		},
		length = SNAKE_INITIAL_SIZE,
		direction = SNAKE_DIRECTION_RIGHT,
		score = 0,
		squares = [],
		snake = [],

		movementIntervalId,
		movementInterval = SNAKE_MOVEMENT_INTERVAL,
		movementMinInterval = SNAKE_MOVEMENT_INTERVAL_MIN;

	function _keyDownHandler(event) {
		switch (event.keyCode) {
			case 37:
				_changeDirectionLeft();
				event.preventDefault();
				break;
			case 38:
				_changeDirectionUp();
				event.preventDefault();
				break;
			case 39:
				_changeDirectionRight();
				event.preventDefault();
				break;
			case 40:
				_changeDirectionDown();
				event.preventDefault();
		}
	}

	function _bindEvents() {
		document.addEventListener('keydown', _keyDownHandler);
		document.addEventListener('snake-js-change-direction-left', _changeDirectionLeft);
		document.addEventListener('snake-js-change-direction-up', _changeDirectionUp);
		document.addEventListener('snake-js-change-direction-right', _changeDirectionRight);
		document.addEventListener('snake-js-change-direction-down', _changeDirectionDown);
	}

	function _unbindEvents() {
		document.removeEventListener('keydown', _keyDownHandler);
		document.removeEventListener('snake-js-change-direction-left', _changeDirectionLeft);
		document.removeEventListener('snake-js-change-direction-up', _changeDirectionUp);
		document.removeEventListener('snake-js-change-direction-right', _changeDirectionRight);
		document.removeEventListener('snake-js-change-direction-down', _changeDirectionDown);
	}

	function _moveUp() {
		if (position.y > 1) {
			position.y--;
		} else {
			position.y = PLAYGROUND_HEIGHT;
		}
	}

	function _moveDown() {
		if (position.y < PLAYGROUND_HEIGHT) {
			position.y++;
		} else {
			position.y = 1;
		}
	}

	function _moveLeft() {
		if (position.x > 1) {
			position.x--;
		} else {
			position.x = PLAYGROUND_WIDTH;
		}
	}

	function _moveRight() {
		if (position.x < PLAYGROUND_WIDTH) {
			position.x++;
		} else {
			position.x = 1;
		}
	}

	function _move() {
		var scoreUpEvent;

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
				_moveRight();
		}

		if (!_checkCollision()) {
			if (_checkEaten()) {
				length++;
				score++;
				_drawFood();

				if (score % 2 === 0 && movementInterval > SNAKE_MOVEMENT_INTERVAL_MIN) {
					movementInterval -= SNAKE_MOVEMENT_INTERVAL_STEP;
				}

				scoreUpEvent = document.createEvent('customEvent');
				scoreUpEvent.initCustomEvent('snake-js-score-up', true, true, { score: score });
				document.dispatchEvent(scoreUpEvent);
			}

			_startMovement();
			_drawSnake();
		} else {
			_drawCollision();
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

	function _startMovement() {
		window.clearInterval(movementIntervalId);

		movementIntervalId = window.setInterval(_move, movementInterval);
	}

	function _stopMovement() {
		window.clearInterval(movementIntervalId);
	}

	function _checkCollision() {
		var i = 0;

		for (; i < squares.length; i++) {
			if (squares[i].getAttribute('data-type') === 'snake' &&
				squares[i].getAttribute('data-row') == position.y &&
				squares[i].getAttribute('data-col') == position.x) {
				return true;
			}
		}

		return false;
	}

	function _checkEaten() {
		var i = 0;

		for (; i < squares.length; i++) {
			if (squares[i].getAttribute('data-type') === 'food' &&
				squares[i].getAttribute('data-row') == position.y &&
				squares[i].getAttribute('data-col') == position.x) {
				return true;
			}
		}

		return false;
	}

	function _drawPlayground() {
		var body = document.getElementsByTagName('body')[0],
			playground = document.getElementById('playground'),
			row,
			square,
			i = 0,
			j;

		if (playground) {
			playground.parentNode.removeChild(playground);
		}

		playground = document.createElement('div');
		playground.setAttribute('id', 'playground');
		playground.setAttribute('class', 'playground');

		for (; i < PLAYGROUND_HEIGHT; i++) {
			row = document.createElement('div');
			row.setAttribute('class', 'row');

			for (j = 0; j < PLAYGROUND_WIDTH; j++) {
				square = document.createElement('div');
				square.setAttribute('class', 'square');
				square.setAttribute('data-row', i + 1);
				square.setAttribute('data-col', j + 1);
				square.setAttribute('data-type', 'square');

				row.appendChild(square);

				squares.push(square);
			}

			playground.appendChild(row);
		}

		body.appendChild(playground);
	}

	function _drawSnake() {
		var i = 0;

		if (snake.length === length) {
			snake[0].setAttribute('data-type', 'square');
			snake.shift();
		}

		for (; i < squares.length; i++) {
			if (squares[i].getAttribute('data-row') == position.y && squares[i].getAttribute('data-col') == position.x) {
				squares[i].setAttribute('data-type', 'snake');
				snake.push(squares[i]);
			}
		}
	}

	function _drawFood() {
		var xPos = Math.floor((Math.random() * PLAYGROUND_WIDTH) + 1),
			yPos = Math.floor((Math.random() * PLAYGROUND_HEIGHT) + 1),
			i = 0;

		for (; i < squares.length; i++) {
			if (squares[i].getAttribute('data-row') == yPos &&
				squares[i].getAttribute('data-col') == xPos) {
				if (squares[i].getAttribute('data-type') === 'snake') {
					_drawFood();
				} else {
					squares[i].setAttribute('data-type', 'food');
				}
				break;
			}
		}
	}

	function _drawCollision() {
		var i = 0;

		for (; i < snake.length; i++) {
			snake[i].setAttribute('class', snake[i].getAttribute('class') + ' dead');
		}
	}

	function _init() {
		_drawPlayground();
	}

	function _start() {
		var startEvent = document.createEvent('customEvent');

		startEvent.initCustomEvent('snake-js-start', true, true, {});

		position = {
			x: SNAKE_INITIAL_POS_X,
			y: SNAKE_INITIAL_POS_Y
		};
		length = SNAKE_INITIAL_SIZE;
		direction = SNAKE_DIRECTION_RIGHT;
		score = 0;
		squares = [];
		snake = [];
		movementInterval = SNAKE_MOVEMENT_INTERVAL;
		movementIntervalId = undefined;

		_drawPlayground();
		_bindEvents();
		_drawSnake();
		_drawFood();
		_startMovement();

		document.dispatchEvent(startEvent);
	}

	function _end() {
		var endEvent = document.createEvent('customEvent');

		endEvent.initCustomEvent('snake-js-end', true, true, { score: score });

		_stopMovement();
		_unbindEvents();

		document.dispatchEvent(endEvent);
	}

	snakeGame = {
		start: _start
	};

	return snakeGame;
})();