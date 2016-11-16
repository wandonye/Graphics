function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
function setup() { "use strict";
  var canvas = document.getElementById('myCanvas');
  var slider1 = document.getElementById('slider1');
  var addRobot = document.getElementById('addRobot');
  var context = canvas.getContext('2d');
  var m4 = twgl.m4;
  var status = [0];
  var increment = [1];
  var rx = [100];
  var rz = [80];
  var location = [0];
  var rsize = [0.2];
  var wc = [0,0,0];
  slider1.value = 0;
  var angle1 = slider1.value*0.01*Math.PI;

  function moveToTx(x,y,z,Tx) {
    var loc = [x,y,z];
    var locTx = m4.transformPoint(Tx,loc);
    context.moveTo(locTx[0]+200,-locTx[1]+200);
  }

  function lineToTx(x,y,z,Tx) {
    var loc = [x,y,z];
    var locTx = m4.transformPoint(Tx,loc);
    context.lineTo(locTx[0]+200,-locTx[1]+200);
  }


  function drawAxes(Tx){
    context.save();
    context.beginPath();
    moveToTx(0,0,0,Tx);
    lineToTx(60,0,0,Tx);
    context.strokeStyle = "red";
    context.stroke();
    context.beginPath();
    moveToTx(0,0,0,Tx);
    lineToTx(0,60,0,Tx);
    context.strokeStyle = "green";
    context.stroke();
    context.beginPath();
    moveToTx(0,0,0,Tx);
    lineToTx(0,0,60,Tx);
    context.strokeStyle = "blue";
    context.stroke();
    context.restore();
  }

  function drawRobot(Tx, status) {
    //body
    context.save();
    var T_body = m4.multiply(m4.scaling([1,1,0.5]),
                                Tx);
    drawCube(T_body,"orange");
    //head
    var T_head = m4.multiply(m4.translation([0,135,0]),
                              m4.multiply(m4.scaling([0.8,0.6,0.5]),
                                Tx));
    drawCube(T_head,"red")
    //legs
    var T_lleg = m4.multiply(m4.translation([0,-80,0]),
                  m4.multiply(m4.scaling([0.3,1,0.5]),
                    m4.multiply(m4.rotationX(-status),
                      m4.multiply(m4.translation([-30,-20,0]),
                             Tx))));
    var T_rleg = m4.multiply(m4.translation([0,-80,0]),
                  m4.multiply(m4.scaling([0.3,1,0.5]),
                     m4.multiply(m4.rotationX(status),
                       m4.multiply(m4.translation([30,-20,0]),
                              Tx))));
    drawCube(T_lleg,"green");
    drawCube(T_rleg,"green");
    //arms
    var T_larm = m4.multiply(m4.translation([0,-80,0]),
                  m4.multiply(m4.scaling([0.3,1,0.5]),
                    m4.multiply(m4.rotationX(status),
                      m4.multiply(m4.translation([-65,80,0]),
                             Tx))));
    var T_rarm = m4.multiply(m4.translation([0,-80,0]),
                  m4.multiply(m4.scaling([0.3,1,0.5]),
                     m4.multiply(m4.rotationX(-status),
                       m4.multiply(m4.translation([65,80,0]),
                              Tx))));
    drawCube(T_larm,"purple");
    drawCube(T_rarm,"purple");
    context.restore();
  }
  function drawCube(Tx,color) {
	  context.save();
	  context.strokeStyle =color;
    context.beginPath();
    moveToTx(-50,-50,-50,Tx);
    lineToTx(50,-50,-50,Tx);
    lineToTx(50,50,-50,Tx);
    lineToTx(-50,50,-50,Tx);
    lineToTx(-50,-50,-50,Tx);
    context.stroke();

    //context.beginPath();
    moveToTx(-50,-50,50,Tx);
    lineToTx(50,-50,50,Tx);
    lineToTx(50,50,50,Tx);
    lineToTx(-50,50,50,Tx);
    lineToTx(-50,-50,50,Tx);
    //context.strokeStyle = "purple";
    context.stroke();

    //context.beginPath();
    moveToTx(-50,-50,-50,Tx);lineToTx(-50,-50,50,Tx);context.stroke();
    moveToTx(-50,50,-50,Tx);lineToTx(-50,50,50,Tx);context.stroke();
    moveToTx(50,-50,-50,Tx);lineToTx(50,-50,50,Tx);context.stroke();
    moveToTx(50,50,-50,Tx);lineToTx(50,50,50,Tx);context.stroke();
	  context.restore();
  }

  function draw() {
    // hack to clear the canvas fast
    canvas.width = canvas.width;

    var eye = [500*Math.cos(angle1),300,500*Math.sin(angle1)];
    var up = [0,1,0];
    var T_camera = m4.inverse(m4.lookAt(eye,wc,up));
    drawAxes(T_camera);

    for (var i=0; i<status.length; i++){
      if (Math.abs(status[i])>=20) {
        increment[i] = -increment[i];
      }
      var T_robotsize = m4.scaling([rsize[i],rsize[i],rsize[i]]);
      status[i] += increment[i];
      location[i] += 1;
      location[i] = location[i]%360;
      var step = status[i]/40;
      var theta = location[i]/180*Math.PI;
      var x = rx[i]*Math.cos(theta);
      var z = rz[i]*Math.sin(theta);
      var tangent = Math.atan2(-rx[i]*Math.sin(theta),
                      rz[i]*Math.cos(theta));

      var T_model = m4.multiply(T_robotsize,
                      m4.multiply(m4.rotationY(tangent),
                        m4.translation([x,0,z])));
      var T_modelview = m4.multiply(T_model,T_camera);
      drawRobot(T_modelview, step);
    }
    window.requestAnimationFrame(draw);
  }
  function changeView() {
    angle1 = slider1.value*0.01*Math.PI;
  }
  function addOne() {
    status.push(0);
    increment.push(1);
    rx.push(getRandomInt(110,250));
    rz.push(getRandomInt(110,250));
    location.push(getRandomInt(1,360));
    rsize.push(getRandomInt(20,30)/100);
  }
  slider1.addEventListener("input",changeView);
  addRobot.addEventListener("click",addOne);
  window.requestAnimationFrame(draw);
};
window.onload = setup;
