const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Aquí cargarás tus sprites (assets/sprites/...)
    console.log("Cargando assets...");
}

function create() {
    // Fondo de pantalla o mensaje de bienvenida
    this.add.text(400, 300, 'Cyber-Runner: Neon Hack', {
        fontSize: '48px',
        fill: '#ff00ff'
    }).setOrigin(0.5);
    
    console.log("Juego iniciado");
}

function update() {
    // Lógica del juego
}
