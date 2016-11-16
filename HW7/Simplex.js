/**
 * Created by Dongning Wang on 10/09/2016.
 */
"use strict";

class Simplex extends AbstractNode {
  constructor(parent, id, shader, color){
    super(parent, id, shader);
    //color can be overriden by shader
    this.color = color||"#FFFFFF";
  }
  getSelfPolygons() {
    //override this to actually draw something
    var vertexPos = [
         0.0, 0.0, 0.0,    // triangle 1
         1.0, 0.0,  0.0,
         0.0, 0.0, 1.0,
         0.0, 0.0, 1.0,    // triangle 2
         0.0, 1.0,  0.0,
         0.0, 0.0, 0.0,
         0.0, 0.0,  0.0,    // triangle 3
         0.0, 1.0,  0.0,
         1.0, 0.0,  0.0,
         0.0, 1.0,  0.0,    // triangle 4
         0.0, 0.0,  1.0,
         1.0, 0.0,  0.0,
    ];
    // make each triangle be a slightly different color - but each triangle is a solid color
    // var vertexColors = [
    //     0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,    // tri 1 = yellow
    //     0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,    // tri 2 = cyan
    //     0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,    // tri 3 = magenta
    //     0.5, 0.9, 0.5,   0.5, 0.9, 0.5,   0.5, 0.9, 0.5,    // tri 4 = green
    // ];
    var polygons = [];

    for (var i=0; i<36; i+=9){
      var face = new Polygon([new Point(vertexPos[i],vertexPos[i+1],vertexPos[i+2]),
        new Point(vertexPos[i+3],vertexPos[i+4],vertexPos[i+5]),
        new Point(vertexPos[i+6],vertexPos[i+7],vertexPos[i+8])
      ],
      this.color);
      var normal = face.getCanonicalNormal();
      face.setPolygonNormal(normal);
      polygons.push(face);
    }
    return polygons;
  }
}
