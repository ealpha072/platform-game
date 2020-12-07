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
  }

  update() {
    
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