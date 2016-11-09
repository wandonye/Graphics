class Node {
  constructor(context, parent) {
    this.context = context;
    this.parent = parent;
    this.children = new Map();
  }
  function transform() {
    //to be over written by subclasses
  }
  function addNode(node_id, node) {
    this.children.set(node_id, node);
  }
  function remove(node_id) {
    this.children.delete(node_id)
  }
  function drawElement() {
    //override this to actually draw something
  }
  function draw() {
    this.context.save();
    this.transform();
    this.drawElement();
    for (var i=0;i<this.children.length;i++){
        this.children[i].draw();
    }
    this.context.restore();
  }
  function listChildrenNames() {
    return this.children.keys();
  }
}
