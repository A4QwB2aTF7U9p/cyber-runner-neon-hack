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

let audioCtx;
let panner;

function preload() {
    console.log("Cargando assets de audio...");
}

function create() {
    this.add.text(400, 300, 'Click para sonido 3D', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
    
    // Inicializar Web Audio API
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Configurar el PannerNode
    panner = audioCtx.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    
    // Evento para activar sonido
    this.input.on('pointerdown', (pointer) => {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        playSound(pointer.x, pointer.y);
    });
}

function playSound(x, y) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    
    // Posicionar el sonido en el espacio basado en donde haces clic
    const pan = (x / 800) * 2 - 1; // mapea 0-800 a -1 a 1
    panner.positionX.setValueAtTime(pan, audioCtx.currentTime);
    
    oscillator.connect(panner);
    panner.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
}

function update() {}
