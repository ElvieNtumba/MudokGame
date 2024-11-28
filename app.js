// Configuration and State Variables
let move_speed = 3, gravity = 0.5;
let game_state = 'Start';

// DOM Elements / getting eletments by class name
const bird = document.querySelector('.bird');
const img = document.getElementById('bird-1');
const background = document.querySelector('.background').getBoundingClientRect();
const score_value = document.querySelector('.score_value');
const message = document.querySelector('.message');
const score_title = document.querySelector('.score_title');

// Initial Setup 
// this is how the game will look like before the user press enter
img.style.display = 'none';
message.classList.add('messageStyle');

// Event Listener: Start or Restart Game
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        startGame();
    }
});

// Function: Start Game
function startGame() {
    // Reset Game State
    document.querySelectorAll('.pipe_sprite').forEach((pipe) => pipe.remove());
    bird.style.top = '40vh';
    score_title.innerHTML = 'Score: ';
    score_value.innerHTML = '0';
    message.innerHTML = '';
    message.classList.remove('messageStyle');
    img.style.display = 'block';
    game_state = 'Play';

    // Start Game Loops
    play();
}

// Function: Main Game Logic
function play() {
    applyGravity();
    movePipes();
    createPipes();
}

// Function: Move Pipes
function movePipes() {
    function move() {
        if (game_state !== 'Play') return;

        const pipes = document.querySelectorAll('.pipe_sprite');
        pipes.forEach((pipe) => {
            let pipe_props = pipe.getBoundingClientRect();
            let bird_props = bird.getBoundingClientRect();

            // Remove pipe if out of view
            if (pipe_props.right <= 0) {
                pipe.remove();
            } else {
                // Check for Collision
                if (
                    bird_props.left < pipe_props.left + pipe_props.width &&
                    bird_props.left + bird_props.width > pipe_props.left &&
                    bird_props.top < pipe_props.top + pipe_props.height &&
                    bird_props.top + bird_props.height > pipe_props.top
                ) {
                    endGame();
                    return;
                }

                // Update Score
                if (
                    pipe_props.right < bird_props.left &&
                    pipe_props.right + move_speed >= bird_props.left &&
                    pipe.increase_score === '1'
                ) {
                    score_value.innerHTML = parseInt(score_value.innerHTML) + 1;
                    pipe.increase_score = '0';
                }

                // Move Pipe
                pipe.style.left = pipe_props.left - move_speed + 'px';
            }
        });

        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);
}

// Function: Apply Gravity
function applyGravity() {
    let bird_dy = 0;

    function gravityEffect() {
        if (game_state !== 'Play') return;

        bird_dy += gravity;

        // Bird Flap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === ' ') {
                img.src = 'images/bird-2.png';
                bird_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowUp' || e.key === ' ') {
                img.src = 'images/bird.png';
            }
        });

        // Check Boundaries
        let bird_props = bird.getBoundingClientRect();
        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            endGame();
            return;
        }

        // Move Bird
        bird.style.top = bird_props.top + bird_dy + 'px';
        requestAnimationFrame(gravityEffect);
    }
    requestAnimationFrame(gravityEffect);
}

// Function: Create Pipes
function createPipes() {
    let pipe_separation = 0;
    const pipe_gap = 35;

    function spawnPipe() {
        if (game_state !== 'Play') return;

        if (pipe_separation > 115) {
            pipe_separation = 0;
            const pipe_pos = Math.floor(Math.random() * 43) + 8;

            // Create Top Pipe
            const pipe_top = document.createElement('div');
            pipe_top.className = 'pipe_sprite';
            pipe_top.style.top = `${pipe_pos - 70}vh`;
            pipe_top.style.left = '100vw';
            document.body.appendChild(pipe_top);

            // Create Bottom Pipe
            const pipe_bottom = document.createElement('div');
            pipe_bottom.className = 'pipe_sprite';
            pipe_bottom.style.top = `${pipe_pos + pipe_gap}vh`;
            pipe_bottom.style.left = '100vw';
            pipe_bottom.increase_score = '1';
            document.body.appendChild(pipe_bottom);
        }

        pipe_separation++;
        requestAnimationFrame(spawnPipe);
    }
    requestAnimationFrame(spawnPipe);
}

// Function: End Game
function endGame() {
    game_state = 'End';
    message.innerHTML = '<span style="color: red;">Game Over</span><br>Press Enter To Restart';
    message.classList.add('messageStyle');
    img.style.display = 'none';
}
