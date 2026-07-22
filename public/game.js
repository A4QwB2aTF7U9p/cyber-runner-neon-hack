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
let player;

function preload() {}

function create() {
    this.add.text(this.scale.width/2, 50, 'Toca la pantalla para moverte', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
    
    player = this.add.rectangle(this.scale.width/2, this.scale.height/2, 50, 50, 0x00ffff);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);

    this.input.on('pointerdown', (pointer) => {
        this.physics.moveToObject(player, pointer, 500);
    });
}

function update() {
    // Si el jugador está muy cerca del objetivo, detenerlo
    if (player.body.speed > 0) {
        const distance = Phaser.Math.Distance.Between(player.x, player.y, player.body.x + player.body.width/2, player.body.y + player.body.height/2);
        if (distance < 10) {
            player.body.reset(player.x, player.y);
        }
    }
}
