/**
 * Created by Dongning Wang on 9/22/2016.
 */
"use strict";
var m4 = twgl.m4;

class OBJNode extends AbstractNode {
  constructor(parent, id, shader, objStr) {
    super(parent, id, shader);
    this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    this.indexes = [];
    this.polygons = [];
    this.activeMaterial = null;
    this._parse(objStr);
  }
  
  getSelfPolygons(){
    return this.polygons;
  }

  _parse(str) {
    var lines = str.split("\n");

    var vertices = this.vertices,
      normals = this.normals,
      coords = this.texCoords,
      faces = this.indexes;

    var name = null;

    var i = 0;

    mainloop:
    for(i = 0; i < lines.length;i++){
      var tokens = lines[i].replace(/\s+/g, " ").split(" ")
      var t0 = tokens[0];
      switch(t0){
        case 'g':
          if(name === null){
            name = tokens[1];
          }else{
          //console.log("BREAKING!", tokens);
            break mainloop;
          }
          break;
        case "usemtl":
            this.activeMaterial = tokens[1];
          break;
        case 'v':
          vertices.push([ parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]) ]);
          break;
        case 'vt':
          coords.push([ parseFloat(tokens[1]), parseFloat(tokens[2])]);
          break;
        case 'vn':
          normals.push([ parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]) ]);
          break;
        case 'f':
          var face =  [ tokens[1].split("/"),  tokens[2].split("/"), tokens[3].split("/"), tokens[4].split("/") ];

          var indv = [];

          for(var n = 0; n < face.length;n++){
            var v = face[n]; // like [v,t,n]
            for(var j = 0; j < v.length;j++){
              var str = v[j];
              if(str.length){
                var value = parseInt(str);
                v[j] = (value >= 0)? value - 1 : vertices.length + value;
              }else{
                v[j] = null;
              }
            }

            for(var j = v.length; j < 3;j++){
              v[j] = null;
            }
            indv.push(v);
          }

          for(var k=1; k<indv.length-1; k++){
            this.polygons.push(new Polygon([new Point(vertices[indv[0][0]],normals[indv[0][2]]),
                        new Point(vertices[indv[k][0]],normals[indv[k][2]]),
                        new Point(vertices[indv[k+1][0]],normals[indv[k+1][2]])]));
          }
          faces.push(face);
          break;
      }
    }
  }
}
