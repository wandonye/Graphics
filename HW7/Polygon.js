/**
 * Created by Dongning Wang on 10/09/2016.
 */

class Polygon {
  constructor(vertices, color) {
    this.vertices = vertices;
    this.color = color||"#FFFFFF";
  }
  setPolygonNormal(normal) {
    for (var pt of this.vertices) {
      pt.setNormal(normal);
    }
  }
  setImage(image) {
    // use this only for rectangle
    this.image = image;
  }
  getCenter() {
    var x = 0;
    var y = 0;
    var z = 0;
    for (var pt of this.vertices) {
      x += pt.x;
      y += pt.y;
      z += pt.z;
    }
    var n = this.vertices.length;
    return new Point(x/n,y/n,z/n);
  }
  mirrorY() {
    var newVers = [];
    for (var pt of this.vertices){
      newVers.push(pt.mirrorY());
    }
    return new Polygon(newVers, this.image || this.color);
  }
  getCanonicalNormal() {
    if (this.vertices.length<3){
      return null;
    }
    var d1 = this.vertices[0].vectorTo(this.vertices[1]);
    var d2 = this.vertices[1].vectorTo(this.vertices[2]);
    return [d1[1]*d2[2]-d1[2]*d2[1],
              d1[2]*d2[0]-d1[0]*d2[2],
                d1[0]*d2[1]-d1[1]*d2[0]];
  }
  fromArray(a){
    // TODO:
    console.log("todo");
  }
  toArray(){
    // TODO:
    console.log("todo");
    return;
  }
  transform(T) {
    var newVers = [];
    for (var pt of this.vertices){
      newVers.push(pt.transform(T));
    }
    return new Polygon(newVers, this.image || this.color);
  }
}
