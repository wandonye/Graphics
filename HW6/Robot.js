/**
 * Created by Dongning Wang on 9/22/2016.
 */
"use strict";
var m4 = twgl.m4;

class Robot extends gNode {
  constructor(parent, size, location, orientation, speed) {
    super(parent);
    this.location = location || [0,0,0];
    this.orientation = orientation || [0,1,0];
    this.status = 0;
    this._size = size || 1;
    this._increment = speed;

    var body = new Box(this, 100*this._size, 100*this._size, 50*this._size, "#8B0000");
    this.addNode("body", body);

    //head
    var head = new Box(this, 80*this._size, 60*this._size, 50*this._size, "#FFFFFF");
    head.setTransform(m4.translation([0,135*this._size,0]));
    this.addNode("head", head);

    //legs
    var leftLeg = new Box(this, 30*this._size, 100*this._size, 50*this._size, "#63C600");
    var T_lleg = m4.multiply(m4.translation([0,-80*this._size,0]),
                  m4.multiply(m4.rotationX(-this.status/40),
                    m4.translation([-25*this._size,-20*this._size,0])));
    leftLeg.setTransform(T_lleg);
    this.addNode("left_leg", leftLeg);

    var rightLeg = new Box(this, 30*this._size, 100*this._size, 50*this._size, "#63C600");
    var T_rleg = m4.multiply(m4.translation([0,-80*this._size,0]),
                  m4.multiply(m4.rotationX(this.status/40),
                    m4.translation([25*this._size,-20*this._size,0])));
    rightLeg.setTransform(T_rleg);
    this.addNode("right_leg", rightLeg);

    //arms
    var leftArm = new Box(this, 30*this._size, 100*this._size, 50*this._size, "#00C6FF");
    var T_larm = m4.multiply(m4.translation([0,-80*this._size,0]),
                    m4.multiply(m4.rotationX(this.status/40),
                      m4.translation([-65*this._size,80*this._size,0])));
    leftArm.setTransform(T_larm);
    this.addNode("left_arm", leftArm);

    var rightArm = new Box(this, 30*this._size, 100*this._size, 50*this._size, "#00C6FF");
    var T_rarm = m4.multiply(m4.translation([0,-80*this._size,0]),
                    m4.multiply(m4.rotationX(-this.status/40),
                      m4.translation([65*this._size,80*this._size,0])));
    rightArm.setTransform(T_rarm);
    //console.warn(rightArm.parent);
    this.addNode("right_arm", rightArm);
  }
  getSelfPolygons(size){
    return [];
  }
  setSpeed(speed){
    this._increment = speed;
  }
  setLocation(x,y,z) {
    this.location = [x,y,z];
  }
  setOrientation(vector) {
    this.orientation = vector;
  }
  updateStatus() {
    if (Math.abs(this.status)>=20) {
      this._increment = -this._increment;
    }
    this.status += this._increment;

    var T_lleg = m4.multiply(m4.translation([0,-80*this._size,0]),
                  m4.multiply(m4.rotationX(-this.status/40),
                    m4.translation([-30*this._size,-20*this._size,0])));
    this.getChild("left_leg").setTransform(T_lleg);

    var T_rleg = m4.multiply(m4.translation([0,-80*this._size,0]),
                  m4.multiply(m4.rotationX(this.status/40),
                    m4.translation([30*this._size,-20*this._size,0])));
    this.getChild("right_leg").setTransform(T_rleg);

    var T_larm = m4.multiply(m4.translation([0,-80*this._size,0]),
                    m4.multiply(m4.rotationX(this.status/40),
                      m4.translation([-65*this._size,80*this._size,0])));
    this.getChild("left_arm").setTransform(T_larm);

    var T_rarm = m4.multiply(m4.translation([0,-80*this._size,0]),
                    m4.multiply(m4.rotationX(-this.status/40),
                      m4.translation([65*this._size,80*this._size,0])));
    this.getChild("right_arm").setTransform(T_rarm);
  }
}
