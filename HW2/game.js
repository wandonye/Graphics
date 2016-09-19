"use strict"
function setup() {
    var canvas = document.getElementById('myCanvas');
    var back_button = document.getElementById('backward');
    var forward_button = document.getElementById('forward');
    var reset_button = document.getElementById('reset');
    reset_button.addEventListener("click",reset);
    forward_button.addEventListener("click",moveForward);
    back_button.addEventListener("click",moveBackward);
    var ctx = canvas.getContext('2d');
    var stage_set1_angles = [0,0.3];
    var stage_set1_speed = [0.01,0.02];
    var stage_set1_x = [75,180];
    var stage_set1_y = [300,250];
    var stage_set1_lens = [40,80];
    var bistage_angles = [0,0.3];
    var stage_set2_angles = [0.1,-1.57];
    var stage_set2_speed = [0.015,0];
    var stage_set2_x = [330,385];
    var stage_set2_y = [140,90];
    var stage_set2_lens = [70,10];
    var stage_global_coords = [stage_set1_x[0]+stage_set1_lens[0]*Math.cos(stage_set1_angles[0]),
            stage_set1_x[1]+stage_set1_lens[1]*Math.cos(stage_set1_angles[1]),0,
            stage_set2_x[0]+stage_set2_lens[0]*Math.cos(stage_set2_angles[0]),
            stage_set2_x[1]+stage_set2_lens[1]*Math.cos(stage_set2_angles[1])];

    var cur_stage = 0;
    var cur_status = 1;
    var global_x = stage_set1_x[0]+stage_set1_lens[0]*Math.cos(stage_set1_angles[0]);
    var global_y = stage_set1_y[0]+stage_set1_lens[0]*Math.sin(stage_set1_angles[0])-20;
    function moveForward(){
        cur_status += 1;
        cur_status = cur_status%6;
        cur_stage = onStage(global_x,global_y);
        if (cur_stage==-1) {
            global_x += 3;
        }else {
            var local_x = global_x-stage_global_coords[cur_stage];
            local_x += 3;
            global_x = local_x+stage_global_coords[cur_stage];
            global_y = yGLChange(0,cur_stage,"local2global");
        }

    }
    function moveBackward(){
        global_x -= 3;
        cur_status -= 1;
        cur_status = cur_status%6;
    }
    function draw() {
      canvas.width = canvas.width;
      //update stickman location
      cur_stage = onStage(global_x,global_y);
      if (cur_stage==-1){
          global_y += 2;
          if (global_y>500){
              cur_stage = 0;
              cur_status = 1;
              global_x = stage_set1_x[0]+stage_set1_lens[0]*Math.cos(stage_set1_angles[0]);
              global_y = stage_set1_y[0]+stage_set1_lens[0]*Math.sin(stage_set1_angles[0])-20;
          }
      }else if (cur_stage==4) {
          global_x += 0.5;
          if (global_x>400){
              cur_stage = 0;
              cur_status = 1;
              global_x = stage_set1_x[0]+stage_set1_lens[0]*Math.cos(stage_set1_angles[0]);
              global_y = stage_set1_y[0]+stage_set1_lens[0]*Math.sin(stage_set1_angles[0])-20;
          }
      }

      //draws stage0,1
      for (var i=0; i<stage_set1_angles.length; i++){
          ctx.save();
          var local_x = global_x-stage_global_coords[i];
          stage_set1_angles[i] = stage_set1_angles[i] + stage_set1_speed[i];
          ctx.translate(stage_set1_x[i],stage_set1_y[i]);
          drawStage(ctx, stage_set1_angles[i], 40, stage_set1_lens[i], "#C0C0C0")
          stage_global_coords[i] = stage_set1_x[i]+stage_set1_lens[i]*Math.cos(stage_set1_angles[i]);
          if (cur_stage==i) {
              global_x = local_x+stage_global_coords[i];
              global_y = yGLChange(0,cur_stage,"local2global");
          }
          ctx.restore();
      }

      //draws stage2
      ctx.save();
      var local_x = global_x-stage_global_coords[2];
      bistage_angles[0] = bistage_angles[0] + 0.02;
      bistage_angles[1] = bistage_angles[1] + 0.03;
      ctx.translate(260,210);
      drawBiStage(ctx, bistage_angles[0],bistage_angles[1], 40, 50, 30, "#C0C0C0")
      stage_global_coords[2] = 260+50*Math.cos(bistage_angles[0])+30*Math.cos(bistage_angles[1]);
      if (cur_stage==2) {
          global_x = local_x+stage_global_coords[2];
          global_y = yGLChange(0,cur_stage,"local2global");
      }
      ctx.restore();

      for (var i=0; i<stage_set2_angles.length; i++){
          ctx.save();
          var local_x = global_x-stage_global_coords[i+3];
          stage_set2_angles[i] = stage_set2_angles[i] + stage_set2_speed[i];
          ctx.translate(stage_set2_x[i],stage_set2_y[i]);
          drawStage(ctx, stage_set2_angles[i], 40, stage_set2_lens[i], "#C0C0C0")
          stage_global_coords[i+3] = stage_set2_x[i]+stage_set2_lens[i]*Math.cos(stage_set2_angles[i]);
          if (cur_stage==i+3) {
              global_x = local_x+stage_global_coords[cur_stage];
              global_y = yGLChange(0,cur_stage,"local2global");
          }

          ctx.restore();
      }
      ctx.save();
      ctx.translate(global_x,global_y);
      drawStickMan(ctx,(cur_status-3)*0.15);
      ctx.restore();

      window.requestAnimationFrame(draw);
    };

    function reset() {
        stage_set1_angles = [0,0.3];
        stage_set1_speed = [0.01,0.02];
        stage_set1_x = [75,180];
        stage_set1_y = [300,250];
        stage_set1_lens = [40,80];
        bistage_angles = [0,0.3];
        stage_set2_angles = [0.1,-1.57];
        stage_set2_speed = [0.015,0];
        stage_set2_x = [330,385];
        stage_set2_y = [140,90];
        stage_set2_lens = [70,10];
        stage_global_coords = [stage_set1_x[0]+stage_set1_lens[0]*Math.cos(stage_set1_angles[0]),
                stage_set1_x[1]+stage_set1_lens[1]*Math.cos(stage_set1_angles[1]),0,
                stage_set2_x[0]+stage_set2_lens[0]*Math.cos(stage_set2_angles[0]),
                stage_set2_x[1]+stage_set2_lens[1]*Math.cos(stage_set2_angles[1])];

        var cur_stage = 0;
        var cur_status = 1;
        global_x = stage_set1_x[0]+stage_set1_lens[0]*Math.cos(stage_set1_angles[0]);
        global_y = stage_set1_y[0]+stage_set1_lens[0]*Math.sin(stage_set1_angles[0])+6;
    }
    function xGlobalToLocal(x,stage) {
        return x-stage_global_coords[stage];
    };
    function yGLChange(y, stage, par) {
        par = par||"global2local";
        var sg = -1;
        if (par=="local2global"){
            sg = 1;
        }
        if (stage<2) {
            return y+sg*(stage_set1_y[stage]+stage_set1_lens[stage]*Math.sin(stage_set1_angles[stage]));
        }
        if (stage>2) {
            stage -= 3;
            return y+sg*(stage_set2_y[stage]+stage_set2_lens[stage]*Math.sin(stage_set2_angles[stage]));
        }
        return y+sg*(210+50*Math.sin(bistage_angles[0])+30*Math.sin(bistage_angles[1]));
    };
    function isOnStage(x,y,stage) {
      if (Math.abs(x-stage_global_coords[stage])<21){ //lazy approximation
        if (Math.abs(yGLChange(y, stage, "global2local"))<3){
          return true;
        }
      }
      return false;
    };
    function onStage(x,y) {
      //x,y center of sphere
      for (var i=4; i>-1; i--){
          if (isOnStage(x,y,i)) {
              return i;
          }
      }
      return -1;
    };
    window.requestAnimationFrame(draw);
};
window.onload = setup;
