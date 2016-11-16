/**
 * Created by Dongning Wang on 10/09/2016.
 */

class Polygon {
  constructor(vertices, color) {
    this.vertices = vertices;
    this.color = color;
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
  transform(T) {
    var newVers = [];
    for (var pt of this.vertices){
      newVers.push(pt.transform(T));
    }
    return new Polygon(newVers, this.image || this.color);
  }
}
