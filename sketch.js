// handle play button
window.addEventListener('load', init, false);
function init() {
  document.getElementById('play-button').addEventListener('click', () => masterPlay());
  bpm = document.getElementById('tempoSlider').value
  document.getElementById('tempoSlider').addEventListener('mouseup', (e) => {
    bpm = e.target.valueAsNumber;
    looper4n.bpm = bpm
    looper3n.bpm = bpm
    // part.setBPM(bpm);
    // fifthPart.setBPM(bpm);
    setIncrement();
    document.getElementById('tempoVal').innerHTML = bpm
  })
  document.getElementById('tempoVal').innerHTML = bpm
}

// p5 Part Loop
let osc, env; // playNote
let noise, noiseEnv; // playSnare
let part, fifthPart;
let startTime, timeDelta, revDelta;
let currentBassNote = 47;

let prevTime = 0;

// track settings
let angle, increment, fps;
let bpm;

// p5 SoundFile Obj
let kick, hat, snare, tamb, stick;

function preload() {
  kick = loadSound('./sounds/kick.wav');
  hat = loadSound('./sounds/chh.wav');
  snare = loadSound('./sounds/snare.wav');
  tamb = loadSound('./sounds/tamb.wav');
  stick = loadSound('./sounds/stick.wav');
}

function setup() {

  createCanvas(620, 480);

  // init track settings
  angle = radians(0);
  fps = 60;
  increment = 0;

  // p5 SoundLoops
  // 4n
  looper4n = new p5.SoundLoop(function (timeFromNow) {
    hat.play(timeFromNow);
  }, "4n");
  looper4n.bpm = bpm
  // 3n
  looper3n = new p5.SoundLoop(function (timeFromNow) {
    kick.play(timeFromNow);
  }, "3n");
  looper3n.bpm = bpm

  
  // prepare the osc and env used by playNote()
  // env = new p5.Envelope(0.01, 0.8, 0.2, 0);
  // osc = new p5.TriOsc(); // connects to master output by default
  // osc.start(0);
  // osc.connect();
  // env.setInput(osc);


  // prepare the noise and env used by playSnare()
  // noise = new p5.Noise();
  // noise.amp(0.0);
  // noise.start();
  // noiseEnv = new p5.Env(0.01, 0.3, 0.2, 0);
  // noiseEnv.setInput(noise);

  // create a part with 8 spaces, where each space represents 1/16th note (default)
  // part = new p5.Part(1, 1 / 8);
  // fifthPart = new p5.Part(1, 1 / 8);
  // fourthPart = new p5.Part(4, 1/8)

  // add phrases, with a name, a callback, and
  // an array of values that will be passed to the callback if > 0
  // fifthPart.addPhrase('kick', playKick, [1])
  // part.addPhrase('snare', playSnare, [1, 0, 1, 0, 1, 0, 1, 0]);
  // part.addPhrase('bass', playBass, [52, 42, 42, 42, 42, 42, 42, 42, 52, 42, 42, 42, 42, 42, 32, 42]);

  // part.addPhrase('sync', fourthSync, [1,0,0,0])
  // part.addPhrase('noise', playNoise, [1,0,0,0,0,0,0,0]);
  // part.addPhrase('8hat', playHat, [1])
  // part.addPhrase('3kick', playKick, [1,0,0])

  // part.addPhrase('snare', playSnare, [1,0,0,0])
  // part.addPhrase('bass1', playBass, [45]);
  // fifthPart.addPhrase('bass', playBass, [50]);
  // part.addPhrase('bass', playBass, [47, 42, 45, 47, 45, 42, 40, 42]);
  // part.addPhrase('bass', playBass, [47, 0, 0, 0, 45, 0, 0, 0, 45, 0, 0, 0, 40, 0, 0, 0]);

  // // set tempo (Beats Per Minute) of the part and tell it to loop
  // part.setBPM(bpm);
  // fifthPart.setBPM(bpm);
  masterVolume(1);
  // part.loop();
  // part.stop();
  // fifthPart.loop();
  // fifthPart.stop();
}

// resync interval functions ---------------------------------------------------
let bassCount = 0;

function fourthSync() {
  console.log("fouth: "+bassCount)
  let deg = [0,90,180,270]
  // angle = radians(deg[bassCount])
  redraw();
  bassCount = (bassCount) % 4;
}


let fifthTick = 0;
function fifthCount() {
  console.log("fifth: "+fifthTick)
  let deg = [0,72,144,216,288];
  // angle = radians(deg[fifthTick]);
  fifthTick = (fifthTick+1) % 5;
  redraw();
}

function playKick(time, playbackRate) {
  prevTime = time + getAudioContext().currentTime;
  kick.rate(playbackRate);
  kick.play(time);
}

function playHat(time, playbackRate) {
  prevTime = time + getAudioContext().currentTime;
  hat.rate(playbackRate);
  hat.play(time);
}
function playSnare(time, playbackRate) {
  prevTime = time + getAudioContext().currentTime;
  snare.rate(playbackRate);
  snare.play(time);
}
function playTamb(time, playbackRate) {
  prevTime = time + getAudioContext().currentTime;
  tamb.rate(playbackRate);
  tamb.play(time);
}
function playStick(time, playbackRate) {
  prevTime = time + getAudioContext().currentTime;
  stick.rate(playbackRate);
  stick.play(time);
}

function playBass(time, params) {

  prevTime = time + getAudioContext().currentTime;
  currentBassNote = params;
  osc.freq(midiToFreq(params), 0 , time);
  env.play(osc, time);
}

function playNoise(time, params) {
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

// calculate increment value per draw
// (degrees / (bars / bpm * seconds)) / frames) = degrees per frame
// (360 / (4 / 60 * 60)) / 60
function setIncrement() {
  increment = 0
  let _bpm = looper4n.bpm;
  // increment += (360 / (4 / _bpm * 60)) / 60
  increment += radians(360 / (4 / _bpm * 60))
}

// master play function --------------------------------------------------------
function masterPlay() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  // looper4n.syncedStart(looper3n);
  
  if (looper4n.isPlaying) {
    looper4n.pause();
    looper3n.pause();
    // console.log(getAudioContext().currentTime);
    increment = 0;
    document.getElementById('play-button').value = 'play'
  } else {
    looper4n.syncedStart(looper3n);
    // startTime = getAudioContext().currentTime;
    // console.log(getAudioContext().currentTime); //always 0
    setIncrement();
    document.getElementById('play-button').value = 'pause'
  }
}

// function checkPos() {
//   // console.log(getAudioContext().currentTime);
//   bpm // beats per minute
//   bps = bpm/60 // beats per second
//   spb = 60/bpm // seconds per beat
//   bpmm = 4 // beats per measure (3/4, 4/4, 5/4, where measure is quarter)
//   spm = (bpmm*60)/bpm //seconds per measure (1 measure every n seconds)
//   turnsPerMs = 1/(1000*spm)
//   startTime // currentTime taken at part start() in masterPlay
//   timeDelta = getAudioContext().currentTime - startTime;
//   revDelta = timeDelta * turnsPerMs;
//   angle += revDelta
//   // console.log(angle)
//   redraw();
//   // debugger
// }

function draw () {
  
  // test framecount

  if (looper4n.isPlaying) {
    if (frameCount % 60 === 0) {
      console.log('tick - seconds')
      // angle = radians((360/(bpm / (4 * 60))));
    }
    angle += increment / fps
  }


  // canvas
  background(60); // rgb grey
  translate(width / 2, height / 2) // origin

  // play head
  strokeWeight(4);
  line(200, 0, 225, 0)

  // rotation settings
  frameRate(fps);
  // if (looper4n.isPlaying) {
  //   angle += increment / fps
  // }

  rotate(angle);


  //track settings
  stroke(0);
  strokeWeight(2);
  
  // // 1/8 note track
  fill(200, 50, 50, 255);
  let inc;
  for (let i = 0; i < 8; i++) {
    inc = 45;
    arc(0,0,400,400, radians(inc*i), radians(inc*(i+1)), PIE)    
  }

  // // // 1/5 note track
  // fill(200, 50, 50, 255);
  // let deg = [0, 72, 144, 216, 288, 360];
  // arc(0, 0, 400, 400, radians(deg[0]), radians(deg[1]), PIE);
  // arc(0, 0, 400, 400, radians(deg[1]), radians(deg[2]), PIE);
  // arc(0, 0, 400, 400, radians(deg[2]), radians(deg[3]), PIE);
  // arc(0, 0, 400, 400, radians(deg[3]), radians(deg[4]), PIE);
  // arc(0, 0, 400, 400, radians(deg[4]), radians(deg[5]), PIE);

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