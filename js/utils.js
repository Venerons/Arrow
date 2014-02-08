// Copyright (c) 2013-2014 Daniele Veneroni.
// Released under GPLv3 License. See LICENSE.md for further information.
'use strict';

var paper = new Palette('pad');

// UTILITY FUNCTIONS ******************************************************************************
var util = {};

function adaptScreen() {
	util.docHeight = Math.max(document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
	util.docWidth = Math.max(document.body.offsetWidth, document.documentElement.offsetWidth, document.body.clientWidth, document.documentElement.clientWidth);
	util.maxSpectrumHeight = util.docHeight / 4 * 3;
	paper.size(util.docWidth, util.docHeight);
	paper.gradient(0, 0, util.docWidth, 0, $$('#spectrumColor1').val(), $$('#spectrumColor2').val());
}

adaptScreen();

$$(window).on('resize', adaptScreen);

// LOAD PRESETS ***********************************************************************************
//localStorage.clear(); // CLEAR ALL LOCALSTORAGE
if (localStorage.getItem('userPresets') === null) {
	localStorage.userPresets = JSON.stringify({ 'presets': [] });
}
var presets = [];
function loadPresets() {
	presets = factoryPresets.concat(JSON.parse(localStorage.userPresets).presets);
	var selectContent = '';
	for (var i = 0; i < presets.length; i++) {
		selectContent += '<option value="' + i + '">' + presets[i].name + '</option>';
		console.log(JSON.stringify(presets[i])); // PRINT PRESETS JSON ON THE CONSOLE
	}
	$$('#presetSelect').html(selectContent);
}
loadPresets();

// GRAPHICS ***************************************************************************************
function drawSpectrum(array) {
	paper.clear(0, 0, util.docWidth, util.docHeight);

	var gap = util.docWidth / (array.length * 2);

	for (var i = 0; i < (array.length); i++){
		var newy = util.docHeight - (util.maxSpectrumHeight * array[i] / 256);
		paper.rect(i * (gap * 2), newy, gap, util.docHeight);
	}
}

// MENU CONTROLS **********************************************************************************
$$('#menuBtn').on('click', function () {
	$$('#menu').show();
	$$('#menuBtn').hide();
});
$$('#helpBtn').on('click', function () {
	$$('#help').show();
});
$$('#closeBtn').on('click', function () {
	$$('#menu').hide();
	$$('#menuBtn').show();
});
$$('#helpCloseBtn').on('click', function () {
	$$('#help').hide();
});

var osccollapsible = document.getElementById('osc-collapsible');
var filtercollapsible = document.getElementById('filter-collapsible');
var delaycollapsible = document.getElementById('delay-collapsible');
var optionscollapsible = document.getElementById('options-collapsible');

$$('#osc-title').on('click', function () {
	osccollapsible.hidden = !osccollapsible.hidden;
});
$$('#filter-title').on('click', function () {
	filtercollapsible.hidden = !filtercollapsible.hidden;
});
$$('#delay-title').on('click', function () {
	delaycollapsible.hidden = !delaycollapsible.hidden;
});
$$('#options-title').on('click', function () {
	optionscollapsible.hidden = !optionscollapsible.hidden;
});

// PRESET CONTROLS ********************************************************************************
function configurePreset(p) {
	// SET THE CONTEXT
	nodes.touchOSC.type = p.osc.wave;
	nodes.touchOSC.detune.value = p.osc.detune;
	for (var i = 0; i < keyNodes.length; i++) {
		keyNodes[i].type = p.osc.wave;
		keyNodes[i].detune.value = p.osc.detune;
	}
	nodes.filter.type = p.filter.type;
	nodes.filter.frequency.value = p.filter.frequency;
	nodes.filter.Q.value = p.filter.quality;
	nodes.filter.gain.value = p.filter.gain;
	nodes.delay.delayTime.value = p.delay.delayTime;
	nodes.feedback.gain.value = p.delay.feedback;
	
	// SET THE CONTROLS
	$$('#waveSelect').val(p.osc.wave);
	$$('#oscDetuneRange').val(p.osc.detune);
	$$('#oscDetuneLabel').text('' + p.osc.detune);
	$$('#filterSelect').val(p.filter.type);
	//$$('#filterFrequencyRange').val(BOH?);
	$$('#filterFrequencyLabel').text(p.filter.frequency.toFixed(2) + 'Hz');
	$$('#filterQualityRange').val(p.filter.quality / 30);
	$$('#filterQualityLabel').text(p.filter.quality.toFixed(2));
	$$('#filterGainRange').val(p.filter.gain);
	$$('#filterGainLabel').text('' + p.filter.gain);
	$$('#delayTimeRange').val(p.delay.delayTime / 1 * 100);
	$$('#delayTimeLabel').text(Math.round(p.delay.delayTime * 1000) + 'ms');
	//$$('#delayFeedbackRange).val(BOH?);
	$$('#delayFeedbackLabel').text('' + Math.round(p.delay.feedback * 100));
}
$$('#presetSelect').on('change', function () {
	configurePreset(presets[presetSelect.value]);
});
$$('#saveBtn').on('click', function () {
	var name = window.prompt('Preset Name: ');
	if (name && name !== '') {
		var preset = {
			name: name,
			osc: {
				wave: $$('#waveSelect').val(),
				detune: $$('#oscDetuneRange').val()
			},
			filter: {
				type: $$('#filterSelect').val(),
				frequency: nodes.filter.frequency.value,
				quality: nodes.filter.Q.value,
				gain: nodes.filter.gain.value
			},
			delay: {
				delayTime: nodes.delay.delayTime.value,
				feedback: nodes.feedback.gain.value
			}
		};
		var userPresets = JSON.parse(localStorage.userPresets);
		userPresets.presets.push(preset);
		localStorage.userPresets = JSON.stringify(userPresets);
		loadPresets();
		$$('#presetSelect').val(presets.length - 1);
	}
});

// OSC CONTROLS ***********************************************************************************
$$('#waveSelect').on('change', function () {
	//var waves = { 'sine': nodes.osc.SINE, 'square': nodes.osc.SQUARE, 'sawtooth': nodes.osc.SAWTOOTH, 'triangle': nodes.osc.TRIANGLE };
	nodes.touchOSC.type = $$('#waveSelect').val();
});
$$('#oscDetuneRange').on('input', function () {
	nodes.touchOSC.detune.value = $$('#oscDetuneRange').val();
	for (var i = 0; i < keyNodes.length; i++) {
		keyNodes[i].detune.value = $$('#oscDetuneRange').val();
	}
	$$('#oscDetuneLabel').text($$('#oscDetuneRange').val());
});

// FILTER CONTROLS ********************************************************************************
$$('#filterSelect').on('change', function () {
	nodes.filter.type = $$('#filterSelect').val();
});
$$('#filterFrequencyRange').on('input', function () {
	// Clamp the frequency between the minimum value (40 Hz) and half of the sampling rate.
	var minValue = 40;
	var maxValue = context.sampleRate / 2;
	var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2; // Logarithm (base 2) to compute how many octaves fall in the range.
	var multiplier = Math.pow(2, numberOfOctaves * ($$('#filterFrequencyRange').val() - 1.0)); // Compute a multiplier from 0 to 1 based on an exponential scale.
	nodes.filter.frequency.value = maxValue * multiplier; // Get back to the frequency value between min and max.
	$$('#filterFrequencyLabel').text(nodes.filter.frequency.value.toFixed(2) + 'Hz');
});
$$('#filterQualityRange').on('input', function () {
	nodes.filter.Q.value = $$('#filterQualityRange').val() * 30;
	$$('#filterQualityLabel').text(nodes.filter.Q.value.toFixed(2));
});
$$('#filterGainRange').on('input', function () {
	nodes.filter.gain.value = $$('#filterGainRange').val();
	$$('#filterGainLabel').text('' + nodes.filter.gain.value);
});

// DELAY CONTROLS *********************************************************************************
$$('#delayTimeRange').on('input', function () {
	var max = 1; // should be nodes.delay.maxDelayTime? Here set to 1 -> 1 second/1000ms
	nodes.delay.delayTime.value = $$('#delayTimeRange').val() * max / 100;
	$$('#delayTimeLabel').text(Math.round(nodes.delay.delayTime.value * 1000) + 'ms');
});
$$('#delayFeedbackRange').on('input', function () {
	var fraction = parseInt($$('#delayFeedbackRange').val(), 10) / parseInt($$('#delayFeedbackRange').first.max, 10);
	// Let's use an x*x curve (x-squared) since simple linear (x) does not sound as good.
	nodes.feedback.gain.value = fraction * fraction;
	$$('#delayFeedbackLabel').text('' + Math.round(nodes.feedback.gain.value * 100));
});

// OPTIONS CONTROLS *******************************************************************************
$$('#spectrumColor1, #spectrumColor2').on('change', function () {
	paper.gradient(0, 0, util.docWidth, 0, $$('#spectrumColor1').val(), $$('#spectrumColor2').val());
});
$$('#spectrumSize').on('change', function () {
	nodes.analyser.fftSize = $$('#spectrumSize').val();
});

// PAGE VISIBILITY API ****************************************************************************
$$.visibility({
	onHidden: function () {
		nodes.volume.gain.value = 0;
	}, 
	onVisible: function () {
		nodes.volume.gain.value = 1;
	}
});

// ORIENTATION API ********************************************************************************
window.screen.lockOrientation = window.screen.lockOrientation || window.screen.mozLockOrientation;
if (window.screen.lockOrientation) {
	window.screen.lockOrientation('landscape');
}

// FULLSCREEN API *********************************************************************************
$$('#fullscreenBtn').on('click', function () {
	$$(document.documentElement).toggleFullscreen();
});
