// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed*dt;

    if (this.x > 101*5){
        this.x = -101;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var Player = function(){
    this.sprite = 'images/char-cat-girl.png';
    this.x = 101*2;
    this.y = 83*5;
};

Player.prototype.update = function(xChange, yChange) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (xChange || yChange){

        if (this.x+xChange <= 101*4 && this.x+xChange >= 0){
            this.x += xChange;
        }
        if (this.y+yChange <= 83*5 && this.y+yChange >= 0){
            this.y += yChange;
        }
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction){
    var dy = 83;
    var dx = 10*3;
    switch(direction){
        case 'left':
            this.update(-dx,0);
            break;
        case 'right':
            this.update(dx,0);
            break;
        case 'up':
            this.update(0,-dy);
            break;
        case 'down':
            this.update(0,dy);
            break;
        default:
            /* ... */
    }

};

var player;
var allEnemies = [];

function resetPlayObjects(){
    player = new Player();
    allEnemies = [];
    for (i=0; i < 5; i++){
        allEnemies.push(new Enemy(randomStart(-500)+200,(i%3+1)*83,randomSpeed(45)));
    }
    allEnemies.push(new Enemy(randomStart(-300), 1*83,randomSpeed(75)));
    allEnemies.push(new Enemy(randomStart(-500), 2*83,randomSpeed(60)));

}

function randomSpeed(factor){
    return factor*randomStart(4);
}

function randomStart(range){
    return (Math.floor((Math.random()*range)+1));
}

//resetPlayObjects();




// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
