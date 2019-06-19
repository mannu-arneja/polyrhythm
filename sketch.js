// handle play button
window.addEventListener('load', init, false);
function init() {
  document.getElementById('play-button').addEventListener('click', () => masterPlay());
  bpm = document.getElementById('tempoSlider').value
  document.getElementById('tempoSlider').addEventListener('input', (e) => {
    part.setBPM(e.target.valueAsNumber);
    setIncrement();
    document.getElementById('tempoVal').innerHTML = bpm
  })
  document.getElementById('tempoVal').innerHTML = bpm
}

// p5 Part Loop
let osc, env; // playNote
let noise, noiseEnv; // playSnare
let part;
let currentBassNote = 47;

let prevTime = 0;

// track settings
let angle, increment, fps;
let bpm;


function preload() {
  kick = loadSound('./sounds/kick.wav');
}

function setup() {

  createCanvas(620, 480);

  // init track settings
  angle = radians(0);
  fps = 60;
  increment = 0;
  // bpm = 60;

  // prepare the osc and env used by playNote()
  env = new p5.Envelope(0.01, 0.8, 0.2, 0);
  osc = new p5.TriOsc(); // connects to master output by default
  osc.start(0);
  osc.connect();
  env.setInput(osc);


  // prepare the noise and env used by playSnare()
  noise = new p5.Noise();
  noise.amp(0.0);
  noise.start();
  noiseEnv = new p5.Env(0.01, 0.3, 0.1, 0);
  noiseEnv.setInput(noise);

  // create a part with 8 spaces, where each space represents 1/16th note (default)
  part = new p5.Part(16, 1 / 16);
  // fourthPart = new p5.Part(4, 1/8)

  // add phrases, with a name, a callback, and
  // an array of values that will be passed to the callback if > 0
  // part.addPhrase('kick', playKick, [1,0,0,0,0])
  // part.addPhrase('snare', playSnare, [1, 0, 1, 0, 1, 0, 1, 0]);
  // part.addPhrase('bass', playBass, [52, 42, 42, 42, 42, 42, 42, 42, 52, 42, 42, 42, 42, 42, 32, 42]);
  // part.addPhrase('bass', playBass, [42, 0, 0, 42, 0, 0, 42, 0]);
  // part.addPhrase('bass', playBass, [47, 42, 45, 47, 45, 42, 40, 42]);
  part.addPhrase('bass', playBass, [47, 0, 0, 0, 45, 0, 0, 0, 45, 0, 0, 0, 40, 0, 0, 0]);

  // // set tempo (Beats Per Minute) of the part and tell it to loop
  part.setBPM(bpm);
  masterVolume(1);
  part.loop();
  part.stop();
}

// resync interval functions ----------------------------------
let bassCount = 0;

function fourthCount() {
  // console.log(bassCount)
  let deg = [0,90,180,270]
  angle = radians(deg[bassCount])
  redraw();
  bassCount = (bassCount + 1) % 4;
}

let fifthTick = 0
function fifthCount() {
  console.log(fifthTick)
  let deg = [0,72,144,216,288];
  angle = radians(deg[fifthTick]);
  fifthTick = (fifthTick+1) % 5;
  redraw();
}

function playKick(time, playbackRate) {
  prevTime = time + getAudioContext().currentTime;
  kick.rate(playbackRate);
  kick.play(time);
  fifthCount();
}

function playBass(time, params) {
  
  prevTime = time + getAudioContext().currentTime;
  currentBassNote = params;
  osc.freq(midiToFreq(params), 0 , time);
  env.play(osc, time);
  fourthCount();
}

function playSnare(time, params) {
  noiseEnv.play(noise, time);
}


function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

function keyReleased() {
  if (key === ' ') masterPlay();
}

function masterPlay() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
  if (part.isPlaying) {
    part.pause();
    // console.log(getAudioContext().currentTime);
    increment = 0;
    document.getElementById('play-button').value = 'play'
  } else {
    part.start();
    // console.log(getAudioContext().currentTime); //always 0
    setIncrement();
    document.getElementById('play-button').value = 'pause'
  }
}

// calculate increment value per draw
// (degrees / (bars / bpm * seconds)) / frames) = degrees per frame
// (360 / (4 / 60 * 60)) / 60
function setIncrement() {
  increment = 0.05
  let _bpm = part.metro.bpm;
  // increment += (360 / (4 / _bpm * 60)) / 60
  increment += radians(360 / (4 / _bpm * 60))
}


function draw () {
  
  // canvas
  background(60); // rgb grey
  translate(width / 2, height / 2) // origin

  // play head
  strokeWeight(4);
  line(200, 0, 225, 0)

  // rotation settings
  frameRate(fps);
  if (part.isPlaying) {
    angle += increment / fps;
  }
  rotate(angle);

  //track settings
  stroke(0);
  strokeWeight(2);
  
  // // 1/5 note track
  fill(200, 50, 50, 255);
  let deg = [0, 72, 144, 216, 288, 360];
  arc(0, 0, 400, 400, radians(deg[0]), radians(deg[1]), PIE);
  arc(0, 0, 400, 400, radians(deg[1]), radians(deg[2]), PIE);
  arc(0, 0, 400, 400, radians(deg[2]), radians(deg[3]), PIE);
  arc(0, 0, 400, 400, radians(deg[3]), radians(deg[4]), PIE);
  arc(0, 0, 400, 400, radians(deg[4]), radians(deg[5]), PIE);

  // 1/4 note track
  fill(0, 130, 210, 255);
  arc(0, 0, 300, 300, radians(0), radians(90), PIE)
  arc(0, 0, 300, 300, radians(90), radians(180), PIE)
  arc(0, 0, 300, 300, radians(180), radians(270), PIE)
  arc(0, 0, 300, 300, radians(270), radians(360), PIE)


  // 1/3 note track
  fill(40, 130, 80, 255);
  circle(0, 0, 200, 200)
  arc(0, 0, 200, 200, radians(0), radians(120), PIE)
  arc(0, 0, 200, 200, radians(120), radians(240), PIE)
  arc(0, 0, 200, 200, radians(240), radians(360), PIE)


  fill(60);
  circle(0, 0, 100, 100);


}