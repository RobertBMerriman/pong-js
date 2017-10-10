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

    get len()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set len(value)
    {
        const fact = value / this.len;
        this.x *= fact;
        this.x *= fact;
    }
}

class Rect
{
    constructor(width, height, posVec = new Vector())
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
    get position()
    {
        return this.pos;
    }
    set position(posVec)
    {
        this.pos.x = posVec.x;
        this.pos.y = posVec.y;
    }
    setPosition(x, y)
    {
        this.pos.x = x;
        this.pos.y = y;
    }
    get velocity()
    {
        return this.vel;
    }
    set velocity(velVec)
    {
        this.vel.x = velVec.x;
        this.vel.y = velVec.y;
    }
    setVelocity(x, y)
    {
        this.vel.x = x;
        this.vel.y = y;
    }
}

class Ball extends Rect
{
    constructor(posVec, velVec = new Vector())
    {
        super(10, 10, posVec);
        this.vel = velVec;
    }
}

class Player extends Rect
{
    constructor(posVec, leftPlayer)
    {
        super(20, 100, posVec);
        this.leftPlayer = leftPlayer;
        this.rightPlayer = !leftPlayer;
        this.score = 0;
    }
}


class Pong
{
    constructor(canvas)
    {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");

        // Instantiate ball
        this.ball = new Ball();

        // Set up players array
        this.players = [
            new Player(new Vector(30, this._canvas.height / 2), true),
            new Player(new Vector(this._canvas.width - 30, this._canvas.height / 2), false)
        ];

        // Create requestAnimationFrame callback game loop
        let lastTime;
        const callback = (millis) =>
        {
            if (lastTime)
            {
                let deltaTime = (millis - lastTime) / 1000;

                // If over half a second skip frame because something unwanted has happened eg lost focus etc
                if (deltaTime < 0.5)
                {
                    this.update(deltaTime);
                    this.collisionDetection();
                    this.render();
                }
            }

            lastTime = millis;
            requestAnimationFrame(callback);
        };
        // Start game callback loop
        requestAnimationFrame(callback);

        this.NUM_PIXEL = 10;
        this.NUMS = [
            '111101101101111',
            '010010010010010',
            '111001111100111',
            '111001111001111',
            '101101111001001',
            '111100111001111',
            '111100111101111',
            '111001001001001',
            '111101111101111',
            '111101111001011'
        ].map(str => {
            const canvas = document.createElement('canvas');
            const s = this.NUM_PIXEL;
            canvas.height = s * 5;
            canvas.width = s * 3;
            const context = canvas.getContext('2d');
            context.fillStyle = '#fff';
            str.split('').forEach((fill, i) => {
                if (fill === '1') {
                    context.fillRect((i % 3) * s, (i / 3 | 0) * s, s, s);
                }
            });
            return canvas;
        });

        // Set ball to initial position
        this.reset();
    }

    // Game update method (`deltaTime` is in seconds)
    update(deltaTime)
    {
        this.ball.pos.x += this.ball.vel.x * deltaTime;
        this.ball.pos.y += this.ball.vel.y * deltaTime;


        // Player 2 """"AI""""
        this.players[1].pos.y += this.ball.vel.y * deltaTime * 0.7; // Move the paddle at a fraction of the ball speed
    }

    collisionDetection()
    {
        // Flip velocities when the ball hits the edge
        if (this.ball.left < 0 || this.ball.right  > this._canvas.width)
        {
            const playerId = this.ball.vel.x < 0 | 0; // If travelling to the right (positive) when a wall is hit, right player has missed the ball. `| 0` converts `true` to `1` and `false` to `0`
            this.players[playerId].score++;
            this.ball.vel.x = -this.ball.vel.x;
            this.reset();
        }
        if (this.ball.top  < 0 || this.ball.bottom > this._canvas.height)
            this.ball.vel.y = -this.ball.vel.y;

        // Paddle checks
        this.players.forEach((player) => {
            // Don't allow paddles to clip edges
            if (player.top < 0)
                player.top = 0;
            if (player.bottom > this._canvas.height)
                player.bottom = this._canvas.height;

            // Paddle ball collision checks
            this.ballCollision(player, this.ball);
        });
    }

    ballCollision(player, ball)
    {
        if (player.left < ball.right  && player.right  > ball.left &&
            player.top  < ball.bottom && player.bottom > ball.top)
        {
            const len = ball.vel.len;

            ball.vel.x = (player.leftPlayer ? Math.abs(ball.vel.x) : -Math.abs(ball.vel.x));
            ball.vel.y = 300 * (Math.random() - 0.5);
            ball.vel.len = len * 1.02;
        }
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
        this.players.forEach((player) => this.drawRect(player));

        this.drawScore();
    }

    drawRect(rect)
    {
        this._context.fillStyle = "#fff";
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }

    drawScore()
    {
        const align = this._canvas.width / 3;
        const cw = this.NUM_PIXEL * 4;
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split('');
            const offset = align * (index + 1) - (cw * chars.length / 2) + this.NUM_PIXEL / 2;
            chars.forEach((char, pos) => {
                this._context.drawImage(this.NUMS[char|0], offset + pos * cw, 20);
            });
        });
    }

    reset()
    {
        this.ball.setVelocity(0, 0);
        this.ball.setPosition(this._canvas.width / 2, this._canvas.height / 2); // Center ball
        this.players[1].setPosition(this._canvas.width - 30, this._canvas.height / 2); // Reset to origin
    }

    start()
    {
        if (this.ball.vel.x === 0 && this.ball.vel.y === 0)
        {
            this.ball.setVelocity(
                300 * (Math.random() > 0.5 ? 1 : -1),
                300 * (Math.random() * 2 - 1)
            );
            this.ball.vel.len = 350; // Normalise scalar speed
        }
    }
}


//// Program start

// Get canvas
const canvas = document.getElementById("pong");

// Start game
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', (event) => {
    const scale = event.offsetY / event.target.getBoundingClientRect().height;
    pong.players[0].pos.y += ((scale * canvas.height) - pong.players[0].pos.y) * 0.3; // Limit movement speed a little
});

canvas.addEventListener('click', (event) => {
    pong.start();
});
