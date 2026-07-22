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
let player, enemy, cursors, score = 0, scoreText, gameOver = false;

function preload() {}

function create() {
    this.add.text(400, 30, 'Cyber-Runner: Neon Hack', { fontSize: '32px', fill: '#ff00ff' }).setOrigin(0.5);
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#00ffff' });

    player = this.add.rectangle(100, 300, 32, 32, 0x00ffff);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);

    enemy = this.add.rectangle(800, 300, 32, 32, 0xff00ff);
    this.physics.add.existing(enemy);
    enemy.body.setVelocityX(-300);

    this.physics.add.collider(player, enemy, hitEnemy, null, this);
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (gameOver) return;

    player.body.setVelocity(0);
    if (cursors.left.isDown) player.body.setVelocityX(-200);
    else if (cursors.right.isDown) player.body.setVelocityX(200);
    if (cursors.up.isDown) player.body.setVelocityY(-200);
    else if (cursors.down.isDown) player.body.setVelocityY(200);

    if (enemy.x < 0) {
        enemy.x = 800;
        enemy.y = Phaser.Math.Between(50, 550);
        score += 10;
        scoreText.setText('Score: ' + score);
    }
}

function hitEnemy() {
    gameOver = true;
    this.add.text(400, 300, 'GAME OVER', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5);
    this.physics.pause();
    this.time.delayedCall(2000, () => location.reload());
}
