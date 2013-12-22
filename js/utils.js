// Copyright (c) 2013 Daniele Veneroni.
// Released under GPLv3 License. See LICENSE.md for further information.
"use strict";

var paper = new Palette("pad");

var menuBtn = document.getElementById("menuBtn");
var menu = document.getElementById("menu");
var saveBtn = document.getElementById("saveBtn");
var helpBtn = document.getElementById("helpBtn");
var closeBtn = document.getElementById("closeBtn");
var help = document.getElementById("help");
var helpCloseBtn = document.getElementById("helpCloseBtn");

var presetSelect = document.getElementById("presetSelect");

var waveSelect = document.getElementById("waveSelect");
var oscDetuneLabel = document.getElementById("oscDetuneLabel");
var oscDetuneRange = document.getElementById("oscDetuneRange");

var filterSelect = document.getElementById("filterSelect");
var filterFrequencyLabel = document.getElementById("filterFrequencyLabel");
var filterFrequencyRange = document.getElementById("filterFrequencyRange");
var filterQualityLabel = document.getElementById("filterQualityLabel");
var filterQualityRange = document.getElementById("filterQualityRange");
var filterGainLabel = document.getElementById("filterGainLabel");
var filterGainRange = document.getElementById("filterGainRange");

var delayTimeLabel = document.getElementById("delayTimeLabel");
var delayTimeRange = document.getElementById("delayTimeRange");
var delayFeedbackLabel = document.getElementById("delayFeedbackLabel");
var delayFeedbackRange = document.getElementById("delayFeedbackRange");

var spectrumColor1 = document.getElementById("spectrumColor1");
var spectrumColor2 = document.getElementById("spectrumColor2");
var spectrumSize = document.getElementById("spectrumSize");

var osccollapsible = document.getElementById("osc-collapsible");
var filtercollapsible = document.getElementById("filter-collapsible");
var delaycollapsible = document.getElementById("delay-collapsible");
var optionscollapsible = document.getElementById("options-collapsible");

// UTILITY FUNCTIONS ******************************************************************************
function toFixed(value, precision) {
	var precision = precision || 0,
	neg = value < 0,
	power = Math.pow(10, precision),
	value = Math.round(value * power),
	integral = String((neg ? Math.ceil : Math.floor)(value / power)),
	fraction = String((neg ? -value : value) % power),
	padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
	return precision ? integral + '.' +  padding + fraction : integral;
}

var util = {};

function adaptScreen() {
	util.docHeight = Math.max(document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
	util.docWidth = Math.max(document.body.offsetWidth, document.documentElement.offsetWidth, document.body.clientWidth, document.documentElement.clientWidth);
	util.maxSpectrumHeight = util.docHeight / 4 * 3;
	paper.size(util.docWidth, util.docHeight);
	paper.gradient(0, 0, util.docWidth, 0, spectrumColor1.value, spectrumColor2.value);
}

adaptScreen();

window.addEventListener("resize", adaptScreen, false);

// LOAD PRESETS ***********************************************************************************
//localStorage.clear(); // CLEAR ALL LOCALSTORAGE
if (localStorage.getItem("userPresets") === null) {
	localStorage.userPresets = JSON.stringify({ "presets": [] });
}
var presets = [];
function loadPresets() {
	presets = factoryPresets.concat(JSON.parse(localStorage.userPresets).presets);
	var selectContent = "";
	for (var i = 0; i < presets.length; i++) {
		selectContent += "<option value=\"" + i + "\">" + presets[i].name + "</option>";
		console.log(JSON.stringify(presets[i])); // PRINT PRESETS JSON ON THE CONSOLE
	}
	presetSelect.innerHTML = selectContent;
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
menuBtn.addEventListener("click", function () { menu.hidden = false; menuBtn.hidden = true; }, false);
helpBtn.addEventListener("click", function () { help.hidden = false; }, false);
closeBtn.addEventListener("click", function () { menu.hidden = true; menuBtn.hidden = false; }, false);
helpCloseBtn.addEventListener("click", function () { help.hidden = true; }, false);

document.getElementById("osc-title").addEventListener("click", function () { osccollapsible.hidden = !osccollapsible.hidden; }, false);
document.getElementById("filter-title").addEventListener("click", function () { filtercollapsible.hidden = !filtercollapsible.hidden; }, false);
document.getElementById("delay-title").addEventListener("click", function () { delaycollapsible.hidden = !delaycollapsible.hidden; }, false);
document.getElementById("options-title").addEventListener("click", function () { optionscollapsible.hidden = !optionscollapsible.hidden; }, false);

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
	waveSelect.value = p.osc.wave;
	oscDetuneRange.value = p.osc.detune;
	oscDetuneLabel.innerHTML = p.osc.detune;
	filterSelect.value = p.filter.type;
	//filterFrequencyRange.value = (BOH?);
	filterFrequencyLabel.innerHTML = toFixed(p.filter.frequency, 2)+"Hz";
	filterQualityRange.value = p.filter.quality / 30;
	filterQualityLabel.innerHTML = toFixed(p.filter.quality, 2);
	filterGainRange.value = p.filter.gain;
	filterGainLabel.innerHTML = p.filter.gain;
	delayTimeRange.value = p.delay.delayTime / 1 * 100;
	delayTimeLabel.innerHTML = Math.round(p.delay.delayTime*1000)+"ms";
	//delayFeedbackRange.value = (BOH?);
	delayFeedbackLabel.innerHTML = Math.round(p.delay.feedback*100);
}
presetSelect.addEventListener("change", function () { configurePreset(presets[presetSelect.value]); }, false);
saveBtn.addEventListener("click", function () {
	var preset = {};
	preset.name = window.prompt("Preset Name: ");
	preset.osc = {};
	preset.osc.wave = waveSelect.value;
	preset.osc.detune = oscDetuneRange.value;
	preset.filter = {};
	preset.filter.type = filterSelect.value;
	preset.filter.frequency = nodes.filter.frequency.value;
	preset.filter.quality = nodes.filter.Q.value;
	preset.filter.gain = nodes.filter.gain.value;
	preset.delay = {};
	preset.delay.delayTime = nodes.delay.delayTime.value;
	preset.delay.feedback = nodes.feedback.gain.value;
	var userPresets = JSON.parse(localStorage.userPresets);
	userPresets.presets.push(preset);
	localStorage.userPresets = JSON.stringify(userPresets);
	loadPresets();
	presetSelect.value = presets.length-1;
}, false);

// OSC CONTROLS ***********************************************************************************
waveSelect.addEventListener("change", function () {
	//var waves = { "sine": nodes.osc.SINE, "square": nodes.osc.SQUARE, "sawtooth": nodes.osc.SAWTOOTH, "triangle": nodes.osc.TRIANGLE };
	nodes.touchOSC.type = waveSelect.value;
}, false);
oscDetuneRange.addEventListener("input", function () {
	nodes.touchOSC.detune.value = oscDetuneRange.value;
	for (var i = 0; i < keyNodes.length; i++) { keyNodes[i].detune.value = oscDetuneRange.value; }
	oscDetuneLabel.innerHTML = oscDetuneRange.value;
}, false);

// FILTER CONTROLS ********************************************************************************
filterSelect.addEventListener("change", function () {
	nodes.filter.type = filterSelect.value;
}, false);
filterFrequencyRange.addEventListener("input", function () {
	// Clamp the frequency between the minimum value (40 Hz) and half of the sampling rate.
	var minValue = 40;
	var maxValue = context.sampleRate / 2;
	var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2; // Logarithm (base 2) to compute how many octaves fall in the range.
	var multiplier = Math.pow(2, numberOfOctaves * (filterFrequencyRange.value - 1.0)); // Compute a multiplier from 0 to 1 based on an exponential scale.
	nodes.filter.frequency.value = maxValue * multiplier; // Get back to the frequency value between min and max.
	filterFrequencyLabel.innerHTML = toFixed(nodes.filter.frequency.value, 2)+"Hz";
}, false);
filterQualityRange.addEventListener("input", function () {
	nodes.filter.Q.value = filterQualityRange.value * 30;
	filterQualityLabel.innerHTML = toFixed(nodes.filter.Q.value, 2);
}, false);
filterGainRange.addEventListener("input", function () {
	nodes.filter.gain.value = filterGainRange.value;
	filterGainLabel.innerHTML = nodes.filter.gain.value;
}, false);

// DELAY CONTROLS *********************************************************************************
delayTimeRange.addEventListener("input", function () {
	var max = 1; // should be nodes.delay.maxDelayTime? Here set to 1 -> 1 second/1000ms
	nodes.delay.delayTime.value = delayTimeRange.value * max / 100;
	delayTimeLabel.innerHTML = Math.round(nodes.delay.delayTime.value*1000)+"ms";
}, false);
delayFeedbackRange.addEventListener("input", function () {
	var fraction = parseInt(delayFeedbackRange.value, 10) / parseInt(delayFeedbackRange.max, 10);
	// Let's use an x*x curve (x-squared) since simple linear (x) does not sound as good.
	nodes.feedback.gain.value = fraction * fraction;
	delayFeedbackLabel.innerHTML = Math.round(nodes.feedback.gain.value*100);
}, false);

// OPTIONS CONTROLS *******************************************************************************
spectrumColor1.addEventListener("change", function () { paper.gradient(0, 0, util.docWidth, 0, spectrumColor1.value, spectrumColor2.value); }, false);
spectrumColor2.addEventListener("change", function () { paper.gradient(0, 0, util.docWidth, 0, spectrumColor1.value, spectrumColor2.value); }, false);
spectrumSize.addEventListener("change", function () {
	nodes.analyser.fftSize = spectrumSize.value;
}, false);

// PAGE VISIBILITY API ****************************************************************************
var page = new Visibility({
	onHidden: function () { nodes.volume.gain.value = 0; }, 
	onVisible: function () { nodes.volume.gain.value = 1; }
});

// ORIENTATION API ********************************************************************************
window.screen.lockOrientation = window.screen.lockOrientation || window.screen.mozLockOrientation;
if (window.screen.lockOrientation) { window.screen.lockOrientation("landscape"); }

// FULLSCREEN API *********************************************************************************
var fullscreenBtn = document.getElementById("fullscreenBtn");
fullscreenBtn.addEventListener("click", function () {
	var isFullscreen = document.fullscreenElement || document.mozFullScreen || document.webkitIsFullScreen;
	if (isFullscreen) {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	} else {
		var docElm = document.documentElement;
		if (docElm.requestFullscreen) {
			docElm.requestFullscreen();
		} else if (docElm.mozRequestFullScreen) {
			docElm.mozRequestFullScreen();
		} else if (docElm.webkitRequestFullScreen) {
			if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
				docElm.webkitRequestFullScreen();
			} else {
				docElm.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		}
	}
}, false);
