// handle play button
window.addEventListener('load', init, false);
function init() {
  document.getElementById('play-button').addEventListener('click', () => masterPlay());
  bpm = document.getElementById('tempoSlider').value
  document.getElementById('tempoSlider').addEventListener('input', (e) => {
    part.setBPM(e.target.valueAsNumber);
    setIncrement();
  })
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
  part = new p5.Part(8, 1 / 4);
  // fourthPart = new p5.Part(4, 1/8)

  // add phrases, with a name, a callback, and
  // an array of values that will be passed to the callback if > 0
  // part.addPhrase('kick', playKick, [1,0,0])
  part.addPhrase('snare', playSnare, [1, 0, 1, 0, 1, 0, 1, 0]);
  // part.addPhrase('bass', playBass, [52, 42, 42, 42, 42, 42, 42, 42, 52, 42, 42, 42, 42, 42, 32, 42]);
  // part.addPhrase('bass', playBass, [42, 0, 0, 42, 0, 0, 42, 0]);
  part.addPhrase('bass', playBass, [47, 42, 45, 47, 45, 42, 40, 42]);
  // part.addPhrase('bass', playBass, [47, 0, 0, 0, 45, 0, 0, 0, 45, 0, 0, 0, 40, 0, 0, 0]);

  // // set tempo (Beats Per Minute) of the part and tell it to loop
  part.setBPM(bpm);
  masterVolume(1);

  part.loop();
  part.stop();
}

// function mouseClicked() {
//   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
//     part.pause();
//   }
// }

// counter
let bassCount = 0;

function fourthCount() {
  console.log(bassCount)

  switch (bassCount) {
    case 0:
      angle = radians(0)
      break;
    case 1:
      angle = radians(90)
      break;
    case 2:
      angle = radians(180)
      break;
    case 3:
      angle = radians(270)
      break;
    default:
      break;
  }
  bassCount = (bassCount + 1) % 4;
}

function playKick(time, playbackRate) {
  kick.rate(playbackRate);
  kick.play(time);
}

function playBass(time, params) {
  prevTime = time + getAudioContext().currentTime;

  fourthCount();

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
  increment = 0.07
  let _bpm = part.metro.bpm;
  // increment += (360 / (4 / _bpm * 60)) / 60
  increment += radians(360 / (4 / _bpm * 60))

  // console.log(increment)
}



function draw () {


  background(60);


  // origin
  translate(width / 2, height / 2)

  // play head
  line(125, 0, 140, 0)
  
  // rotation settings --need adjustment
  frameRate(fps);
  if (part.isPlaying) {
    angle += increment / fps;
  }
  rotate(angle);

  
  // if (getAudioContext().currentTime % 1 < 0.005) {
  //   angle = radians(0);
  // }

  //track settings
  stroke(0);
  strokeWeight(2);
  fill(0, 130, 210, 255);


  // 1/4 note track
  arc(0, 0, 250, 250, radians(0), radians(90), PIE)
  arc(0, 0, 250, 250, radians(90), radians(180), PIE)
  arc(0, 0, 250, 250, radians(180), radians(270), PIE)
  arc(0, 0, 250, 250, radians(270), radians(360), PIE)


  fill(40, 130, 80, 255);
  circle(0, 0, 200, 200)
  // 1/3 note track
  arc(0, 0, 200, 200, radians(0), radians(120), PIE)
  arc(0, 0, 200, 200, radians(120), radians(240), PIE)
  arc(0, 0, 200, 200, radians(240), radians(360), PIE)


  fill(60);
  circle(0, 0, 100, 100);


}