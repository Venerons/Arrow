// ┌───────────────────────────────────────────────────────────────────────┐
// │ Palette.js                                                            │
// ├───────────────────────────────────────────────────────────────────────┤
// │ Version 0.0.15 - 28/11/2013                                           │
// ├───────────────────────────────────────────────────────────────────────┤
// │ Copyright (c) 2013 Daniele Veneroni (http://venerons.github.io)       │
// ├───────────────────────────────────────────────────────────────────────┤
// │ Licensed under the MIT License (X11 License).                         │
// └───────────────────────────────────────────────────────────────────────┘

"use strict";

function Palette(canvas) {
    this.canvas = document.getElementById(canvas);
    this.context = this.canvas.getContext("2d");
}

// change canvas size (warning: this will clear the canvas!)
Palette.prototype.size = function (w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
}

// set the color for future use
Palette.prototype.setColor = function (color) {
    this.context.fillStyle = color || "#000000";
    this.context.strokeStyle = color || "#000000";
}

// create and set a linear gradient
Palette.prototype.gradient = function (x1, y1, x2, y2, color1, color2) {
    var gradient = this.context.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    this.setColor(gradient);
}

// paint a filled rectangle (color is optional)
Palette.prototype.rect = function (x, y, w, h, color) {
    if (color) { this.setColor(color); }
    this.context.fillRect(x, y, w, h);
}

// paint a stroked rectangle (color is optional)
Palette.prototype.strokedRect = function (x, y, w, h, color) {
    if (color) { this.setColor(color); }
    this.context.strokeRect(x, y, w, h);
}

// clear a rectangular area
Palette.prototype.clear = function (x, y, w, h) {
    this.context.clearRect(x, y, w, h);
}

// paint a line (color is optional)
Palette.prototype.line = function (x1, y1, x2, y2, color) {
    if (color) { this.setColor(color); }
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
}

// paint a filled circle (color is optional)
Palette.prototype.circle = function (x, y, r, color) {
    if (color) { this.setColor(color); }
    this.context.beginPath();
    this.context.arc(x, y, r, 0, 2*Math.PI);
    this.context.fill();
}

// paint a stroked circle (color is optional)
Palette.prototype.strokedCircle = function (x, y, r, color) {
    if (color) { this.setColor(color); }
    this.context.beginPath();
    this.context.arc(x, y, r, 0, 2*Math.PI);
    this.context.stroke();
}

// paint a filled arc (color is optional)
Palette.prototype.arc = function (x, y, r, start, stop, color) {
    if (color) { this.setColor(color); }
    this.context.beginPath();
    this.context.arc(x, y, r, start, stop);
    this.context.fill();
}

// paint a stroked arc (color is optional)
Palette.prototype.strokedArc = function (x, y, r, start, stop, color) {
    if (color) { this.setColor(color); }
    this.context.beginPath();
    this.context.arc(x, y, r, start, stop);
    this.context.stroke();
}

// paint a filled text (color is optional)
Palette.prototype.text = function (text, x, y, font, color) {
    if (color) { this.setColor(color); }
    this.context.font = font;
    this.context.fillText(text, x, y);
}

// paint a stroked text (color is optional)
Palette.prototype.strokedText = function (text, x, y, font, color) {
    if (color) { this.setColor(color); }
    this.context.font = font;
    this.context.strokeText(text, x, y);
}

// paint an image (width and height are optionals)
Palette.prototype.image = function (src, x, y, w, h) {
    var ctx = this.context;
    var image = new Image();
    image.onload = function() {
        if (w && h) {
            ctx.drawImage(image, x, y, w, h);
        } else {
            ctx.drawImage(image, x, y);
        }
    };
    image.src = src;
}

// requestAnimationFrame polyfill
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// set an animation at a specified fps. fps is optional, if not specified default is 60fps
Palette.prototype.animation = function (animation, fps) {
    var palette = this;
    if (!fps) { fps = 60; }
    setTimeout(function() {
        animation();
        requestAnimationFrame(palette.animation(animation, fps));
    }, 1000 / fps);
}
