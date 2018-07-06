//Get player input

document.onkeydown = function(e) {
    if (e.keyCode == '38') {
        snake.changeDirection("up");
    }
    else if (e.keyCode == '40') {
        snake.changeDirection("down");
    }
    else if (e.keyCode == '37') {
       snake.changeDirection("left");
    }
    else if (e.keyCode == '39') {
       snake.changeDirection("right");
    }
}

class Snake {
    constructor(snakeLength) {
        this.snakeLength = snakeLength;
        //Array which will contain objects with snake coordinates
        this.snakeArr = [];
        //Our food object, where the food coordinates will be stored
        this.food = {};
        this.createSnake(snakeLength);
        //The initial direction of the snake. Should be right
        this.direction = "right";
        this.lastdirection = "right";
        this.score = 0;
        //Initialize gameloop variable for the gameloop function.
        this.gameloop;
    }

    //Creates our snake array
    createSnake(snakeLength) {
        for (let i=snakeLength-1;i>=0;i--) {
            this.snakeArr.push({
                x:20*i,
                y:0
            });
        }
    }

    //Draws a snake based on the current snakeArr
    draw() {
        //Set up the canvas
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        //Clearing the canvas
        ctx.clearRect(0,0,500,500);

        for (let i=0;i<this.snakeArr.length;i++) {
            ctx.fillRect(this.snakeArr[i].x, this.snakeArr[i].y, 19,19);
        }

        //Drawing our food
        ctx.fillRect(this.food.x, this.food.y, 19, 19);

    }


    isLegal(direction) {
        if (this.lastdirection == "right" && direction == "left") {
            return false;
        } else if (this.lastdirection == "up" && direction == "down") {
            return false;
        } else if (this.lastdirection == "down" && direction == "up") {
            return false;
        } else if (this.lastdirection == "left" && direction == "right") {
            return false;
        } else {
            return true;
        }
    }

    changeDirection(direction) {
        if (this.isLegal(direction)) {
            this.direction = direction;
        }
    }

    checkForCrash() {
        const head = this.snakeArr[0];
        //Did it crash with itself?
        for (let i=1;i<this.snakeArr.length;i++) {
            if (head.x == this.snakeArr[i].x && head.y == this.snakeArr[i].y) {
                this.crash();
            }
        }

        if (head.y >= 500 || head.y < 0 || head.x >= 500 || head.x < 0) {
            this.crash();
        }

        //Eating food
        if (head.x == this.food.x && head.y == this.food.y) {
            this.snakeArr.unshift({
                x:this.snakeArr[0].x,
                y:this.snakeArr[0].y
            });
            this.createFood();
            this.updateScore();
        }
    }

    updateScore() {
        this.score += 10;
        document.getElementById("score").innerText = `Score: ${this.score}`;
    }


    crash() {
        alert("Game over! Final score: " + this.score);
        clearInterval(this.gameloop);
    }

    move() {
        if (this.direction == "right") {
            this.snakeArr.unshift({
                x:this.snakeArr[0].x + 20,
                y:this.snakeArr[0].y
            });
        } else if (this.direction == "left") {
            this.snakeArr.unshift({
                x:this.snakeArr[0].x - 20,
                y:this.snakeArr[0].y
            });
        } else if (this.direction == "up") {
            this.snakeArr.unshift({
                x:this.snakeArr[0].x,
                y:this.snakeArr[0].y - 20
            });
        } else if (this.direction == "down") {
            this.snakeArr.unshift({
                x:this.snakeArr[0].x,
                y:this.snakeArr[0].y + 20
            });
        }

        //Saves the last legal direction.
        this.lastdirection = this.direction;


        //Pop off the end and draw it again
        this.snakeArr.pop();
        this.checkForCrash()
        this.draw();
    }


    createFood() {
        //Creates random x and y number between 0 and 480 (24*20)


        let randx = Math.floor(Math.random() * Math.floor(25)) * 20;
        let randy = Math.floor(Math.random() * Math.floor(25)) * 20;

        //Check if the food collides with the snake.
        //If it does, run the function again
        for (let i=0;i<this.snakeArr.length;i++) {
            if (randx == this.snakeArr[i].x && randy == this.snakeArr[i].y) {
                this.createFood();
                return;
            }
        }

        this.food = {
            x:randx,
            y:randy
        }
    }

    gameloop() {
      //This is where the game loop lives
      //Game will start when you call this method.
      this.gameloop = setInterval(function(){
          snake.move();
      }, 200);
    }
}





//Instantiate our snake
let snake = new Snake(5);
snake.draw();
snake.createFood();
snake.gameloop();
//Game loop
