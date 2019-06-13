let attackTime = 0.2;
let releaseTime = 0.5;

window.addEventListener('load', init, false);
function init() {

    //resume from suspension - no autoplay default
    document.getElementById('play-button').addEventListener('click', playAll);



}

let audioCtx;
function playAll() {
    // try {
    // const AudioContext = window.AudioContext || window.webkitAudioContext;
    // const audioCtx = new AudioContext();

    // } catch (e) {
    //   alert('Web Audio API is not supported in this browser');
    // }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    //setup all nodes
    playSweep();
}


//osc node
let sweepLength = 2;
function playSweep() {

    // sweep
    let osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 440;


    //osc envelope

    const attackControl = document.querySelector('#attack');
    attackControl.addEventListener('input', function () {
        attackTime = Number(this.value);
    }, false);


    const releaseControl = document.querySelector('#release');
    releaseControl.addEventListener('input', function () {
        releaseTime = Number(this.value);
    }, false);


    let sweepEnv = audioCtx.createGain();
    sweepEnv.gain.cancelScheduledValues(audioCtx.currentTime);
    sweepEnv.gain.setValueAtTime(0, audioCtx.currentTime);
    // set our attack
    sweepEnv.gain.linearRampToValueAtTime(1, audioCtx.currentTime + attackTime);
    // set our release
    sweepEnv.gain.linearRampToValueAtTime(0, audioCtx.currentTime + sweepLength - releaseTime);


    osc.connect(sweepEnv)
    osc.connect(audioCtx.destination);
    debugger
    osc.start();
    osc.stop(audioCtx.currentTime + sweepLength);
}


