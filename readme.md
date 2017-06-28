# SnakeJS

Yet another Snake game made with plain JavaScript.

## How is it made?

This game is made using only plan JavaScript (ES5 standard).

The game itself is wrapped using the Module Pattern and it can be accesed using the global variable `snakeJs`.

## API

The game itself can be accesed using the variable `snakeJs` in the global scope.

The game exposes a few methods:

 * `init()` When this method is called, the game will initialize. Game cannot start until it is initialized.
 * `start()` When this method is called, the game will start.
 * `changeDirectionUp()` will change the snake direction upwards. Same as triggering `snake-js-change-direction-up` event.
 * `changeDirectionDown()` will change the snake direction downwards. Same as triggering `snake-js-change-direction-down` event.
 * `changeDirectionLeft()` will change the snake direction to the left. Same as triggering `snake-js-change-direction-left` event.
 * `changeDirectionRight()` will change the snake direction to the righ. Same as triggering `snake-js-change-direction-right` event.

The game will trigger a few events:

 * `snake-js-init` when the game is initialized.
 * `snake-js-start` when the game starts.
 * `snake-js-end` when the game finishes. The event will have the final score in the `event.detail.score` property.
 * `snake-js-score-up` when the snake eats an apple, thus scoring a point.  The event will have the new score in the `event.detail.score: number` property.
 * `snake-js-level-up` when the speed of the game increases.
 * `snake-js-food-generated` when new food is generated somewhere in the grid.  The event will have the new food position `event.detail.position: {x: number, y: number}` property and the type in the `event.detail.type: string` property.
`snake-js-snake-updated` when the snake changes position.  The event will have the new snake position array in the `event.detail.snake: [{position: {x: number, y: number}}, ...]` property.

You can use these events, for example, for updating or resetting a scoreboard, or to show messages to the user.

The game will also respond to some events:

 * `snake-js-change-direction-up` will change the snake direction upwards. Same as calling `changeDirectionUp()` event.
 * `snake-js-change-direction-down` will change the snake direction downwards. Same as calling `changeDirectionDown()` event.
 * `snake-js-change-direction-left` will change the snake direction to the left. Same as calling `changeDirectionLeft()` event.
 * `snake-js-change-direction-right` will change the snake direction to the right. Same as calling `changeDirectionRight()` event.

You can use these events to set up some controls, i.e. attaching events to screen buttons or hardware keyboard.

## Demo

Clone this repository, open the `demo` folder and open `index.html` with your web browser for playing the game.

You can also play the game visiting [alvarovazquez.es/snake-js](http://www.alvarovazquez.es/snake-js/).

## Styles

The game can run without any styles, but its easier for the player to have some visual feedback :). The demo is provided with some basic styles trying to emulate the good old cellular phone screens. The only styles you need to play this game is to have a well formed grid, and different colors for the snake, the apples and the background.