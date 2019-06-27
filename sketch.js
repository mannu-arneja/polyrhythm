

// handle play button
window.addEventListener('load', init, false);
function init() {
  document.getElementById('play-button').addEventListener('click', () => masterPlay());
  bpm = document.getElementById('tempoSlider').value
  document.getElementById('tempoSlider').addEventListener('input', (e) => {
    bpm = e.target.valueAsNumber;
    document.getElementById('tempoVal').innerHTML = bpm
  })
  document.getElementById('tempoSlider').addEventListener('mouseup', (e) => {
    bpm = e.target.valueAsNumber;
    mySetBPM(bpm);
    // document.getElementById('tempoVal').innerHTML = bpm
  })
  document.getElementById('tempoVal').innerHTML = bpm
  document.getElementById('track-form').addEventListener('submit', (e) => {
    const formData = new FormData(e.target);
    div = formData.get('divs');
    wav = formData.get('sounds');
    addTrack(div, wav);
    e.preventDefault();
  });

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
let trackArr = [];

// p5 SoundFile Obj
let sounds, kick, hat, snare, tamb, stick;


function preload() {
  kick = loadSound('./sounds/kick.wav');
  hat = loadSound('./sounds/chh.wav');
  snare = loadSound('./sounds/snare.wav');
  tamb = loadSound('./sounds/tamb.wav');
  stick = loadSound('./sounds/stick.wav');

  sounds = {
    "kick": kick,
    "hat": hat,
    "snare": snare,
    "tamb": tamb,
    "stick": stick
  };
}

function setup() {

  createCanvas(620, 480);

  // check sounds
  while (!soundsLoaded()) {
    console.log('loading...');
  }
  console.log('all sounds loaded')

  // init track settings
  angle = radians(0);
  fps = 60;
  increment = 0;

  // p5 SoundLoops
  // 4n
  // looper4n = new p5.SoundLoop(function (timeFromNow) {
  //   hat.play(timeFromNow);
  // }, "4n");
  // looper4n.bpm = bpm
  // // 3n
  // looper3n = new p5.SoundLoop(function (timeFromNow) {
  //   kick.play(timeFromNow);
  // }, "3n");
  // looper3n.bpm = bpm

  masterVolume(1);
}

function soundsLoaded() {
  return Object.values(sounds).every(sound => sound.isLoaded());
}

let tickCount = 0;
// UI
function addTrack(div, wav) {
  let newTrack = new p5.SoundLoop(function (timeFromNow) {
    sounds[wav].play(timeFromNow);
    if (timeFromNow) {
      // reSync();
      highlight = true
    }
  }, div);
  newTrack.bpm = bpm
  trackArr.push(newTrack);
  randColor();
  if (trackArr[0].isPlaying) {
    trackArr[trackArr.length-1].syncedStart(trackArr[0])
  }
}

// WIP metroname as always playing track[0]?

// function reSync() {
//   if (trackArr.length && tickCount % trackArr[0].interval[0] === 0) {
//     tickCount += 1;
//     console.log('tick measure')
//     angle = radians(0)
//   }
// }

function highlight() {
  highlight = true
  redraw();
  console.log('test')
}

function mySetBPM(bpm) {
  if (trackArr.length && trackArr[0].isPlaying) {
    masterPlay();
    setTimeout(masterPlay(),50)
  }
  for (let i = 0; i < trackArr.length; i++) {
    trackArr[i].bpm = bpm;
  }
  // increment += (360 / (4 / _bpm * 60)) / 60
  increment = 0 // offset
  increment += radians(360 / (4 / bpm * 60))
  angle = radians(180);
}

// master play function --------------------------------------------------------
function masterPlay() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  if (trackArr.length) {
    if (trackArr[0].isPlaying){
      for (let i = 0; i < trackArr.length; i++) {
        trackArr[i].stop();
      }
      increment = 0;
      document.getElementById('play-button').value = 'play'
    } else {
      mySetBPM(bpm)
      trackArr[0].start();
      setTimeout(function(){
        for (let i = 1; i < trackArr.length; i++) {
          trackArr[i].syncedStart(trackArr[0])
        };
      },500);
      document.getElementById('play-button').value = 'pause'
    }
  }

  // if (looper4n.isPlaying) {
  //   looper4n.pause();
  //   looper3n.pause();
  //   // console.log(getAudioContext().currentTime);
  //   increment = 0;
  //   document.getElementById('play-button').value = 'play'
  // } else {
  //   looper4n.syncedStart(looper3n);
  //   // startTime = getAudioContext().currentTime;
  //   // console.log(getAudioContext().currentTime); //always 0
  //   setIncrement();
  //   document.getElementById('play-button').value = 'pause'
  // }
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
// function setIncrement() {
//   increment = 0
//   let _bpm = looper4n.bpm;
//   // increment += (360 / (4 / _bpm * 60)) / 60
//   increment += radians(360 / (4 / _bpm * 60))
// }



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

let colorsRand;
let trackArrColor = [];
function randColor() {
  colorsRand = [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
  ]
  trackArrColor.push(colorsRand)
}

function draw () {
  // test framecount

  if (trackArr.length && trackArr[0].isPlaying) {
    spm = ~~(((240)/bpm)*60)
    if (frameCount % spm === 0) {
      console.log('draw - measure')
      // angle = radians((360/(bpm / (4 * 60))));
      // angle = radians(0);
    }
    angle += increment / fps
  }


  // canvas
  background(104, 104, 104); // 
  translate(width / 2, height / 2) // origin
  frameRate(fps);



  // rotation settings
  push(); // start rotation
  rotate(angle);


  //track settings
  stroke(0)
  strokeWeight(3);

  // generator
  if (trackArr.length) {
    for (let i = trackArr.length-1; i >= 0; i--) {
      let radius = (i+2)*100;
      let interval = trackArr[i].interval[0]
      let arcs = {
        1: 359.9,
        2: 180,
        3: 120,
        4: 90,
        5: 72,
        6: 60,
        7: 360/7,
        8: 45,
      }
      let arcLen = arcs[interval]
      fill(trackArrColor[i])
      for (let i = 0; i < interval; i++) {
        // if (angle === radians(arcLen)) {
        if (highlight) {
          fill(155)
        }
        arc(0,0, radius, radius, radians(arcLen*i), radians(arcLen*(i+1)), PIE);
      }
    }

    pop(); //end rotation

    // play head
    let headX = 50 + trackArr.length*50
    stroke(0)
    strokeWeight(4);
    line(headX, 0, headX+25, 0)

    // donut
    fill(104, 104, 104);
    circle(0, 0, 100, 100);
  }

  // 1/3 note track
  // stroke(32,37,37)
  // fill(80, 73, 80);
  // arc(0, 0, 200, 200, radians(0), radians(359.9), PIE)
  // arc(0, 0, 200, 200, radians(120), radians(240), PIE)
  // arc(0, 0, 200, 200, radians(240), radians(360), PIE)



  highlight = false
}