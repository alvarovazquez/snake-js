# SnakeJS

Yet another Snake game made with plain JavaScript.

## How is it made?

This game is made using only plan JavaScript (ES5 standard).

The game itself is wrapped using the Module Pattern and it can be accesed using the global variable `snakeJs`.

## API

The game itself can be accesed using the variable `snakeJs` in the global scope.

The game only exposes a single method: `start()`. When this method is called, the game will start.

The game will trigger a few events:

 * `snake-js-start` when the game starts.
 * `snake-js-end` when the game finishes. The event will have the final score in the `event.detail.score` property.
 * `snake-js-score-up` when the snake eats an apple, thus scoring a point.  The event will have the new score in the `event.detail.score` property.

You can use these events, for example, for updating or resetting a scoreboard, or to show messages to the user.

## Demo

Clone this repository, open the `demo` folder and open `index.html` with your web browser for playing the game.

You can also play the game visiting [alvarovazquez.es/snake-js](http://www.alvarovazquez.es/snake-js/).

## Styles

The game can run without any styles, but its easier for the player to have some visual feedback :). The demo is provided with some basic styles trying to emulate the good old cellular phone screens. The only styles you need to play this game is to have a well formed grid, and different colors for the snake, the apples and the background.