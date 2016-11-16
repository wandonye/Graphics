/**
 * Created by Dongning Wang on 9/22/2016.
 */
"use strict";
var m4 = twgl.m4;

class Tree extends AbstractNode {
  constructor(parent, id, shader) {
    super(parent, id, shader);

    var ninty = Math.PI/2;
    var cone1 = new Simplex(this, "cone1", shader,"#228B22");
    this.addNode("cone1", cone1);

    var cone2 = new Simplex(this, "cone2", shader,"#228B22");
    cone2.setTransform(m4.rotationY(ninty));
    this.addNode("cone2", cone2);

    var cone3 = new Simplex(this, "cone3", shader,"#228B22");
    cone3.setTransform(m4.rotationY(ninty*2));
    this.addNode("cone3", cone3);

    var cone4 = new Simplex(this, "cone4", shader,"#228B22");
    cone4.setTransform(m4.rotationY(ninty*3));
    this.addNode("cone4", cone4);

    var cone5 = new Simplex(this, "cone5", shader,"#228B22");
    cone5.setTransform(m4.translation([0,0.7,0]));
    this.addNode("cone5", cone5);

    var cone6 = new Simplex(this, "cone6", shader,"#228B22");
    cone6.setTransform(m4.multiply(m4.rotationY(ninty),m4.translation([0,0.7,0])));
    this.addNode("cone6", cone6);

    var cone7 = new Simplex(this, "cone7", shader,"#228B22");
    cone7.setTransform(m4.multiply(m4.rotationY(ninty*2),m4.translation([0,0.7,0])));
    this.addNode("cone7", cone7);

    var cone8 = new Simplex(this, "cone8", shader,"#228B22");
    cone8.setTransform(m4.multiply(m4.rotationY(ninty*3),m4.translation([0,0.7,0])));
    this.addNode("cone8", cone8);

    var trunk = new Box(this, "trunk", shader, 0.2,2, 0.2, "#996633")
    this.addNode("trunk", trunk);

  }
  getSelfPolygons(size){
    return [];
  }

}
