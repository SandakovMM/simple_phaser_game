let gameScene = new Phaser.Scene('Game');

gameScene.init = function() {
    this.playerSpeed = 2;
}

gameScene.preload = function() {
    // load images
    this.load.image('background', 'assets/background.png');
    this.load.image('player',     'assets/player.png');
    this.load.image('enemy',      'assets/dragon.png');
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
}

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene
}

let game = new Phaser.Game(config);