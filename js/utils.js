// Copyright (c) 2013 Daniele Veneroni.
// Released under GPLv3 License. See LICENSE.md for further information.
"use strict";

var paper = Raphael(0, 0, "100%", "100%");

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
var filterQualityLabel = document.getElementById("filterQualityLabel");
var filterQualityRange = document.getElementById("filterQualityRange");
var filterGainLabel = document.getElementById("filterGainLabel");
var filterGainRange = document.getElementById("filterGainRange");

var delayTimeLabel = document.getElementById("delayTimeLabel");
var delayTimeRange = document.getElementById("delayTimeRange");
var delayFeedbackLabel = document.getElementById("delayFeedbackLabel");
var delayFeedbackRange = document.getElementById("delayFeedbackRange");

var spectrumSelect = document.getElementById("spectrumSelect");

var osccollapsible = document.getElementById("osc-collapsible");
var filtercollapsible = document.getElementById("filter-collapsible");
var delaycollapsible = document.getElementById("delay-collapsible");
var optionscollapsible = document.getElementById("options-collapsible");

// UTILITY FUNCTIONS ******************************************************************************
function getDocHeight() { return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight ); }
function getDocWidth() { return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.body.clientWidth, document.documentElement.clientWidth); }
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
util.docHeight = getDocHeight();
util.docWidth = getDocWidth();
util.maxSpectrumHeight = util.docHeight / 4 * 3;

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
var spectrum = [];
var firstTime = true;

function drawSpectrum(array) {
    if (firstTime) {
        for (var i = 0; i < (array.length); i++){
            spectrum[i] = paper.rect(i * 5, util.docHeight, 3, util.docHeight);
            spectrum[i].attr("stroke-width", 0);
            switch (spectrumSelect.value) {
                case "1": spectrum[i].attr("fill", "rgb("+i+",144,200)"); break; // from blue to pink
                case "2": spectrum[i].attr("fill", "rgb(0,"+i+","+i+")"); break; // from black to blue
                case "3": spectrum[i].attr("fill", "rgb("+i+","+i+","+i+")"); break; // from black to white
                default: spectrum[i].attr("fill", "rgb("+i+",144,200)"); break; // from blue to pink
            }
        }
        firstTime = false;
    }
    for (var i = 0; i < (array.length); i++){
        var newy = util.docHeight - (util.maxSpectrumHeight * array[i] / 256);
        spectrum[i].attr({y: newy});
    }
}

// MENU CONTROLS **********************************************************************************
menuBtn.onclick = function () { menu.hidden = false; menuBtn.hidden = true; };
helpBtn.onclick = function () { help.hidden = false; };
closeBtn.onclick = function () { menu.hidden = true; menuBtn.hidden = false; };
helpCloseBtn.onclick = function () { help.hidden = true; };

document.getElementById("osc-title").onclick = function () { osccollapsible.hidden = !osccollapsible.hidden; };
document.getElementById("filter-title").onclick = function () { filtercollapsible.hidden = !filtercollapsible.hidden; };
document.getElementById("delay-title").onclick = function () { delaycollapsible.hidden = !delaycollapsible.hidden; };
document.getElementById("options-title").onclick = function () { optionscollapsible.hidden = !optionscollapsible.hidden; };

// PRESET CONTROLS ********************************************************************************
presetSelect.onchange = function () {
    var p = presets[presetSelect.value];
    // set the environment
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
    // set the controls
    waveSelect.value = p.osc.wave;
    oscDetuneRange.value = p.osc.detune;
    oscDetuneLabel.innerHTML = p.osc.detune;
    filterSelect.value = p.filter.type;
    filterQualityRange.value = p.filter.quality / 30;
    filterQualityLabel.innerHTML = toFixed(p.filter.quality, 2);
    filterGainRange.value = p.filter.gain;
    filterGainLabel.innerHTML = p.filter.gain;
    delayTimeRange.value = p.delay.delayTime / 1 * 100;
    delayTimeLabel.innerHTML = Math.round(p.delay.delayTime*1000)+"ms";
    //delayFeedbackRange.value = (BOH?);
    delayFeedbackLabel.innerHTML = Math.round(p.delay.feedback*100);
};
saveBtn.onclick = function () {
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
};

// OSC CONTROLS ***********************************************************************************
waveSelect.onchange = function () {
    //var waves = { "sine": nodes.osc.SINE, "square": nodes.osc.SQUARE, "sawtooth": nodes.osc.SAWTOOTH, "triangle": nodes.osc.TRIANGLE };
	nodes.touchOSC.type = waveSelect.value;
};
oscDetuneRange.oninput = function () {
    nodes.touchOSC.detune.value = oscDetuneRange.value;
    for (var i = 0; i < keyNodes.length; i++) { keyNodes[i].detune.value = oscDetuneRange.value; }
    oscDetuneLabel.innerHTML = oscDetuneRange.value;
};

// FILTER CONTROLS ********************************************************************************
filterSelect.onchange = function () {
	nodes.filter.type = filterSelect.value;
};
filterQualityRange.oninput = function () {
    nodes.filter.Q.value = filterQualityRange.value * 30;
    filterQualityLabel.innerHTML = toFixed(nodes.filter.Q.value, 2);
};
filterGainRange.oninput = function () {
    nodes.filter.gain.value = filterGainRange.value;
    filterGainLabel.innerHTML = nodes.filter.gain.value;
};

// DELAY CONTROLS *********************************************************************************
delayTimeRange.oninput = function () {
    var max = 1; // should be nodes.delay.maxDelayTime? Here set to 1 -> 1 second/1000ms
    nodes.delay.delayTime.value = delayTimeRange.value * max / 100;
    delayTimeLabel.innerHTML = Math.round(nodes.delay.delayTime.value*1000)+"ms";
};
delayFeedbackRange.oninput = function () {
    var fraction = parseInt(delayFeedbackRange.value, 10) / parseInt(delayFeedbackRange.max, 10);
    // Let's use an x*x curve (x-squared) since simple linear (x) does not sound as good.
    nodes.feedback.gain.value = fraction * fraction;
    delayFeedbackLabel.innerHTML = Math.round(nodes.feedback.gain.value*100);
};

// OPTIONS CONTROLS *******************************************************************************
spectrumSelect.onchange = function () {
    for (var i = 0; i < (spectrum.length); i++){
        switch (spectrumSelect.value) {
            case "1": spectrum[i].attr("fill", "rgb("+i+",144,200)"); break; // from blue to pink
            case "2": spectrum[i].attr("fill", "rgb(0,"+i+","+i+")"); break; // from black to blue
            case "3": spectrum[i].attr("fill", "rgb("+i+","+i+","+i+")"); break; // from black to white
            default: spectrum[i].attr("fill", "rgb("+i+",144,200)"); break; // from blue to pink
        }
    }
};

// PAGE VISIBILITY API ****************************************************************************
var page = new Visibility({
    onHidden: function () { nodes.volume.gain.value = 0; }, 
    onVisible: function () { nodes.volume.gain.value = 1; }
});
