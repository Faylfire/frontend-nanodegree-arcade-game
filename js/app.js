//Game State Object

var GameState = function(topScore = [100,85,5]){
    var stateArray = ["Selection", "Win", "Loss", "Play", "Top Score"]

    this.state = 0;
    this.score = 0;
    this.topScore = topScore;

};

function compareNumbers(a,b){
    return a - b;
}

GameState.prototype.update = function() {
    //this.state = state;
    if (this.state === 2){
        this.topScore.push(this.score);
        this.topScore.sort(compareNumbers);
        this.topScore.reverse();
        this.topScore = this.topScore.slice(0,3);
    }
};


//Coins object constructor

var BonusObjects = function(x, y, points){
    this.BonusImages = [
                'images/Gem Blue.png',   // 1st char
                'images/Gem Green.png',   // Row 1 of 3 of stone
                'images/Gem Orange.png',   // Row 2 of 3 of stone
                'images/Key.png',   // Row 3 of 3 of stone
                'images/Heart.png',
                'images/Star.png'  // 5th char right-most
            ]


    this.x = x;
    this.y = y;
    this.points = points;
    this.show = 1;
    this.sprite = this.BonusImages[5];
}

BonusObjects.prototype.update = function(){
    this.show = 0;
};

BonusObjects.prototype.render = function(){
    if (this.show === 1) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

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


var Player = function(chosen = 0){
    this.avatarImages = [
                'images/char-boy.png',   // 1st char
                'images/char-cat-girl.png',   // Row 1 of 3 of stone
                'images/char-horn-girl.png',   // Row 2 of 3 of stone
                'images/char-pink-girl.png',   // Row 3 of 3 of stone
                'images/char-princess-girl.png'   // 5th char right-most
            ]

    this.sprite = this.avatarImages[chosen];
    this.x = 101*2;
    this.y = 83*5-20;
};

Player.prototype.update = function(xChange, yChange, avatar) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (xChange || yChange){

        if (this.x+xChange <= 101*4 && this.x+xChange >= 0){
            this.x += xChange;
        }
        if (this.y+yChange <= 83*5 && this.y+yChange >= -20){
            this.y += yChange;
        }
    }
    if (avatar){
        this.sprite = this.avatarImages[avatar];
    }
};

Player.prototype.resetPosition = function(){
    this.x = 101*2;
    this.y = 83*5-20;
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

//This is the object of the movable selection box for character selection

var SelectionBox = function(){
    this.x = 101*2;
    this.y = 83*5-45;
    this.character = 0;
    this.chosen = false;
    this.colorCount = 0;
    this.color = 'orangered';
};

SelectionBox.prototype.render = function() {
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.strokeRect(this.x, this.y, 101, 90);
};

SelectionBox.prototype.resetPosition = function(){
    this.x = 101*2;
    this.y = 83*5-45;
    this.chosen = false;
};

SelectionBox.prototype.update = function(xChange) {
    if (this.x+xChange >= 0 && this.x+xChange <=101*4){
        this.x += xChange;
    }
};

SelectionBox.prototype.changeColor = function(){
    var colors = ["orangered", "tomato", "coral", "darkorange", "orange",
                  "darkorange", "coral", "tomato"];

    this.color = colors[Math.floor(this.colorCount/15)];
    if (this.colorCount+1 < 70){
        this.colorCount++;
    } else{
        this.colorCount = 0;
    }
}

SelectionBox.prototype.handleInput = function(direction){
    var dx = 101;


    switch(direction){
        case 'left':
            this.update(-dx,0);
            break;
        case 'right':
            this.update(dx,0);
            break;
        case 'enter':
            this.character = this.x/101;
            //console.log("before: "+this.chosen + this.character);
            this.chosen = true;
            //console.log("after: "+ this.chosen + this.character);
            //gameState.state = 3;
            break;
        default:
            /* ... */
    }

};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player;
var allEnemies = [];
var allBonus = [];
//var avatarChosen = 0;
var selection;
var gameState;

gameState = new GameState();
player = new Player();
selection = new SelectionBox();

function resetPlayObjects(){
    chooseAvatar = 1;
    selection.resetPosition();
    player.resetPosition();
    allEnemies = [];
    allBonus = [];
    for (i=0; i < 5; i++){
        allEnemies.push(new Enemy(randomStart(-500)+200,(i%3+1)*83-20,randomSpeed(45)));
        allBonus.push(new BonusObjects(randomStart(400),(i%3+1)*83-20, 5));
    }
    allEnemies.push(new Enemy(randomStart(-300), 1*83-20,randomSpeed(75)));
    allEnemies.push(new Enemy(randomStart(-500), 2*83-20,randomSpeed(60)));



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
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter',
    };

    console.log(gameState.state);
    if (gameState.state === 0){
        console.log("selection: "+ allowedKeys[e.keyCode]);
        selection.handleInput(allowedKeys[e.keyCode]);

    } else if (gameState.state === 3) {
        player.handleInput(allowedKeys[e.keyCode]);
    }


});
