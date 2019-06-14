window.addEventListener('load', init, false);
function init() {

  // init part state
  // part.isPlaying = false;

  //resume from suspension - no autoplay default
  document.getElementById('play-button').addEventListener('click', () => {
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    }
    if (part.isPlaying) {
      part.pause();
      document.getElementById('play-button').value = 'play'
    } else {
      part.start();
      document.getElementById('play-button').value = 'pause'
    }
  });



}



let osc, env; // used by playNote
let noise, noiseEnv; // used by playSnare
let part; // a part we will loop
let currentBassNote = 47;

let prevTime = 0;

function setup() {

  createCanvas(620, 480);

  // prepare the osc and env used by playNote()
  env = new p5.Envelope(0.01, 0.8, 0.2, 0);
  osc = new p5.TriOsc(); // connects to master output by default
  osc.start(0);
  osc.connect();
  env.setInput(osc);


  // prepare the noise and env used by playSnare()
  noise = new p5.Noise();
  // noise.amp(0.0);
  noise.start();
  noiseEnv = new p5.Env(0.01, 0.5, 0.1, 0);
  noiseEnv.setInput(noise);

  // create a part with 8 spaces, where each space represents 1/16th note (default)
  part = new p5.Part(8, 1 / 16);

  // add phrases, with a name, a callback, and
  // an array of values that will be passed to the callback if > 0
  part.addPhrase('snare', playSnare, [0, 0, 1, 0, 0, 0, 1, 1]);
  part.addPhrase('bass', playBass, [47, 42, 45, 47, 45, 42, 40, 42]);

  // // set tempo (Beats Per Minute) of the part and tell it to loop
  part.setBPM(60);
  part.loop();
  part.stop();

}

// function mouseClicked() {
//   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
//     part.pause();
//   }
// }

function playBass(time, params) {
  prevTime = time + getAudioContext().currentTime;

  currentBassNote = params;
  osc.freq(midiToFreq(params), 0 , time);
  env.play(osc, time);
}


function playSnare(time, params) {
  noiseEnv.play(noise, time);
}

// draw a ball mapped to current note height
// function draw() {
//   background(255);
//   fill(255, 0, 0);
//   var noteHeight = map(currentBassNote, 40, 50, height, 0);
//   ellipse(width / 2, noteHeight, 30, 30);
// }

// function touchStarted() {
  // if (getAudioContext().state !== 'running') {
  //   getAudioContext().resume();
  // }
  // part.start();
// }

// rotating sequencer
let angle = 0.0
let increment = 0

function draw () {
  background(51);
  noStroke();
  fill(255);
  ellipseMode(CENTER);

  increment += radians(1)

  translate(width/2, height/2);
  rotate(increment);
  ellipse(0, 0, 180, 180)

}