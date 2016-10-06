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

    get left()
    {
        return this.pos.x;
    }
    get right()
    {
        return this.pos.x + this.size.x ;
    }
    get top()
    {
        return this.pos.y;
    }
    get bottom()
    {
        return this.pos.y + this.size.y;
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


class Pong
{
    constructor(canvas)
    {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");

        // Instantiate and move ball
        this.ball = new Ball();
        this.ball.vel.x = 100; // In pixels per second
        this.ball.vel.y = 120;
        this.ball.pos.x = 40;
        this.ball.pos.y = 55;

        // Create requestAnimationFrame callback game loop
        let lastTime;
        const callback = (millis) =>
        {
            if (lastTime)
            {
                this.update((millis - lastTime) / 1000);
                this.render();
            }

            lastTime = millis;
            requestAnimationFrame(callback);
        };
        // Start game callback loop
        requestAnimationFrame(callback);
    }

    // Game update method (`deltaTime` is in seconds)
    update(deltaTime)
    {
        this.ball.pos.x += this.ball.vel.x * deltaTime;
        this.ball.pos.y += this.ball.vel.y * deltaTime;

        // Flip velocities when the ball hits the edge
        if (this.ball.left < 0 || this.ball.right  > this._canvas.width)
            this.ball.vel.x = -this.ball.vel.x;
        if (this.ball.top  < 0 || this.ball.bottom > this._canvas.height)
            this.ball.vel.y = -this.ball.vel.y;

        //console.log("Ball x: " + Math.floor(this.ball.pos.x) + "; Ball y: " + Math.floor(this.ball.pos.y));
    }

    // Game render function
    render()
    {
        // Fill background black
        this._context.fillStyle = "#000";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);


        // Draw ball
        this.drawRect(this.ball);
    }

    drawRect(rect)
    {
        this._context.fillStyle = "#fff";
        this._context.fillRect(this.ball.pos.x, this.ball.pos.y, this.ball.size.x, this.ball.size.y);
    }
}


//// Program start

// Get canvas
const canvas = document.getElementById("pong");
const pong = new Pong(canvas);
