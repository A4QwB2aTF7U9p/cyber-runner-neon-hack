const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game',
        width: '100%',
        height: '100%'
    },
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {}

function create() {
    this.add.text(this.scale.width/2, this.scale.height/2, 'Juego Móvil Iniciado', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
}

function update() {}
