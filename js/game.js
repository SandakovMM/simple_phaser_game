let gameScene = new Phaser.Scene('Game');

gameScene.init = function() {
    this.playerSpeed = 2;
}

gameScene.preload = function() {
    // load images
    this.load.image('background', 'assets/background.png');
    this.load.image('player',     'assets/player.png');
    this.load.image('enemy',      'assets/dragon.png');
    this.load.image('goal',       'assets/treasure.png');
};

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
    // this.enemy1 = this.add.sprite(250, 180, 'enemy');
    
    // this.enemy1.angle = -45;
};

gameScene.update = function() {
    // this.enemy1.angle += 1;
    if(this.input.activePointer.isDown) {
        // player walks
        this.player.x += this.playerSpeed;
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