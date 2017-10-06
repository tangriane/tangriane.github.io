var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");

var clock = 0;

canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;
ctx.beginPath();
ctx.rect(0,0, canvas.width, canvas.height);
ctx.fillColor = "#000";
ctx.fill();
ctx.closePath();

const DOT_COUNT = 40,
      CONNECT_COUNT_PER_DOT = 4,
      RADIUS = 6,
      LINE_WIDTH = 1.5;

function Dot(){
  this.x = canvas.width * Math.random();
  this.y = canvas.height * Math.random();
  this.xenergy = Math.random() * 4 + 1;
  this.yenergy = Math.random() * 4 + 1;
  var that = this;
  this.draw = function() {
    that.x = that.x + Math.sin(clock / that.yenergy) * that.xenergy;
    that.y = that.y + Math.sin(clock / that.xenergy) * that.yenergy;
    ctx.beginPath();
    ctx.fillStyle = "#FFF";
    ctx.arc(that.x, that.y, RADIUS, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
  this.drawLineToDot = function(n) {
    var selectedDot = findNearestDot(that, n);
    ctx.beginPath();
    ctx.strokeStyle = "rgba(" + (Math.round(Math.sin(clock) * 255)) + "," + (Math.round(Math.cos(clock) * 255)) + "," + Math.round(Math.cos(clock * .05) * 255) + ", .3)";
    ctx.lineWidth = LINE_WIDTH;
    ctx.moveTo(that.x, that.y);
    ctx.lineTo(selectedDot.x, selectedDot.y);
    ctx.stroke();
    ctx.closePath();
  }
}

var dots = [];

for (var i = 0; i < DOT_COUNT; i++){
  dots.push(new Dot());
}

function findNearestDot(fromDot, n){
  var x = fromDot.x;
  var y = fromDot.y;
  var sortedDots = dots.sort(function(a, b){
    return ((Math.abs(x - a.x) + Math.abs(y - a.y)) > (Math.abs(x - b.x) + Math.abs(y - b.y))) ? 1 : -1;
  });
  return sortedDots[n];
}

function draw(){
  clock += .1;
  ctx.beginPath();
  ctx.fillStyle = "#727c8b";
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  ctx.closePath();
  dots.forEach(function(dot){ dot.draw(); });
  dots.forEach(function(dot, i){
    for (var i = 1; i < Math.min(dots.length - 1, CONNECT_COUNT_PER_DOT); i++){
      dot.drawLineToDot(i);
    }
  });
}

window.onclick = function(e){
  var d = new Dot();
  d.x = e.clientX * 2;
  d.y = e.clientY * 2;
  dots.push(d);
  draw();
}

setInterval(draw, 30);