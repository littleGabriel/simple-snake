//Canvas declare
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
//Config
const snakeSize = 20;
const zooSize = canvas.clientWidth/snakeSize;
const snakeHeadColor = '#212121';
const snakeBodyColor = '#494949';
const foodColor = '#B71C1C';
let direction = 'ArrowRight';
let mySnake = [[0,10],[1,10],[2,10]];
let food = [];
let snakeInterval;
let score = 0;
//Init
document.getElementById('close').onclick = ()=>{close()};
document.getElementById('playAgain').onclick = ()=>{
    location.reload();
};
(function snakeInit(snake = mySnake){
    snake.map((val,i)=>{
        if (i===snake.length-1) ctx.fillStyle = snakeHeadColor;
        else ctx.fillStyle = snakeBodyColor;
        ctx.fillRect (val[0]*snakeSize,val[1]*snakeSize, snakeSize, snakeSize);
    })
})();
foodCreate();
//keyboardListener
document.addEventListener('keydown', e => {
    let keyName = e.key;
    let correctDir = (keyName==='ArrowLeft'&&direction!=='ArrowRight') || (keyName==='ArrowRight'&&direction!=='ArrowLeft') || (keyName==='ArrowUp'&&direction!=='ArrowDown') || (keyName==='ArrowDown'&&direction!=='ArrowUp');
    if (correctDir){
        direction = keyName;
        if (snakeGo()){
            clearInterval(snakeInterval);
            snakeInterval = setInterval(snakeGo,200);
        } else dead();
    }
});
function foodCreate(snake = mySnake){
    food = [Math.floor(Math.random()*zooSize),Math.floor(Math.random()*zooSize)];
    snake.map(val => {if (food.toString()===val.toString()) foodCreate()});
    ctx.fillStyle = foodColor;
    ctx.fillRect (food[0]*snakeSize,food[1]*snakeSize, snakeSize, snakeSize);
}
function snakeGo(snake = mySnake){
    let headX = snake[snake.length-1][0], headY = snake[snake.length-1][1];
    ctx.fillStyle = snakeBodyColor;
    ctx.fillRect (headX*snakeSize,headY*snakeSize, snakeSize, snakeSize);
    ctx.fillStyle = snakeHeadColor;
    switch (direction) {
        case "ArrowLeft":
            snake.push([headX-1,headY]);
            ctx.fillRect ((headX-1)*snakeSize,headY*snakeSize, snakeSize, snakeSize);
            break;
        case "ArrowRight":
            snake.push([headX+1,headY]);
            ctx.fillRect ((headX+1)*snakeSize,headY*snakeSize, snakeSize, snakeSize);
            break;
        case "ArrowUp":
            snake.push([headX,headY-1]);
            ctx.fillRect (headX*snakeSize,(headY-1)*snakeSize, snakeSize, snakeSize);
            break;
        case "ArrowDown":
            snake.push([headX,headY+1]);
            ctx.fillRect (headX*snakeSize,(headY+1)*snakeSize, snakeSize, snakeSize);
            break;
    }
    return snakeChk();
}
function snakeChk(snake = mySnake){
    let headX = snake[snake.length-1][0];
    let headY = snake[snake.length-1][1];
    let i=0;
    //Crash Self
    snake.map(val => {if ([headX,headY].toString()===val.toString()) i++;});
    //Crash Edge
    if (headX<0||headY<0||headX>=zooSize||headY>=zooSize)i=3;
    // Food Check & Cut Tail
    if (snake[snake.length-1].toString()===food.toString()) {
        foodCreate();
        score++;
        document.getElementById('score').innerText=score.toString();
    } else {
        let tail = snake.shift();
        ctx.clearRect(tail[0]*snakeSize,tail[1]*snakeSize,snakeSize,snakeSize);
    }
    //Crash Check & Return
    if (i>=2) {
        dead();
        return false;
    }
    return true;
}
function dead() {
    clearInterval(snakeInterval);
    canvas.classList.add('blur');
    document.getElementById('playAgain').className='d-block';
}

