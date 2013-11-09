/* Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
(function(d,e,f){function b(a){a&&!a.setTargetAtTime&&(a.setTargetAtTime=a.setTargetValueAtTime)}window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext,AudioContext.prototype.hasOwnProperty("createGain")||(AudioContext.prototype.createGain=AudioContext.prototype.createGainNode),AudioContext.prototype.hasOwnProperty("createDelay")||(AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode),AudioContext.prototype.hasOwnProperty("createScriptProcessor")||
(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode),AudioContext.prototype.internal_createGain=AudioContext.prototype.createGain,AudioContext.prototype.createGain=function(){var a=this.internal_createGain();b(a.gain);return a},AudioContext.prototype.internal_createDelay=AudioContext.prototype.createDelay,AudioContext.prototype.createDelay=function(){var a=this.internal_createDelay();b(a.delayTime);return a},AudioContext.prototype.internal_createBufferSource=
AudioContext.prototype.createBufferSource,AudioContext.prototype.createBufferSource=function(){var a=this.internal_createBufferSource();a.start||(a.start=function(a,b,c){b||c?this.noteGrainOn(a,b,c):this.noteOn(a)});a.stop||(a.stop=a.noteOff);b(a.playbackRate);return a},AudioContext.prototype.internal_createDynamicsCompressor=AudioContext.prototype.createDynamicsCompressor,AudioContext.prototype.createDynamicsCompressor=function(){var a=this.internal_createDynamicsCompressor();b(a.threshold);b(a.knee);
b(a.ratio);b(a.reduction);b(a.attack);b(a.release);return a},AudioContext.prototype.internal_createBiquadFilter=AudioContext.prototype.createBiquadFilter,AudioContext.prototype.createBiquadFilter=function(){var a=this.internal_createBiquadFilter();b(a.frequency);b(a.detune);b(a.Q);b(a.gain);return a},AudioContext.prototype.hasOwnProperty("createOscillator")&&(AudioContext.prototype.internal_createOscillator=AudioContext.prototype.createOscillator,AudioContext.prototype.createOscillator=function(){var a=
this.internal_createOscillator();a.start||(a.start=a.noteOn);a.stop||(a.stop=a.noteOff);b(a.frequency);b(a.detune);return a}))})(window);
