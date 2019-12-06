let gameScene = new Phaser.Scene('Game');

gameScene.init = function() {
    this.playerSpeed = 2;

    this.enemyMinY = 80;
    this.enemyMaxY = 280;
    this.enemyMinSpeed = 1;
    this.enemyMaxSpeed = 3;

    this.isTerminating = false;
}

gameScene.preload = function() {
    // load images
    this.load.image('background', 'assets/background.png');
    this.load.image('player',     'assets/player.png');

    this.load.spritesheet('goal',           'assets/treasure_animated.png',
                          { frameWidth: 75, frameHeight: 63 });
    this.load.spritesheet('enemy_animated', 'assets/dragon_animated.png',
                          { frameWidth: 70, frameHeight: 70 });
};

function getRangeRandom(min, max) {
    return min + Math.random() * (max - min);
}

function create_goal(scene)
{
    scene.goal = scene.add.sprite(scene.sys.game.config.width - 80,
                                  scene.sys.game.config.height / 2,
                                  'goal');
    scene.goal.setScale(0.6);
    scene.anims.create({
        key: 'shine',
        frames: scene.anims.generateFrameNumbers('goal',
                                    { start: 0, end: 4 }),
        frameRate: 2,
        repeat: -1
    });
    scene.goal.anims.play('shine', true);
}

function create_enemies(scene)
{
    scene.enemies = scene.add.group({
        key: 'enemy_animated',
        repeat: 5,
        setXY: {
            x: 90,
            y: 100,
            stepX: 85,
            stepY: 20
        }
    })

    scene.anims.create({
        key: 'walk',
        frames: scene.anims.generateFrameNumbers('enemy_animated', { start: 0, end: 16 }),
        frameRate: 7,
        repeat: -1
    });

    Phaser.Actions.ScaleXY(scene.enemies.getChildren(), -0.4, -0.4)
    Phaser.Actions.Call(scene.enemies.getChildren(), function(enemy) {
        enemy.flipX = true;

        let dir = Math.random() < 0.5 ? 1 : -1;
        let speed = getRangeRandom(scene.enemyMinSpeed, scene.enemyMaxSpeed);
        enemy.speed = dir * speed;

        enemy.anims.play('walk', true);
    }, scene);
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

    create_goal(this);
    create_enemies(this);
};

gameScene.update = function() {
    if (this.isTerminating)
        return;

    if(this.input.activePointer.isDown) {
        // player walks
        this.player.x += this.playerSpeed;
    }

    let playerRect = this.player.getBounds();
    let treasureRect = this.goal.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
        console.log('reached goal!');
        this.isTerminating = true;
 
        this.cameras.main.flash(500);
        this.cameras.main.on('cameraflashcomplete', function(camera, effect) {
            this.scene.restart();
        }, this);

        // make sure we leave this method
        return;
    }

    function update_enamy_position(enemy, map)
    {
        enemy.y += enemy.speed;
        let conditionUp = enemy.speed < 0 && enemy.y <= map.enemyMinY;
        let conditionDown = enemy.speed > 0 && enemy.y >= map.enemyMaxY;

        // if we passed the upper or lower limit, reverse
        if (conditionUp || conditionDown) {
            enemy.speed *= -1;
        }
    }

    // Enamy calculation
    Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
        update_enamy_position(enemy, this);

        let enemyRect  = enemy.getBounds();
        enemyRect.x += 2;
        enemyRect.y += 2;
        enemyRect.width -= 4;
        enemyRect.height -= 4;
        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
            return this.gameOver();
        }

    }, this);
}

gameScene.gameOver = function() {
    console.log('Game over!');

    this.isTerminating = true;

    this.cameras.main.shake(500);
    this.cameras.main.on('camerashakecomplete', function(camera, effect) {
        this.cameras.main.fade(500);
    }, this);

    this.cameras.main.on('camerafadeoutcomplete', function(camera, effect) {
        this.scene.restart();
    }, this);

    // make sure we leave this method
    return;
}

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene,
}

let game = new Phaser.Game(config);