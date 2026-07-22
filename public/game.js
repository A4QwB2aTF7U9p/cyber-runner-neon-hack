const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
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
let cursors;

function preload() {}

function create() {
    this.add.text(400, 50, 'Cyber-Runner: Neon Hack', { fontSize: '32px', fill: '#ff00ff' }).setOrigin(0.5);
    
    player = this.add.rectangle(400, 300, 32, 32, 0x00ffff);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    player.body.setVelocity(0);
    if (cursors.left.isDown) player.body.setVelocityX(-200);
    else if (cursors.right.isDown) player.body.setVelocityX(200);
    
    if (cursors.up.isDown) player.body.setVelocityY(-200);
    else if (cursors.down.isDown) player.body.setVelocityY(200);
}
