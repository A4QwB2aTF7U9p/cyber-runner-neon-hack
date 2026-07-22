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
        arcade: { gravity: { y: 800 }, debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player, platforms, cursors;

function preload() {}

function create() {
    this.add.text(this.scale.width/2, 50, 'Usa Flechas/WASD para moverte y saltar', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);

    // Plataformas (dibujadas como rectángulos para que sean visibles)
    platforms = this.physics.add.staticGroup();
    let ground = this.add.rectangle(this.scale.width/2, this.scale.height - 25, this.scale.width, 50, 0x333333);
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    // Jugador
    player = this.add.rectangle(this.scale.width/2, this.scale.height - 150, 32, 48, 0x00ffff);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    player.body.setVelocityX(0);
    if (cursors.left.isDown) player.body.setVelocityX(-200);
    else if (cursors.right.isDown) player.body.setVelocityX(200);

    if (cursors.up.isDown && player.body.touching.down) {
        player.body.setVelocityY(-500);
    }
}
