let gameScene = new Phaser.Scene('Game');

gameScene.init = function() {
    this.playerSpeed = 2;

    this.enemyMinY = 80;
    this.enemyMaxY = 280;
    this.enemyMinSpeed = 2;
    this.enemyMaxSpeed = 4;
}

gameScene.preload = function() {
    // load images
    this.load.image('background', 'assets/background.png');
    this.load.image('player',     'assets/player.png');
    this.load.image('enemy',      'assets/dragon.png');
    this.load.image('goal',       'assets/treasure.png');
};

function getRangeRandom(min, max) {
    return min * Math.random() * (max - min);
}

gameScene.create = function() {
    // create bg sprite
    let bg = this.add.sprite(0, 0, 'background');
   
    // change the origin to the top-left corner
    bg.setOrigin(0,0);
   
    // create the player
    this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');
    // we are reducing the width by 50%, and we are doubling the height
    this.player.setScale(0.5);

    // goal
    this.goal = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'goal');
    this.goal.setScale(0.6);
   
    // create an enemy
    this.enemy = this.add.sprite(120, this.sys.game.config.height / 2, 'enemy');
    this.enemy.flipX = true;
    this.enemy.setScale(0.6);

    // set enemy speed
    let dir = Math.random() < 0.5 ? 1 : -1;
    let speed = getRangeRandom(this.enemyMinSpeed, this.enemyMaxSpeed);
    this.enemy.speed = dir * speed;
};

gameScene.update = function() {
    // this.enemy1.angle += 1;
    if(this.input.activePointer.isDown) {
        // player walks
        this.player.x += this.playerSpeed;
    }

    this.enemy.y += this.enemy.speed;
    let conditionUp = this.enemy.speed < 0 && this.enemy.y <= this.enemyMinY;
    let conditionDown = this.enemy.speed > 0 && this.enemy.y >= this.enemyMaxY;
 
    // if we passed the upper or lower limit, reverse
    if (conditionUp || conditionDown) {
        this.enemy.speed *= -1;
    }

    let playerRect   = this.player.getBounds();
    let treasureRect = this.goal.getBounds();
 
    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
        console.log('reached goal!');
 
        // restart the Scene
        this.scene.restart();

        // make sure we leave this method
        return;
    }
}

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene
}

let game = new Phaser.Game(config);