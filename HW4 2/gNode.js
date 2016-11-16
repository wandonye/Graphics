/**
 * Created by Dongning Wang on 9/22/2016.
 */
var m4 = twgl.m4;
"use strict";

class gNode {
  constructor(parent) {
    if (this.constructor === gNode) {
        throw new TypeError('Abstract class "gNode" cannot be instantiated directly.');
    }
    if (this.getSelfPolygons === undefined) {
        throw new TypeError('Classes extending the gNode abstract class');
    }
    this.parent = parent;
    if (parent) {
      this.transform = parent.transform;
    }else {
      this.transform = m4.identity();
    }
    this.children = new Map();
  }
  setTransform(transform) {
    //transform relative to parent Node
    this.transform = transform;
  }
  addNode(node_id, node) {
    this.children.set(node_id, node);
  }
  remove(node_id) {
    this.children.delete(node_id);
  }
  getChild(node_id) {
    return this.children.get(node_id);
  }
  getChildrenPolygons(size) {
    var polygons = [];
    for (var key of this.children.keys()){
      var p_list=this.children.get(key).getPolygons(size);

      for (var j=0;j<p_list.length;j++){
        polygons.push(p_list[j].transform(this.transform));
      }
    }
    return polygons;
  }
  getPolygons(size) {
    return [...this.getSelfPolygons(size),...this.getChildrenPolygons(size)];
  }
  getChildrenNames() {
    return this.children.keys();
  }
}
