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
    // if (parent) {
    //   this.transform = parent.transform;
    // }else {
    //   this.transform = m4.identity();
    // }
    this.transform = m4.identity();
    this.children = new Map();
  }
  setTransform(transform) {
    //transform relative to parent Node
    this.transform = transform;
  }
  getTransform(){
    // return this.transform;
    if (this.parent){
      return m4.multiply(this.transform,this.parent.getTransform());
    }else {
      return this.transform;
    }
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
  // getChildrenPolygons(size) {
  //   var polygons = [];
  //   for (var key of this.children.keys()){
  //     var p_list=this.children.get(key).getPolygons(size);
  //
  //     for (var j=0;j<p_list.length;j++){
  //       polygons.push(p_list[j].transform(this.transform));
  //       // polygons.push([p_list[j],this.transform]);
  //     }
  //   }
  //   return polygons;
  // }
  getPolygons(size) {
    // return [...this.getSelfPolygons(size),...this.getChildrenPolygons(size)];
    var polygons = this.getSelfPolygons(size);
    for (var key of this.children.keys()){
      var res = this.children.get(key).getPolygons(size);
      for (var res_each of res) {
        console.log(key);
        console.log(res_each[1]);
        console.log(this.transform);
        polygons.push([res_each[0],m4.multiply(res_each[1],this.transform)]);
      }
    }
    return polygons;
  }
  getChildrenNames() {
    return this.children.keys();
  }
}
