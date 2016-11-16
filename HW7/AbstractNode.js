/**
 * Created by Dongning Wang on 9/22/2016.
 */
var m4 = twgl.m4;
"use strict";

class AbstractNode {
  constructor(parent, id, shader) {
    if (this.constructor === AbstractNode) {
        throw new TypeError('Abstract class "AbstractNode" cannot be instantiated directly.');
    }
    if (this.getSelfPolygons === undefined) {
        throw new TypeError('Classes extending the AbstractNode abstract class');
    }
    this.id = id;
    this.parent = parent;
    this.shader = shader;

    this.transform = m4.identity();
    this.children = new Map();
  }
  setTransform(transform) {
    //transform relative to parent Node
    this.transform = transform;
  }
  setShader(shader){
    this.shader = shader;
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
  getRoot(){
    if (this.parent){
      return this.parent.getRoot();
    }else {
      return this;
    }
  }

  draw() {
    // console.log(this.id);
    var scene = this.getRoot().getChild('scene');
    if (!scene){
      console.error("No scene was found");
      return;
    }
    var polygons = this.getSelfPolygons();
    if (polygons.length>0) {
      this.shader.gl.useProgram(this.shader.shaderProgram);
      this.shader.render(polygons,this.getTransform(),scene.T_camera,
                          scene.T_proj,scene.lightSrc, scene.camLoc);
    }
    for (var key of this.children.keys()){
      this.children.get(key).draw();
    }
  }
  getChildrenNames() {
    return this.children.keys();
  }
}
