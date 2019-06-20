let gameScene = new Phaser.Scene('Game');

gameScene.preload = function() {
    // load images
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
};

gameScene.create = function() {
    // create bg sprite
    let bg = this.add.sprite(0, 0, 'background');
   
    // change the origin to the top-left corner
    //bg.setOrigin(0,0);
   
    // place sprite in the center
    bg.setPosition(640/2, 360/2);
   
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;
   
    console.log(gameW, gameH);
   
    console.log(bg);
    console.log(this);
};

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene
}

let game = new Phaser.Game(config);