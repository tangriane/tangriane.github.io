var TRIANGLE_SIZE = 51;
var OPACITY_VARIATION = 0.4;
var colorHue = 1;
var colorSaturation = 64;
var colorValue = 22;
var newCanvas, canvasEl, canvasData;

var downloadImage = function() {
  downloadCanvas(canvasEl);
};

// Determine screen pixel ratio (Retina/Non-Retina)
var backingScale = function() {
  if ('devicePixelRatio' in window) {
    if (window.devicePixelRatio > 1) {
      return window.devicePixelRatio;
    }
  }
  return 1;
};

var scaleFactor = backingScale();

/* UTIL FUNCTIONS */
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (h && s === undefined && v === undefined) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v, g = t, b = p;
      break;
    case 1:
      r = q, g = v, b = p;
      break;
    case 2:
      r = p, g = v, b = t;
      break;
    case 3:
      r = p, g = q, b = v;
      break;
    case 4:
      r = t, g = p, b = v;
      break;
    case 5:
      r = v, g = p, b = q;
      break;
  }

  return "#" + ((1 << 24) + (Math.floor(r * 255) << 16) + (Math.floor(g * 255) << 8) + Math.floor(b * 255)).toString(16).slice(1);
}

function heightOf(side) {
  return strip((((Math.sqrt(3)) / 2) * side));
}

function randomOpacity() {
  return (Math.random() * OPACITY_VARIATION);
}

function half(value) {
  return strip(value / 2);
}

function layCanvas(canvas) {
  var canvasContext = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (scaleFactor > 1) {
    canvas.width = canvas.width * scaleFactor;
    canvas.height = canvas.height * scaleFactor;
    canvasContext = canvas.getContext("2d");
  }

  return [canvas, canvasContext];
}

function strip(number) {
  return (parseFloat(number.toPrecision(12)));
}

function downloadCanvas(canvas) {
  window.open(canvas.toDataURL('image/jpeg'), '_blank');
}

/* END OF UTIL FUNCTIONS */

var triangleCanvas = (function() {
  "use strict";

  function triangleCanvas(canvasElm, side) {
    var canvasObject = layCanvas(canvasElm);
    this.canvas = canvasObject[0];
    this.canvasContext = canvasObject[1];
    this.side = side * scaleFactor;
    this.height = heightOf(this.side);
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.clear();
    this.draw();
  }

  triangleCanvas.prototype.clear = function() {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  };

  triangleCanvas.prototype.draw = function() {
    var totalDrawnWidth = 0;
    while (totalDrawnWidth < this.canvasWidth) {
      totalDrawnWidth = totalDrawnWidth + this.height;
      this.drawColumn(totalDrawnWidth, -half(this.side));
      totalDrawnWidth = totalDrawnWidth + this.height;
      this.drawColumn(totalDrawnWidth, -this.side);
    }
  };

  triangleCanvas.prototype.drawColumn = function(startX, startY) {
    var columnHeight = startY;
    while (columnHeight < this.canvasHeight) {
      columnHeight = columnHeight + half(this.side);
      this.triangle(startX, columnHeight, "right");
      columnHeight = columnHeight + half(this.side);
      this.triangle(startX, columnHeight, "left");
    }
  };

  triangleCanvas.prototype.triangle = function(currentX, currentY, direction) {
    var color = "rgba(0,0,0," + randomOpacity() + ")";
    var horizontal, startPoint;
    this.canvasContext.fillStyle = color;
    var moveToX, moveToY;
    switch (direction) {
      case "left":
        horizontal = -this.height;
        startPoint = currentX - this.height;
        break;
      case "right":
        horizontal = this.height;
        startPoint = currentX;
        break;
    }
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(startPoint, currentY);
    moveToY = currentY + half(this.side);
    moveToX = startPoint - horizontal;
    this.canvasContext.lineTo(moveToX, moveToY);
    moveToY = moveToY - this.side;
    this.canvasContext.lineTo(moveToX, moveToY);
    this.canvasContext.closePath();
    this.canvasContext.fill();
    this.canvasContext.save();
  };

  return triangleCanvas;
})();

function regenerateTriangles() {
  newCanvas = new triangleCanvas(canvasEl, TRIANGLE_SIZE);
  canvasData = newCanvas.canvasContext.getImageData(0, 0, newCanvas.canvasWidth, newCanvas.canvasHeight);
  colorize();
}

function colorize() {
  var currentCanvas = newCanvas;
  var ctx = currentCanvas.canvasContext;
  var w = currentCanvas.canvasWidth;
  var h = currentCanvas.canvasHeight;
  var compositeOperation = ctx.globalCompositeOperation;

  ctx.clearRect(0, 0, w, h);

  //get the current ImageData for the canvas.
  ctx.putImageData(canvasData, 0, 0);

  //set to draw behind current content
  ctx.globalCompositeOperation = "destination-over";

  //set background color
  ctx.fillStyle = HSVtoRGB(colorHue / 100, colorSaturation / 100, colorValue / 100);
  ctx.fillRect(0, 0, w, h);

  //reset the globalCompositeOperation to what it was
  ctx.globalCompositeOperation = compositeOperation;
}

window.onload = function() {
  canvasEl = document.getElementsByClassName("trianglecanvas")[0];
  var gui = new dat.GUI();


  

  // Kick off
  regenerateTriangles();

};