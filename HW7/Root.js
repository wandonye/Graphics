/**
 * Created by Dongning Wang on 10/09/2016.
 */
"use strict";

var m4 = twgl.m4;

class Root extends AbstractNode {
  constructor(parent, shader){
    super(parent, "Root", shader);
  }
  getSelfPolygons() {
    //override this to actually draw something
    return [];
  }
}
