// Copyright (c) 2013-2014 Daniele Veneroni.
// Released under GPLv3 License. See LICENSE.md for further information.
'use strict';

var factoryPresets = [];

/*
{
    "name": "Default",
    "osc": {
        "wave": "sine",
        "detune": 0
    },
    "filter": {
        "type": "lowpass",
        "frequency": 22050,
        "quality": 0,
        "gain": 0
    },
    "delay": {
        "delayTime": 0,
        "feedback": 0.5
    }
}
*/

factoryPresets.push({"name":"ChipChip","osc":{"wave":"square","detune":"464"},"filter":{"type":"highpass","frequency": 5000,"quality":30,"gain":0},"delay":{"delayTime":0,"feedback":0}});
factoryPresets.push({"name":"Organth","osc":{"wave":"sawtooth","detune":"-456"},"filter":{"type":"highpass","frequency":1715.8890380859375,"quality":9.600000381469727,"gain":18},"delay":{"delayTime":0,"feedback":0}});
factoryPresets.push({"name":"Theremin","osc":{"wave":"sine","detune":0},"filter":{"type":"lowpass","frequency": 22050,"quality":0,"gain":0},"delay":{"delayTime":0.2,"feedback":0.2}});
factoryPresets.push({"name":"Looper","osc":{"wave":"square","detune":"0"},"filter":{"type":"lowpass","frequency": 22050,"quality":0,"gain":0},"delay":{"delayTime":1,"feedback":1}});
