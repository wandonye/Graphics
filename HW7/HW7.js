"use strict";

//var m4 = twgl.m4;
const v3 = twgl.v3;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
function setup() {
  // Get canvas, WebGL context, m4
  // set up the canvas and context
  var canvas = document.createElement("canvas");
  canvas.setAttribute("width",600);
  canvas.setAttribute("height",600);
  document.body.appendChild(canvas);

  // make a place to put the drawing controls - a div
  var controls = document.createElement("DIV");
  controls.id = "controls";
  document.body.appendChild(controls);

  // a switch between camera modes
  var uiMode = document.createElement("select");
  uiMode.innerHTML += "<option>ArcBall</option>";
  uiMode.innerHTML += "<option>Drive</option>";
  uiMode.innerHTML += "<option>Fly</option>";
  uiMode.innerHTML += "</select>";
  controls.appendChild(uiMode);

  var resetButton = document.createElement("button");
  resetButton.innerHTML = "Reset View";
  resetButton.onclick = function() {
      // note - this knows about arcball (defined later) since arcball is lifted
      arcball.reset();

      drivePos = [0,.2,5];
      driveTheta = 0;
      driveXTheta = 0;

  }
  controls.appendChild(resetButton);

  // make some checkboxes - using my cheesy panels code
  var checkboxes = makeCheckBoxes([ ["Run",1], ["Examine",0] ]); //

  // // a selector for which object should be examined
  // var toExamine = document.createElement("select");
  // grobjects.forEach(function(obj) {
  //        toExamine.innerHTML +=  "<option>" + obj.name + "</option>";
  //     });
  // controls.appendChild(toExamine);

  // make some sliders - using my cheesy panels code
  var sliders = makeSliders([["TimeOfDay",0,24,12],
                              ["Speed",1,20,10]]);

  // this could be gl = canvas.getContext("webgl");
  // but twgl is more robust
  var gl = twgl.getWebGLContext(canvas);

  // information for the cameras
  var lookAt = [0,0,0];
  var lookFrom = [100,100,1000];
  var fov = 1.1;

  var arcball = new ArcBall(canvas);

  // for timing
  var realtime = 0
  var lastTime = Date.now();

  // parameters for driving
  var drivePos = [0,10,500];
  var driveTheta = 0;
  var driveXTheta = 0;

  // cheesy keyboard handling
  var keysdown = {};

  document.body.onkeydown = function(e) {
      var event = window.event ? window.event : e;
      keysdown[event.keyCode] = true;
      e.stopPropagation();
  };
  document.body.onkeyup = function(e) {
      var event = window.event ? window.event : e;
      delete keysdown[event.keyCode];
      e.stopPropagation();
  };

  // Read shader source
  var robot_vSrc = document.getElementById("wood_vs").text;
  var robot_fSrc = document.getElementById("wood_fs").text;
  var ground_vSrc = document.getElementById("ground_vs").text;
  var ground_fSrc = document.getElementById("ground_fs").text;
  var solid_vSrc = document.getElementById("solid_vs").text;
  var solid_fSrc = document.getElementById("solid_fs").text;
  var slider1 = document.getElementById('Speed');
  slider1.value = 5;
  var resolution = 20;
  var context = canvas.getContext('2d');
  var angle1 = 0.01*Math.PI;
  var robotShader = new Shader(context,gl,robot_vSrc,robot_fSrc);
  var groundShader = new Shader(context,gl,ground_vSrc,ground_fSrc);
  var solidShader = new Shader(context,gl,solid_vSrc,solid_fSrc);

  var rx = [200];
  var rz = [160];
  var location = [0];
  var rsize = [0.2];
  var root = new Root(null,null);
  var robot = new Robot(root,"mv_robot1",robotShader,0.5,[0,0,80],[1,0,0],1);
  root.addNode("mv_robot1", robot);
  var scene = new Scene(root,groundShader);
  root.addNode("scene", scene);
  var tree1 = new Tree(root, "tree1", solidShader,10,"#228B22");
  tree1.setTransform(m4.multiply(m4.scaling([60,60,60]),m4.translation([0,-50,0])));
  root.addNode("tree1", tree1);
  var tree2 = new Tree(root, "tree2", solidShader,10,"#228B22");
  tree2.setTransform(m4.multiply(m4.scaling([70,80,70]),m4.translation([80,-30,0])));
  root.addNode("tree2", tree2);
  var tree3 = new Tree(root, "tree3", solidShader,10,"#228B22");
  tree3.setTransform(m4.multiply(m4.scaling([20,40,20]),m4.translation([30,-70,50])));
  root.addNode("tree3", tree3);
  var pedestal = new OBJNode(root, "pedestal1", robotShader, pedestalObj);
  pedestal.setTransform(m4.multiply(m4.scaling([100,100,100]),m4.translation([-300,-70,-250])));
  root.addNode("pedestal1", pedestal);
  pedestal = new OBJNode(root, "pedestal2", robotShader, pedestalObj);
  pedestal.setTransform(m4.multiply(m4.scaling([100,100,100]),m4.translation([300,-70,-250])));
  root.addNode("pedestal2", pedestal);
  pedestal = new OBJNode(root, "pedestal3", robotShader, pedestalObj);
  pedestal.setTransform(m4.multiply(m4.scaling([100,100,100]),m4.translation([300,-70,300])));
  root.addNode("pedestal3", pedestal);
  pedestal = new OBJNode(root, "pedestal4", robotShader, pedestalObj);
  pedestal.setTransform(m4.multiply(m4.scaling([100,100,100]),m4.translation([-300,-70,300])));
  root.addNode("pedestal4", pedestal);
  // console.log(cone);
  function draw() {
    var curTime = Date.now();
    if (checkboxes.Run.checked) {
        realtime += (curTime - lastTime);
    }
    lastTime = curTime;

    // first, let's clear the screen
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // figure out the transforms
    //var projM = m4.perspective(fov, 1, 0.1, 1000);Math.PI/3,1,10,2000
    var projM = m4.perspective(fov,1,10,2000);
    var cameraM = m4.lookAt(lookFrom,lookAt,[0,1,0]);
    var viewM = m4.inverse(cameraM);

    // implement the camera UI
    if (uiMode.value == "ArcBall") {
        viewM = arcball.getMatrix();
        m4.setTranslation(viewM, [0, 0, -500], viewM);
    } else if (uiMode.value == "Drive") {
        if (keysdown[65]) { driveTheta += .02; }
        if (keysdown[68]) { driveTheta -= .02; }
        if (keysdown[87]) {
            var dz = Math.cos(driveTheta);
            var dx = Math.sin(driveTheta);
            drivePos[0] -= .5*dx;
            drivePos[2] -= .5*dz;
        }
        if (keysdown[83]) {
            var dz = Math.cos(driveTheta);
            var dx = Math.sin(driveTheta);
            drivePos[0] += .5*dx;
            drivePos[2] += .5*dz;
        }

        cameraM = m4.rotationY(driveTheta);
        m4.setTranslation(cameraM, drivePos, cameraM);
        viewM = m4.inverse(cameraM);
    }else if (uiMode.value == "Fly") {

        if (keysdown[65] || keysdown[37]) {
            driveTheta += .02;
        }else if (keysdown[68] || keysdown[39]) {
            driveTheta -= .02;
        }

        if (keysdown[38]) { driveXTheta += .02; }
        if (keysdown[40]) { driveXTheta -= .02; }

        var dz = Math.cos(driveTheta);
        var dx = Math.sin(driveTheta);
        var dy = Math.sin(driveXTheta);

        if (keysdown[87]) {
            drivePos[0] -= .25*dx;
            drivePos[2] -= .25*dz;
            drivePos[1] += .25 * dy;
        }

        if (keysdown[83]) {
            drivePos[0] += .25*dx;
            drivePos[2] += .25*dz;
            drivePos[1] -= .25 * dy;
        }

        cameraM = m4.rotationX(driveXTheta);
        m4.multiply(cameraM, m4.rotationY(driveTheta), cameraM);
        m4.setTranslation(cameraM, drivePos, cameraM);
        viewM = m4.inverse(cameraM);
    }

    // get lighting information
    var tod = Number(sliders.TimeOfDay.value);
    var sunAngle = Math.PI * (tod-6)/12;
    var sunDirection = [Math.cos(sunAngle),-Math.sin(sunAngle),0];

    root.getChild('scene').setProjection(projM);
    root.getChild('scene').setCameraLocation(lookFrom);
    root.getChild('scene').setCameraTransformation(viewM);
    root.getChild('scene').setLightSource(sunDirection);

    // hack to clear the canvas fast
      //update robot
    for (var objName of root.getChildrenNames()) {
      if (checkboxes.Run.checked&&root.getChild(objName).id.includes("robot")) {
        root.getChild(objName).updateStatus();
        location[0] += parseFloat(slider1.value,10)/10;
        location[0] = location[0]%360;
        var theta = location[0]/180*Math.PI;
        var x = rx[0]*Math.cos(theta);
        var z = rz[0]*Math.sin(theta);
        var tangent = Math.atan2(-rx[0]*Math.sin(theta),
                        rz[0]*Math.cos(theta));
        var T_model = m4.multiply(m4.rotationY(tangent),
                        m4.translation([x,0,z]));
        root.getChild(objName).setTransform(T_model);
      }
    }
    canvas.width = canvas.width;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    root.draw();
    window.requestAnimationFrame(draw);
  }
  function changeSpeed() {
    var v = parseFloat(slider1.value,10);
    for (var objName of root.getChildrenNames()) {
      if (objName.includes("robot")){
        root.getChild(objName).setSpeed(v/10);
      }
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
