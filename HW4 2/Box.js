/**
 * Created by Dongning Wang on 10/09/2016.
 */
"use strict";

var m4 = twgl.m4;

class Box extends gNode {
  constructor(parent, x_len, y_len, z_len, color){
    super(parent);
    //a box defined by [0,0,0] and [x_len, y_len, z_len]
    this.x_len = x_len;
    this.y_len = y_len;
    this.z_len = z_len;
    this.color = color;
  }
  getSelfPolygons(size) {
    //override this to actually draw something
    var polygons = [];
    var Tw = this.transform;
	  for (var x=-this.x_len/2;x<this.x_len/2;x+=size) {
      for (var y=-this.y_len/2;y<this.y_len/2;y+=size) {
        polygons.push(
          new Polygon([new Point(x,y,-this.z_len/2).transform(Tw),
            new Point(Math.min(x+size,this.x_len/2),y,-this.z_len/2).transform(Tw),
            new Point(Math.min(x+size,this.x_len/2),Math.min(y+size,this.y_len/2),-this.z_len/2).transform(Tw),
            new Point(x,Math.min(y+size,this.y_len/2),-this.z_len/2).transform(Tw)
          ],
          this.color));
        polygons.push(
          new Polygon([new Point(x,y,this.z_len/2).transform(Tw),
            new Point(Math.min(x+size,this.x_len/2),y,this.z_len/2).transform(Tw),
            new Point(Math.min(x+size,this.x_len/2),Math.min(y+size,this.y_len/2),this.z_len/2).transform(Tw),
            new Point(x,Math.min(y+size,this.y_len/2),this.z_len/2).transform(Tw)
          ],
          this.color));
      }
    }
    for (var x=-this.x_len/2;x<this.x_len/2;x+=size) {
      for (var z=-this.z_len/2;z<this.z_len/2;z+=size) {
        polygons.push(
          new Polygon([new Point(x,-this.y_len/2,z).transform(Tw),
            new Point(Math.min(x+size,this.x_len/2),-this.y_len/2,z).transform(Tw),
            new Point(Math.min(x+size,this.x_len/2),-this.y_len/2,Math.min(z+size,this.z_len/2)).transform(Tw),
            new Point(x,-this.y_len/2,Math.min(z+size,this.z_len/2)).transform(Tw),
          ],
          this.color));
        polygons.push(
          new Polygon([new Point(x,this.y_len/2,z).transform(Tw),
            new Point(Math.min(x+size,this.x_len/2),this.y_len/2,z).transform(Tw),
            new Point(Math.min(x+size,this.x_len/2),this.y_len/2,Math.min(z+size,this.z_len/2)).transform(Tw),
            new Point(x,this.y_len/2,Math.min(z+size,this.z_len/2)).transform(Tw)
          ],
          this.color));
      }
    }

    for (var y=-this.y_len/2;y<this.y_len/2;y+=size) {
      for (var z=-this.z_len/2;z<this.z_len/2;z+=size) {
        polygons.push(
          new Polygon([new Point(-this.x_len/2,y,z).transform(Tw),
            new Point(-this.x_len/2,y,Math.min(z+size,this.z_len/2)).transform(Tw),
            new Point(-this.x_len/2,Math.min(y+size,this.y_len/2),Math.min(z+size,this.z_len/2)).transform(Tw),
            new Point(-this.x_len/2,Math.min(y+size,this.y_len/2),z).transform(Tw)
          ],
          this.color));
        polygons.push(
          new Polygon([new Point(this.x_len/2,y,z).transform(Tw),
            new Point(this.x_len/2,y,Math.min(z+size,this.z_len/2)).transform(Tw),
            new Point(this.x_len/2,Math.min(y+size,this.y_len/2),Math.min(z+size,this.z_len/2)).transform(Tw),
            new Point(this.x_len/2,Math.min(y+size,this.y_len/2),z).transform(Tw)
          ],
          this.color));
      }
    }
    return polygons;
  }
}
