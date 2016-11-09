"use strict";

var m4 = twgl.m4;
var v3 = twgl.v3;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
function setup() {
// Get canvas, WebGL context, twgl.m4
  var canvas = document.getElementById('myCanvas');
  var gl = canvas.getContext("webgl");
  var m4 = twgl.m4;

  // Read shader source
  var vertexSource = document.getElementById("vs").text;
  var fragmentSource = document.getElementById("fs").text;

  var slider1 = document.getElementById('slider1');
  slider1.value = 5;
  var resolution = 20;
  var context = canvas.getContext('2d');
  var shader = new Shader(context,gl,vertexSource,fragmentSource);
  var angle1 = 0.01*Math.PI;
  shader.setCameraLocation(500*Math.cos(angle1),200,500*Math.sin(angle1));

  var rx = [200];
  var rz = [160];
  var location = [0];
  var rsize = [0.2];
  var robots = [new Robot(null,1,[0,0,80],[1,0,0],1)];

  function draw() {
    // hack to clear the canvas fast
    for (var i=0; i<robots.length; i++){
      //update robot
      robots[i].updateStatus();
      location[i] += parseFloat(slider1.value,10)/10;
      location[i] = location[i]%360;
      var theta = location[i]/180*Math.PI;
      var x = rx[i]*Math.cos(theta);
      var z = rz[i]*Math.sin(theta);
      var tangent = Math.atan2(-rx[i]*Math.sin(theta),
                      rz[i]*Math.cos(theta));
      var T_model = m4.multiply(m4.rotationY(tangent),
                      m4.translation([x,0,z]));
      // T_model = m4.identity();
      robots[i].setTransform(T_model);

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      var res = robots[i].getPolygons(resolution);
      for (var part of res){
        shader.setModelTransformation(part[1]);
        shader.render(part[0]);
      }
    }
    window.requestAnimationFrame(draw);
  }
  function changeSpeed() {
    var v = parseFloat(slider1.value,10);
    for (var robot of robots) {
      robot.setSpeed(v/10);
    }
  }

  function addOne() {
    rx.push(getRandomInt(110,250));
    rz.push(getRandomInt(110,250));
    location.push(getRandomInt(1,360));
  }
  slider1.addEventListener("input",changeSpeed);
  //draw();
  window.requestAnimationFrame(draw);
};
window.onload = setup;
