/**
 * Created by Dongning Wang on 10/09/2016.
 */
var m4 = twgl.m4;

class Point{
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.normal = null;
  }

  setNormal(normal) {
    this.normal = normal;
  }

  transform(T) {
    var new_pt = new Point(...m4.transformPoint(T,[this.x,this.y,this.z]));
    new_pt.setNormal(m4.transformNormal(T,this.normal));
    return new_pt;
  }
  mirrorY(){
    return new Point(this.x,-this.y,this.z);
  }
  distanceTo(x,y,z) {
    return Math.sqrt(Math.pow(this.x-x,2)+Math.pow(this.y-y,2)+Math.pow(this.z-z,2))
  }
}
