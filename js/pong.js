/* *
 * JavaScript Pong Game
 */

/* jshint esversion: 6 */


// Class definitions

class Vector
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
}

class Rect
{
    constructor(width, height)
    {
        this.pos = new Vector();
        this.size = new Vector(width, height); // where `x` of the `Vector` is the `width` and `y` is the `height`
    }
}

class Ball extends Rect
{
    constructor()
    {
        super(10, 10);
        this.vel = new Vector();
    }
}



//// Program start

// Get canvas
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// Fill background black
context.fillStyle = "#000";
context.fillRect(0, 0, canvas.width, canvas.height);

// Instantiate ball
const ball = new Ball();

// Move ball
ball.pos.x = 40;
ball.pos.y = 55;

// Draw ball
context.fillStyle = "#fff";
context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
