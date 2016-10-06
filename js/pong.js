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
    constructor(width, height, posVec)
    {
        this.pos = posVec;
        this.size = new Vector(width, height); // where `x` of the `Vector` is the `width` and `y` is the `height`
    }

    get left()
    {
        return this.pos.x - this.size.x / 2;
    }
    set left(pos)
    {
        this.pos.x = pos + this.size.x / 2;
    }
    get right()
    {
        return this.pos.x + this.size.x / 2;
    }
    set right(pos)
    {
        this.pos.x = pos - this.size.x / 2;
    }
    get top()
    {
        return this.pos.y - this.size.y / 2;
    }
    set top(pos)
    {
        this.pos.y = pos + this.size.y / 2;
    }
    get bottom()
    {
        return this.pos.y + this.size.y / 2;
    }
    set bottom(pos)
    {
        this.pos.y = pos - this.size.y / 2;
    }
}

class Ball extends Rect
{
    constructor(posVec, velVec)
    {
        super(10, 10, posVec);
        this.vel = velVec;
    }
}

class Player extends Rect
{
    constructor(posVec)
    {
        super(20, 100, posVec);
        this.score = 0;
    }
}


class Pong
{
    constructor(canvas)
    {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");

        // Instantiate ball with position and
        this.ball = new Ball(new Vector(40, 55), new Vector(100, 120));

        // Set up players array
        this.players = [
            new Player(new Vector(30, this._canvas.height / 2)),
            new Player(new Vector(this._canvas.width - 30, this._canvas.height / 2))
        ];

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
        if (deltaTime > 0.5) // If over half a second skip frame because something unwanted has happened eg lost focus etc
            return;

        this.ball.pos.x += this.ball.vel.x * deltaTime;
        this.ball.pos.y += this.ball.vel.y * deltaTime;

        // Flip velocities when the ball hits the edge
        if (this.ball.left < 0 || this.ball.right  > this._canvas.width)
            this.ball.vel.x = -this.ball.vel.x;
        if (this.ball.top  < 0 || this.ball.bottom > this._canvas.height)
            this.ball.vel.y = -this.ball.vel.y;

        //console.log("Ball x: " + Math.floor(this.ball.pos.x) + "; Ball y: " + Math.floor(this.ball.pos.y));

        // Player 2 """"AI""""
        this.players[1].pos.y += this.ball.vel.y * deltaTime * 0.65;

        // Don't allow paddles clip edges
        this.players.forEach((player) => {
        if (player.top < 0)
            player.top = 0;
        if (player.bottom > this._canvas.height)
            player.bottom = this._canvas.height;
        });
    }

    // Game render function
    render()
    {
        // Fill background black
        this._context.fillStyle = "#000";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);


        // Draw ball
        this.drawRect(this.ball);
        // Draw all players in array
        this.players.forEach((player) => this.drawRect(player)); // Arrow function
    }

    drawRect(rect)
    {
        this._context.fillStyle = "#fff";
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }
}


//// Program start

// Get canvas
const canvas = document.getElementById("pong");
// Start game
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', (event) => {
    // TODO limit speed a little
    pong.players[0].pos.y += (event.offsetY - pong.players[0].pos.y) * 0.3;
});
