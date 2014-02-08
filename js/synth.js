// Copyright (c) 2013-2014 Daniele Veneroni.
// Released under GPLv3 License. See LICENSE.md for further information.
'use strict';

// WEB AUDIO API CHECK
window.AudioContext = window.AudioContext || window.webkitAudioContext;
if (!window.AudioContext) {
	window.alert('Sorry, your browser doesn\'t support the Web Audio APIs.');
	throw new Error('Sorry, your browser doesn\'t support the Web Audio APIs. Execution Aborted.'); // ABORT ALL
}

// CREATE THE NODES
var context = new window.AudioContext();
var nodes = {
	touchOSC: context.createOscillator(),
	touchOSCvolume: context.createGain(),
	filter: context.createBiquadFilter(),
	delay: context.createDelay(),
	feedback: context.createGain(),
	volume: context.createGain(),
	analyser: context.createAnalyser(),
	script: context.createScriptProcessor(2048, 1, 1)
};

// SETUP THE NODES
nodes.touchOSC.type = waveSelect.val();
nodes.touchOSC.frequency.value = 0;
nodes.touchOSC.detune.value = 0;
nodes.touchOSCvolume.gain.value = 1;

nodes.filter.type = filterSelect.val();
nodes.filter.frequency.value = context.sampleRate / 2;
nodes.filter.Q.value = 0;
nodes.filter.gain.value = 0;

nodes.delay.delayTime.value = 0;
nodes.feedback.gain.value = 0;

nodes.volume.gain.value = 0.5;

nodes.analyser.smoothingTimeConstant = 0.3;
nodes.analyser.fftSize = spectrumSize.val();

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

nodes.script.onaudioprocess = function () {
	var array = new Uint8Array(nodes.analyser.frequencyBinCount);
	nodes.analyser.getByteFrequencyData(array);
	drawSpectrum(array);
};

function oscFrequencyChange(e) {
	var minValue = 27.5,
		maxValue = 4186.01,
		range = e.x * 1.0 / util.docWidth,
		numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2,
		multiplier = Math.pow(2, numberOfOctaves * (range - 1.0));
	nodes.touchOSC.frequency.value = maxValue * multiplier;
}

function vcfFrequencyChange(e) {
	var minValue = 27.5,
		maxValue = context.sampleRate / 2,
		range = 1.0 - (e.y * 1.0 / util.docHeight),
		numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2,
		multiplier = Math.pow(2, numberOfOctaves * (range - 1.0));
	nodes.filter.frequency.value = maxValue * multiplier;
	filterFrequencyLabel.text(nodes.filter.frequency.value.toFixed(2) + 'Hz');
}

function touch(e) {
	try {
		nodes.touchOSC.start(0);
	} catch (e) {}
	nodes.touchOSCvolume.gain.value = 1;
	oscFrequencyChange(e);
	vcfFrequencyChange(e);
	e.preventDefault();
	return false;
}

var tapping = false;

$$('#pad').on('pointerdown', function (e) {
	tapping = true;
	touch(e);
}).on('pointermove', function (e) {
	if (tapping) {
		touch(e);
	}
}).on('pointerup mouseout', function () {
	tapping = false;
	nodes.touchOSCvolume.gain.value = 0;
});

// KEYBOARD SETUP *********************************************************************************
var keyboard = qwertyHancock({
	id: 'keyboard',
	width: util.docWidth,
	height: util.docHeigth / 2,
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
	oscillator.type = waveSelect.val();
	oscillator.frequency.value = frequency;
	oscillator.detune.value = oscDetuneRange.val();
	oscillator.connect(nodes.filter);
	try {
		oscillator.start(0);
	} catch (e) {}
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

configurePreset(presets[presetSelect.val()]);
$$(window).on('load', function () {
	$$('#loading').hide();
	/*
	setTimeout(function () {
		try {
			var manifest = 'http://venerons.github.io/Arrow/manifest.webapp';

			var request = window.navigator.mozApps.checkInstalled(manifest);
			request.onerror = function(e) {
				console.error("Error calling checkInstalled: " + request.error.name);
			};
			request.onsuccess = function(e) {
				if (request.result) {
					// App is already installed
					console.log('Arrow is already installed')
				} else {
					// App is not installed, install!
					var install = window.navigator.mozApps.install(manifest);
					install.onsuccess = function () {
						// Save the App object that is returned
						var appRecord = this.result;
						alert('Arrow Installation Successful!');
					};
					install.onerror = function () {
						// Display the error information from the DOMError object
						alert('Install failed, error: ' + this.error.name);
					};
				}
			};
		} catch (e) {
			console.error('Error on installation procedure: ' + e);
		}
	}, 5000);
	*/
});
