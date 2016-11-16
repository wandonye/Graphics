/**
 * Created by Dongning Wang on 10/09/2016.
 */
"use strict";

class Scene extends AbstractNode {
  constructor(parent, shader, lightSrc, camLoc, lookAt, camUp){
    super(parent, "scene", shader);
    this.camLoc = [100,100,400];
    this.lookAt = lookAt||[0,0,0];
    this.camUp = camUp||[0,1,0];
    this.lightSrc = [0,1,10];

    this.zoom = 1;
    this.T_camera = m4.inverse(m4.lookAt(this.camLoc,this.lookAt,this.camUp));
    this.T_proj = m4.perspective(Math.PI/3,1,10,2000);
    this.T_viewport = m4.scaling([this.zoom,this.zoom,this.zoom]);

    var ground = new Box(this, "ground", shader, 1000, 2, 1000, "#FFFFFF");
    ground.transform = m4.translation([0,-80,0]);
    this.addNode("ground", ground);
  }
  setLightSource(lightSrc){
    this.lightSrc = lightSrc;
  }
  setProjection(T){
    this.T_proj = T;
  }
  setCameraLocation(x,y,z){
    this.camLoc = [x,y,z];
    this.T_camera = m4.inverse(m4.lookAt(this.camLoc,this.lookAt,this.camUp));
  }
  setCameraTransformation(T){
    this.T_camera = T;
  }
  setZoom(zoom){
    this.zoom = zoom;
    this.T_viewport = m4.scaling([this.zoom,this.zoom,this.zoom]);
  }
  getSelfPolygons() {
    //override this to actually draw something
    return [];
  }
}
