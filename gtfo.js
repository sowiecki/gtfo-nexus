const five = require('johnny-five');
const Particle = require('particle-io');
const temporal = require('temporal');
// const Pixel = require('node-pixel');

const PHOTON_PINS = require('./constants').PHOTON_PINS;
const IN = require('./constants').IN;
const OUT = require('./constants').OUT;
const RED = require('./constants').RED;
const PURPLE = require('./constants').PURPLE;

const devices = JSON.parse(require('fs').readFileSync('./devices.json', 'utf8'));

// TODO integrate multiple boards

const board = new five.Board({
  io: new Particle({
    token: devices[0].accessToken,
    deviceId: devices[0].id
  })
});

board.on('ready', () => {
  console.log(`Connected to ${board.id}`);

  const led = new five.Led.RGB({
    pins: PHOTON_PINS
  });

  led.color(RED);

  let intensity = 100;
  let fadeDirection = IN;

  temporal.loop(6, () => {
    switch (intensity) {
      case 0:
        fadeDirection = IN;
        break;
      case 100:
        fadeDirection = OUT;
        break;
    }

    switch (fadeDirection) {
      case IN:
        intensity += 1;
        break;
      case OUT:
        intensity -= 1;
        break;
    }
    console.log(`intensity: ${intensity} \n fadeDirection: ${fadeDirection}`)
    led.intensity(intensity);
  });

  board.repl.inject({
    led
  });
});
