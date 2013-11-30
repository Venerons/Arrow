// Copyright (c) 2013 Daniele Veneroni.
// Released under GPLv3 License. See LICENSE.md for further information.
"use strict";

// WEB AUDIO API CHECK
window.AudioContext = window.AudioContext || window.webkitAudioContext;
if (!AudioContext) {
    alert("Sorry, your browser doesn't support the Web Audio APIs.");
    throw new Error("Sorry, your browser doesn't support the Web Audio APIs. Execution Aborted."); // ABORT ALL
}

// CREATE THE NODES
var context = new AudioContext();
var nodes = {};
nodes.touchOSC = context.createOscillator();
nodes.touchOSCvolume = context.createGain();
nodes.filter = context.createBiquadFilter();
nodes.delay = context.createDelay();
nodes.feedback = context.createGain();
nodes.volume = context.createGain();
nodes.analyser = context.createAnalyser();
nodes.script = context.createScriptProcessor(2048, 1, 1);

// SETUP THE NODES
nodes.touchOSC.type = waveSelect.value;
nodes.touchOSC.frequency.value = 0;
nodes.touchOSC.detune.value = 0;
nodes.touchOSCvolume.gain.value = 1;

nodes.filter.type = filterSelect.value;
nodes.filter.frequency.value = context.sampleRate / 2;
nodes.filter.Q.value = 0;
nodes.filter.gain.value = 0;

nodes.delay.delayTime.value = 0;
nodes.feedback.gain.value = 0;

nodes.volume.gain.value = 0.5;

nodes.analyser.smoothingTimeConstant = 0.3;
nodes.analyser.fftSize = spectrumSize.value;

// CONNECT THE NODES
nodes.touchOSC.connect(nodes.touchOSCvolume);
nodes.touchOSCvolume.connect(nodes.filter);
nodes.filter.connect(nodes.volume);
nodes.filter.connect(nodes.delay);
nodes.delay.connect(nodes.feedback);
nodes.feedback.connect(nodes.delay);
nodes.feedback.connect(nodes.volume);
nodes.volume.connect(context.destination);
nodes.volume.connect(nodes.analyser);
nodes.analyser.connect(nodes.script);
nodes.script.connect(context.destination);

nodes.script.addEventListener("audioprocess", function() {
    var array =  new Uint8Array(nodes.analyser.frequencyBinCount);
    nodes.analyser.getByteFrequencyData(array);
    drawSpectrum(array);
}, false);

function oscFrequencyChange(e) {
	var minValue = 27.5;
	var maxValue = 4186.01;
	var range = e.x * 1.0 / util.docWidth;
	var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
	var multiplier = Math.pow(2, numberOfOctaves * (range - 1.0));
	nodes.touchOSC.frequency.value = maxValue * multiplier;
}

function vcfFrequencyChange(e) {
    var minValue = 27.5;
    var maxValue = context.sampleRate / 2;
    var range = 1.0 - (e.y * 1.0 / util.docHeight);
    var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
    var multiplier = Math.pow(2, numberOfOctaves * (range - 1.0));
    nodes.filter.frequency.value = maxValue * multiplier;
    filterFrequencyLabel.innerHTML = toFixed(nodes.filter.frequency.value, 2)+"Hz";
}

function touch(e) {
	try { nodes.touchOSC.start(0); } catch (e) {}
	nodes.touchOSCvolume.gain.value = 1;
	oscFrequencyChange(e);
	vcfFrequencyChange(e);
	pad.addEventListener("pointermove", touch, false);
	e.preventDefault();
	return false;
}

var pad = document.getElementById("pad");

pad.addEventListener("pointerdown", touch, false);
pad.addEventListener("pointerup", function () {
    nodes.touchOSCvolume.gain.value = 0;
	pad.removeEventListener("pointermove", touch);
}, false);

// KEYBOARD SETUP *********************************************************************************
var keyboard = qwertyHancock({
    id: 'keyboard',
    width: util.docWidth,
    height: util.docHeigth/2,
    octaves: 2,
    startNote: 'C4',
    whiteNotesColour: 'white',
    blackNotesColour: 'black',
    hoverColour: '#f3e939',
    keyboardLayout: 'en'
});

var keyNodes = [];

keyboard.keyDown(function (note, frequency) {
    var oscillator = context.createOscillator();
    oscillator.type = waveSelect.value;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = oscDetuneRange.value;
    oscillator.connect(nodes.filter);
    try { oscillator.start(0); } catch (e) {}
    keyNodes.push(oscillator);
});

keyboard.keyUp(function (note, frequency) {
    for (var i = 0; i < keyNodes.length; i++) {
        if (Math.round(keyNodes[i].frequency.value) === Math.round(frequency)) {
            keyNodes[i].stop(0);
            keyNodes[i].disconnect();
            keyNodes.splice(i, 1);
        }
    }
});

configurePreset(presets[presetSelect.value]);
window.addEventListener('load', function () { document.getElementById("loading").hidden = true; }, false);
