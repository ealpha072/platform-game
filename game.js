const gameState = {
  score:0
}

class GameScene extends Phaser.scene {
  constructor(){
    super({key:'GameScene'})
  } 
  
  upload(){
    this.load.image('cave', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/cave_background.png');
    this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/platform.png');
    // Loads exit sprite sheet 
    this.load.spritesheet('exit', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/cave_exit.png', { frameWidth: 60, frameHeight: 70 });
    this.load.spritesheet('snowman', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/snowman.png', { frameWidth: 50, frameHeight: 70 });
    this.load.spritesheet('codey','https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/codey_sprite.png',{frameWidth:72,frameHeight:90})
  }
  create() {
    // gameState.active is true if the game is playble (not game over)
    gameState.active = true;

    // Creates the background image
    this.add.image(0, 0, 'cave').setOrigin(0, 0);

    // Creates platforms group
    const platforms = this.physics.add.staticGroup();
    // An array of platform positions that is iterated over to create the platforms 
    const platPositions = [
      { x: 50, y: 575 }, { x: 250, y: 575 }, { x: 450, y: 575 }, { x: 400, y: 380 }, { x: 100, y: 200 },
    ];
    platPositions.forEach(plat => {
      platforms.create(plat.x, plat.y, 'platform');
    });  
    //creating codey and movements
    gameState.player  =this.physics.add.sprite(200,500,'codey');
    this.anims.create({
      key:'run',
      frames:this.anims.generateFrameNumbers('codey',{
        start:0,end:3
      }),
      frameRate:5,
      repeat:-1

    })
    this.anims.create({
      key:'idle',
      frames: this.anims.generateFrameNumbers('codey',{start:4,end:5}),
      frameRate:5,
      repeat:-1
    })
    gameState.cursors = this.input.keyboard.createCursorKeys()  
    gameState.enemy = this.physics.add.sprite(225,500, 'snowman')
    this.anims.create({
      key:'snowmanAlert',
      frames: this.anims.generateFrameNumbers('snowman',{start:0,end:3}),
      frameRate:4,
      repeat:-1
    })
    gameState.enemy.anims.play('snowmanAlert',true)
    this.physics.add.overlap(gameState.player,gameState.enemy,()=>{
      this.add.text(150, 50, '      Game Over...\n  Click to play again.', { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
      this.physics.pause();
      gameState.active = false;
      this.anims.pauseAll();
      this.input.on('pointerup',()=>{
        this.scene.restart();
      })
    })
    gameState.exit = this.physics.add.sprite(50,142,'exit');
    this.anims.create({
      key:'glow',
      frames:this.anims.generateFrameNumbers('exit',{start:0,end:4}),
      frameRate:4,
      repeat:-1
    })
    this.physics.add.collider(gameState.exit,gameState.platforms)
    gameState.exit.anims.play('glow',true);

    //win condition
    this.physics.add.overlap(gameState.player,gameState.exit,()=>{
      this.add.text(150, 50, 'You reached the exit!\n  Click to play again.', { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
      this.physics.pause();
      gameState.active = false;
      this.anims.pauseAll()
      gameState.enemy.move.stop();
      this.input.on('pointerup',()=>{
        this.anims.resumeAll();
        this.scene.restart()
      })
    })
    //creating tweens 
    gameState.enemy.move = this.tweens.add({
      targets: gameState.enemy,
      x: 320,
      ease: 'Linear',
      duration: 1800,
      repeat: -1,
      yoyo: true,
      //onRepeat:growSnowman
    });
    
  }

  update() {
    if(gameState.active){
      if(gameState.cursors.right.isDown){
        gameState.player.setVelocityX(350)
        gameState.player.anims.play('run',true);

        gameState.player.flipX = false;
      }else if (gameState.cursors.left.isDown) {
        gameState.player.setVelocityX(-350);
        gameState.player.anims.play('run', true);
        
				gameState.player.flipX = true;
        
      } else {
        gameState.player.setVelocityX(0);
        // Plays the idle animation if no arrow keys are pressed
        gameState.player.anims.play('idle', true);
      }
    }
    
  }
}

const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1500 },
      enableBody: true,
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config)