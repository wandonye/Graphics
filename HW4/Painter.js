
"use strict";
class Painter {
  constructor(context){
    this.context = context;
  	this.list = [];
    this.camLoc = [100,-100,100];
    this.camOrientation = [0,1,0];
    this.zoom = 1;
    this.T_camera = m4.inverse(m4.lookAt(this.camLoc,[0,0,0],this.camOrientation));
    this.T_viewport = m4.scaling([this.zoom,this.zoom,this.zoom]);
  }

  setCameraLocation(x,y,z){
    this.camLoc = [x,y,z];
    this.camDistance = Math.sqrt(x*x+y*y+z*z);
    this.T_camera = m4.inverse(m4.lookAt(this.camLoc,[0,0,0],this.camOrientation));
  }
  setZoom(zoom){
    this.zoom = zoom;
    this.T_viewport = m4.scaling([this.zoom,this.zoom,this.zoom]);
  }
  clearPolygons(){
    this.list = [];
  }

  setBackgroundImage(image){
    this.backgroundImg = image;
  }

  clearPolygons(){
	  this.list = [];
  }

  addPolygon(polygon, colorDepth, showMirror){
    var camPolygon = polygon.transform(this.T_camera).transform(this.T_viewport);
    var center = camPolygon.getCenter();
    camPolygon.color = this.shadeColor(polygon.color, -(900+center.z/this.zoom)/100*colorDepth);
  	this.list.push(camPolygon);
    if (showMirror){
      var mirroPoly = polygon.mirrorY().transform(this.T_camera).transform(this.T_viewport);
      mirroPoly.color = camPolygon.color
      this.list.push(mirroPoly);
    }
  }

  drawWireFrames(){
  	for(var polygon of this.list){
  		this.draw(polygon, false, false);
  	}
  }

  // from http://tulrich.com/geekstuff/canvas/jsgl.js
  drawImage(im, x0, y0, x1, y1, x2, y2,
      sx0, sy0, sx1, sy1, sx2, sy2) {
      this.context.save();
      // Clip the output to the on-screen triangle boundaries.
      this.context.beginPath();
      this.context.moveTo(x0, y0);
      this.context.lineTo(x1, y1);
      this.context.lineTo(x2, y2);
      this.context.closePath();
      this.context.clip();
      var denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
      if (denom == 0) {
          return;
      }
      var m11 = -(sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
      var m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
      var m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
      var m22 = -(sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
      var dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
      var dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;
      this.context.transform(m11, m12, m21, m22, dx, dy);
      this.context.drawImage(im, 0, 0);
      this.context.restore();
  };

  divideBackground(image) {
  	// clear triangles out
  	var triangles = [];
  	// generate subdivision
  	var subs = 7; // vertical subdivisions
  	var divs = 7; // horizontal subdivisions
  	var p1 = (new Point(-200,0,-200)).transform(this.T_camera);
  	var p2 = (new Point(-200,0,200)).transform(this.T_camera);
  	var p3 = (new Point(200,0,200)).transform(this.T_camera);
  	var p4 = (new Point(200,0,-200)).transform(this.T_camera);

  	var dx1 = p4.x - p1.x;
  	var dy1 = p4.y - p1.y;
  	var dx2 = p3.x - p2.x;
  	var dy2 = p3.y - p2.y;

  	var imgW = image.naturalWidth;
  	var imgH = image.naturalHeight;

  	for (var sub = 0; sub < subs; ++sub) {
  		var curRow = sub / subs;
  		var nextRow = (sub + 1) / subs;

  		var curRowX1 = p1.x + dx1 * curRow;
  		var curRowY1 = p1.y + dy1 * curRow;

  		var curRowX2 = p2.x + dx2 * curRow;
  		var curRowY2 = p2.y + dy2 * curRow;

  		var nextRowX1 = p1.x + dx1 * nextRow;
  		var nextRowY1 = p1.y + dy1 * nextRow;

  		var nextRowX2 = p2.x + dx2 * nextRow;
  		var nextRowY2 = p2.y + dy2 * nextRow;

  		for (var div = 0; div < divs; ++div) {
  			var curCol = div / divs;
  			var nextCol = (div + 1) / divs;

  			var dCurX = curRowX2 - curRowX1;
  			var dCurY = curRowY2 - curRowY1;
  			var dNextX = nextRowX2 - nextRowX1;
  			var dNextY = nextRowY2 - nextRowY1;

  			var p1x = curRowX1 + dCurX * curCol;
  			var p1y = curRowY1 + dCurY * curCol;

  			var p2x = curRowX1 + (curRowX2 - curRowX1) * nextCol;
  			var p2y = curRowY1 + (curRowY2 - curRowY1) * nextCol;

  			var p3x = nextRowX1 + dNextX * nextCol;
  			var p3y = nextRowY1 + dNextY * nextCol;

  			var p4x = nextRowX1 + dNextX * curCol;
  			var p4y = nextRowY1 + dNextY * curCol;

  			var u1 = curCol * imgW;
  			var u2 = nextCol * imgW;
  			var v1 = curRow * imgH;
  			var v2 = nextRow * imgH;

  			var triangle1 = [
          [p1x, p1y],[p3x, p3y],[p4x, p4y],
          [u1, v1],[u2, v2],[u1, v2]
        ];
        var triangle2 = [
          [p1x, p1y],[p2x, p2y],[p3x, p3y],
          [u1, v1],[u2, v1],[u2, v2]
        ];

  			triangles.push(triangle1);
  			triangles.push(triangle2);
  		}
  	}
    return triangles;
  }

  drawBackground(image){
    for (var triangle of this.divideBackground(image)) {
      this.drawImage(image, triangle[0][0], triangle[0][1],
        triangle[1][0], triangle[1][1], triangle[2][0], triangle[2][1],
        triangle[3][0], triangle[3][1], triangle[4][0], triangle[4][1],
        triangle[5][0], triangle[5][1]);
  	}
  }

  draw(polygon, shouldFill, hasGrid){
    //this.drawBackground(this.backgroundImg);
  	this.context.fillStyle = polygon.color;
    if (hasGrid) {
      this.context.strokeStyle = polygon.color;
    }
    this.context.beginPath();
    this.context.moveTo(polygon.vertices[0].x+200, -polygon.vertices[0].y+200);
    for (var i=1; i<polygon.vertices.length; i++){
      this.context.lineTo(polygon.vertices[i].x+200, -polygon.vertices[i].y+200);
    }
    this.context.closePath();
    if(shouldFill){
      this.context.fill();
    }
  	this.context.stroke();
  }

  compare(a, b){
  	if(a.getCenter().z > b.getCenter().z){
      return -1;
    }else{
      return 1;
    }
  }

  shadeColor(color, percent) {
    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);
    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);
    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;
    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    return "#"+RR+GG+BB;
  }

  render(shouldSort, hasGrid){
  	if(shouldSort){
  		this.list.sort(this.compare);
  	}
  	for(var i = 0; i< this.list.length; i++){
  		this.draw(this.list[i], true, hasGrid);
  	}
  }
}
