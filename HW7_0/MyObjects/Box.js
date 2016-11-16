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
	  for (var x=-this.x_len/2;x<this.x_len/2;x+=size) {
      for (var y=-this.y_len/2;y<this.y_len/2;y+=size) {
        var back1 = new Polygon([new Point(x,y,-this.z_len/2),
          new Point(Math.min(x+size,this.x_len/2),y,-this.z_len/2),
          new Point(Math.min(x+size,this.x_len/2),Math.min(y+size,this.y_len/2),-this.z_len/2)
        ],
        this.color);
        back1.setPolygonNormal([0,0,-1]);
        polygons.push(back1);

        var back2 = new Polygon([new Point(x,y,-this.z_len/2),
          new Point(Math.min(x+size,this.x_len/2),Math.min(y+size,this.y_len/2),-this.z_len/2),
          new Point(x,Math.min(y+size,this.y_len/2),-this.z_len/2)
        ],
        this.color);
        back2.setPolygonNormal([0,0,-1]);
        polygons.push(back2);

        var front1 = new Polygon([new Point(x,y,this.z_len/2),
          new Point(Math.min(x+size,this.x_len/2),y,this.z_len/2),
          new Point(Math.min(x+size,this.x_len/2),Math.min(y+size,this.y_len/2),this.z_len/2)
        ],
        this.color);
        front1.setPolygonNormal([0,0,1]);
        polygons.push(front1);

        var front2 = new Polygon([new Point(x,y,this.z_len/2),
          new Point(Math.min(x+size,this.x_len/2),Math.min(y+size,this.y_len/2),this.z_len/2),
          new Point(x,Math.min(y+size,this.y_len/2),this.z_len/2)
        ],
        this.color);
        front2.setPolygonNormal([0,0,1]);
        polygons.push(front2);
      }
    }
    for (var x=-this.x_len/2;x<this.x_len/2;x+=size) {
      for (var z=-this.z_len/2;z<this.z_len/2;z+=size) {
        var bottom1 = new Polygon([new Point(x,-this.y_len/2,z),
          new Point(Math.min(x+size,this.x_len/2),-this.y_len/2,z),
          new Point(Math.min(x+size,this.x_len/2),-this.y_len/2,Math.min(z+size,this.z_len/2)),
        ],
        this.color);
        bottom1.setPolygonNormal([0,-1,0]);
        polygons.push(bottom1);

        var bottom2 = new Polygon([new Point(x,-this.y_len/2,z),
          new Point(Math.min(x+size,this.x_len/2),-this.y_len/2,Math.min(z+size,this.z_len/2)),
          new Point(x,-this.y_len/2,Math.min(z+size,this.z_len/2)),
        ],
        this.color);
        bottom2.setPolygonNormal([0,-1,0]);
        polygons.push(bottom2);

        var top1 = new Polygon([new Point(x,this.y_len/2,z),
          new Point(Math.min(x+size,this.x_len/2),this.y_len/2,z),
          new Point(Math.min(x+size,this.x_len/2),this.y_len/2,Math.min(z+size,this.z_len/2))
        ],
        this.color);
        top1.setPolygonNormal([0,1,0]);
        polygons.push(top1);

        var top2 = new Polygon([new Point(x,this.y_len/2,z),
          new Point(Math.min(x+size,this.x_len/2),this.y_len/2,Math.min(z+size,this.z_len/2)),
          new Point(x,this.y_len/2,Math.min(z+size,this.z_len/2))
        ],
        this.color);
        top2.setPolygonNormal([0,1,0]);
        polygons.push(top2);
      }
    }

    for (var y=-this.y_len/2;y<this.y_len/2;y+=size) {
      for (var z=-this.z_len/2;z<this.z_len/2;z+=size) {
        var left1 = new Polygon([new Point(-this.x_len/2,y,z),
          new Point(-this.x_len/2,y,Math.min(z+size,this.z_len/2)),
          new Point(-this.x_len/2,Math.min(y+size,this.y_len/2),Math.min(z+size,this.z_len/2)),
        ],
        this.color);
        left1.setPolygonNormal([-1,0,0]);
        polygons.push(left1);

        var left2 = new Polygon([new Point(-this.x_len/2,y,z),
          new Point(-this.x_len/2,Math.min(y+size,this.y_len/2),Math.min(z+size,this.z_len/2)),
          new Point(-this.x_len/2,Math.min(y+size,this.y_len/2),z)
        ],
        this.color);
        left2.setPolygonNormal([-1,0,0]);
        polygons.push(left2);

        var right1 = new Polygon([new Point(this.x_len/2,y,z),
          new Point(this.x_len/2,y,Math.min(z+size,this.z_len/2)),
          new Point(this.x_len/2,Math.min(y+size,this.y_len/2),Math.min(z+size,this.z_len/2)),
        ],
        this.color);
        right1.setPolygonNormal([1,0,0]);
        polygons.push(right1);

        var right2 = new Polygon([new Point(this.x_len/2,y,z),
          new Point(this.x_len/2,Math.min(y+size,this.y_len/2),Math.min(z+size,this.z_len/2)),
          new Point(this.x_len/2,Math.min(y+size,this.y_len/2),z)
        ],
        this.color);
        right2.setPolygonNormal([1,0,0]);
        polygons.push(right2);
      }
    }
    return [[polygons,this.transform]];
  }
}
