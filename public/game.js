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
let player, enemies, cursors, score = 0, scoreText, levelText, gameOver = false;
let currentLevel = 1;
let speed = 300;

function preload() {}

function create() {
    this.add.text(this.scale.width/2, 30, 'Echoes of the Blind', { fontSize: '32px', fill: '#ff00ff' }).setOrigin(0.5);
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#00ffff' });
    levelText = this.add.text(16, 50, 'World: 1', { fontSize: '24px', fill: '#ffffff' });

    player = this.add.rectangle(100, 300, 32, 48, 0x00ffff);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);

    // Suelo
    let ground = this.add.rectangle(this.scale.width/2, this.scale.height - 25, this.scale.width, 50, 0x333333);
    this.physics.add.existing(ground, true);
    this.physics.add.collider(player, ground);

    enemies = this.physics.add.group();
    
    // Crear enemigos iniciales
    spawnEnemies(this);

    this.physics.add.collider(player, enemies, hitEnemy, null, this);
    cursors = this.input.keyboard.createCursorKeys();
}

function spawnEnemies(scene) {
    enemies.clear(true, true);
    for(let i = 0; i < currentLevel + 1; i++) {
        let enemy = scene.add.rectangle(800 + (i * 300), Phaser.Math.Between(100, 500), 32, 32, 0xff00ff);
        scene.physics.add.existing(enemy);
        enemy.body.setVelocityX(-(speed + (currentLevel * 50)));
        enemies.add(enemy);
    }
}

function update() {
    if (gameOver) return;

    player.body.setVelocityX(0);
    if (cursors.left.isDown) player.body.setVelocityX(-200);
    else if (cursors.right.isDown) player.body.setVelocityX(200);
    if (cursors.up.isDown && player.body.touching.down) player.body.setVelocityY(-500);

    enemies.children.iterate(function (enemy) {
        if (enemy.x < 0) {
            enemy.x = 800;
            enemy.y = Phaser.Math.Between(100, 500);
            score += 10;
            scoreText.setText('Score: ' + score);
            
            // Subir de nivel cada 100 puntos
            if (score > 0 && score % 100 === 0) {
                currentLevel++;
                levelText.setText('World: ' + currentLevel);
                spawnEnemies(this.scene);
            }
        }
    }, this);
}

function hitEnemy() {
    gameOver = true;
    this.add.text(400, 300, 'GAME OVER\nClick para reiniciar', { fontSize: '48px', fill: '#ff0000', align: 'center' }).setOrigin(0.5);
    this.physics.pause();
    this.input.on('pointerdown', () => location.reload());
}
