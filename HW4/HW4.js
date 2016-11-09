"use strict";

var m4 = twgl.m4;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
function setup() {
  var canvas = document.getElementById('myCanvas');
  var slider1 = document.getElementById('slider1');
  slider1.value = 5;
  var zoom = 50;
  var slider_cd = document.getElementById('colordepth_slider');
  slider_cd.value = 10;
  var colorDepth = 10;
  var slider_resol = document.getElementById('resolution_slider');
  slider_resol.value = -20;
  var resolution = 20;
  var context = canvas.getContext('2d');
  var base_image = new Image();
  base_image.src = 'space.jpg';
  var painter = new Painter(context);
  painter.setBackgroundImage(base_image);
  var angle1 = 0.01*Math.PI;
  painter.setCameraLocation(800*Math.cos(angle1),-300,800*Math.sin(angle1));

  var cb = document.getElementById("cb");
  var ns = document.getElementById("ns");
  var sg = document.getElementById("show_grid");
  var sm = document.getElementById("show_mirror");

  var rx = [200];
  var rz = [160];
  var location = [0];
  var rsize = [0.2];
  var robots = [new Robot(null,0.5,[0,0,80],[1,0,0],1)];

  function draw() {
    // hack to clear the canvas fast
    canvas.width = canvas.width;
    painter.setZoom(zoom/50);
    painter.clearPolygons();
    for (var i=0; i<robots.length; i++){
      //update robot
      robots[i].updateStatus();
      location[i] += 1;
      location[i] = location[i]%360;
      var theta = location[i]/180*Math.PI;
      var x = rx[i]*Math.cos(theta);
      var z = rz[i]*Math.sin(theta);
      var tangent = Math.atan2(-rx[i]*Math.sin(theta),
                      rz[i]*Math.cos(theta));

      var T_model = m4.multiply(m4.rotationY(tangent),
                      m4.translation([x,80,z]));
      robots[i].setTransform(T_model);
      var polySet = robots[i].getPolygons(resolution);
      for (var j=0; j<polySet.length; j++){
        painter.addPolygon(polySet[j], colorDepth, !sm.checked);
      }
    }

    if (cb.checked) {
      painter.drawWireFrames();
    } else {
		  painter.render(!ns.checked,sg.checked);
    }
    window.requestAnimationFrame(draw);
  }
  function changeView() {
    zoom = parseFloat(slider1.value,10);
  }
  function changeColorDepth() {
    colorDepth = parseFloat(slider_cd.value,10);
  }
  function changeResolution() {
    resolution = -Math.round(slider_resol.value);
  }
  function addOne() {
    rx.push(getRandomInt(110,250));
    rz.push(getRandomInt(110,250));
    location.push(getRandomInt(1,360));
  }
  slider1.addEventListener("input",changeView);
  slider_cd.addEventListener("input",changeColorDepth);
  slider_resol.addEventListener("input",changeResolution);
  window.requestAnimationFrame(draw);
};
window.onload = setup;
