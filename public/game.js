// Configuración básica de Phaser
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

// Web Audio API Context
let audioCtx;
let panner;

function preload() {
    // Aquí cargaremos los sonidos más adelante
    console.log("Cargando assets de audio...");
}

function create() {
    this.add.text(400, 300, 'Echoes of the Blind', { fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);
    
    // Inicializar Web Audio API
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Configurar el PannerNode para audio 3D
    panner = audioCtx.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    
    console.log("Motor de Audio 3D iniciado.");
}

function update() {
    // Aquí actualizaremos la posición del panner basada en la posición del enemigo/jugador
}
