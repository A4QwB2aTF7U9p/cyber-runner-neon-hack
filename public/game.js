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
let player, enemies, cursors, score = 0, scoreText, gameOver = false, speed = 300;

function preload() {}

function create() {
    this.add.text(400, 30, 'Cyber-Runner: NEON HACK', { fontSize: '32px', fill: '#ff00ff' }).setOrigin(0.5);
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#00ffff' });

    player = this.add.rectangle(100, 300, 32, 32, 0x00ffff);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);

    enemies = this.physics.add.group();
    
    // Crear enemigos iniciales
    for(let i = 0; i < 2; i++) {
        let enemy = this.add.rectangle(800 + (i * 400), Phaser.Math.Between(50, 550), 32, 32, 0xff00ff);
        this.physics.add.existing(enemy);
        enemy.body.setVelocityX(-speed);
        enemies.add(enemy);
    }

    this.physics.add.collider(player, enemies, hitEnemy, null, this);
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (gameOver) return;

    player.body.setVelocity(0);
    if (cursors.left.isDown) player.body.setVelocityX(-300);
    else if (cursors.right.isDown) player.body.setVelocityX(300);
    if (cursors.up.isDown) player.body.setVelocityY(-300);
    else if (cursors.down.isDown) player.body.setVelocityY(300);

    enemies.children.iterate(function (enemy) {
        if (enemy.x < 0) {
            enemy.x = 800;
            enemy.y = Phaser.Math.Between(50, 550);
            score += 10;
            scoreText.setText('Score: ' + score);
            // Dificultad progresiva: aumenta velocidad cada 100 puntos
            if (score % 100 === 0) speed += 50;
            enemy.body.setVelocityX(-speed);
        }
    });
}

function hitEnemy() {
    gameOver = true;
    this.add.text(400, 300, 'GAME OVER\nClick para reiniciar', { fontSize: '48px', fill: '#ff0000', align: 'center' }).setOrigin(0.5);
    this.physics.pause();
    this.input.on('pointerdown', () => location.reload());
}
