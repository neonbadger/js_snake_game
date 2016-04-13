var draw = function(snakeToDraw, apple) {
    var drawableSnake = {color: 'green', pixels: snakeToDraw};
    var drawableApple = {color: 'red', pixels: [apple]};
    var drawableObjects = [drawableSnake, drawableApple];
    CHUNK.draw(drawableObjects);
};


var moveSegment = function(segment) {
    if (segment.direction == 'down') {
        return {top: segment.top + 1, left: segment.left};
    } else if (segment.direction == 'up') {
        return {top: segment.top - 1, left: segment.left};
    } else if (segment.direction == 'right') {
        return {top: segment.top, left: segment.left + 1 };
    } else if (segment.direction == 'left') {
        return {top: segment.top, left: segment.left - 1};
    }
    return segment;
};

// make tail follow head
var segmentFurtherForwardThan = function(index, snake) {
    if (snake[index - 1] === undefined) {
        return snake[index];
    } else {
        return snake[index - 1];
    }
};


var moveSnake = function(snake) {
    // move 1 segment
    // var oldSegment = snake[0];
    // var newSegment = moveSegment(oldSegment);
    // newSegment.direction = oldSegment.direction;
    // var newSnake = [newSegment];


    // var newSnake = [];
    // snake.forEach(function(oldSegment) {
    //     var newSegment = moveSegment(oldSegment);
    //     newSegment.direction = oldSegment.direction;
    //     newSnake.push(newSegment);
    // });
    // return newSnake;

    return snake.map(function(oldSegment, segmentIndex) {
        var newSegment = moveSegment(oldSegment);
        newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
        return newSegment;
    });

};


var growSnake = function(snake) {
    var indexOfLastSegment = snake.length - 1;
    var lastSegment = snake[indexOfLastSegment];
    snake.push({top: lastSegment.top, left: lastSegment.left});
    return snake;
};


var ate = function(snake, otherThing) {
    var head = snake[0];
    return CHUNK.detectCollisionBetween([head], otherThing);
};


var advanceGame = function() {
    var newSnake = moveSnake(snake);

    if (ate(newSnake, snake)) {
        CHUNK.endGame();
        CHUNK.flashMessage("Oops! You ate yourself!");
    }

    if (ate(newSnake, [apple])) {
        newSnake = growSnake(snake);
        apple = CHUNK.randomLocation();
    }

    // if (CHUNK.detectCollisionBetween([apple], snake)) {
    //     snake = growSnake(snake);
    //     apple = CHUNK.randomLocation();
    // }

    if (ate(newSnake, CHUNK.gameBoundaries())) {
        CHUNK.endGame();
        CHUNK.flashMessage("Oops! You hit a wall!");
    }

    // if (CHUNK.detectCollisionBetween(snake, CHUNK.gameBoundaries())) {
    //     CHUNK.endGame();
    //     CHUNK.flashMessage("Oops! You hit a wall!");
    // }

    snake = newSnake;

    draw(snake, apple);
};


var changeDirection = function(direction) {
    snake[0].direction = direction;
};


var snake = [{top: 1, left: 0, direction: 'down'},
             {top: 0, left: 0, direction: 'down'}];
var apple = {top: 8, left: 10};

CHUNK.executeNTimesPerSecond(advanceGame, 1);
CHUNK.onArrowKey(changeDirection);


// snake = moveSnake(snake);
// drawSnake(snake);