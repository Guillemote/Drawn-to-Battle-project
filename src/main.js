import { Start } from './scenes/start.js';
//import { GameOver } from './scenes/GameOver.js';

const config = {
    type: Phaser.AUTO,
    title: 'Drawn to Battle',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#b4e2fdff',
    pixelArt: false,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 200 },
        }
    },
    scene: [
        Start//, GameOver
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            