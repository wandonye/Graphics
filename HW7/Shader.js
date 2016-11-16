
"use strict";
class Shader {
  constructor(context, gl, vertexSource, fragmentSource){
    this.gl = gl;
    this.context = context;

    this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.shaderProgram = this.gl.createProgram();

    // Attach the shaders and link
    this.setShaderProgram(vertexSource, fragmentSource);
    this.setDefaultPCNI();
  }
  setVertexSource(vertexSource){
    this.gl.shaderSource(this.vertexShader,vertexSource);
    this.gl.compileShader(this.vertexShader);
    if (!this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS)) {
      alert(this.gl.getShaderInfoLog(this.vertexShader)); return null; }
  }
  setFragmentSource(fragmentSource){
    this.gl.shaderSource(this.fragmentShader,fragmentSource);
    this.gl.compileShader(this.fragmentShader);
    if (!this.gl.getShaderParameter(this.fragmentShader, this.gl.COMPILE_STATUS)) {
      alert(this.gl.getShaderInfoLog(this.fragmentShader)); return null; }
  }
  setShaderProgram(vertexSource,fragmentSource){
    // Compile vertex shader
    this.setVertexSource(vertexSource);
    // Compile fragment shader
    this.setFragmentSource(fragmentSource);

    this.gl.attachShader(this.shaderProgram, this.vertexShader);
    this.gl.attachShader(this.shaderProgram, this.fragmentShader);
    this.gl.linkProgram(this.shaderProgram);
    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      alert("Could not initialize shaders"); }
    this.gl.useProgram(this.shaderProgram);

    // with the vertex shader, we need to pass it positions
    // as an attribute - so set up that communication
    this.PositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "position");
    this.gl.enableVertexAttribArray(this.PositionAttribute);

    this.ColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "color");
    this.gl.enableVertexAttribArray(this.ColorAttribute);

    this.NormalAttribute = this.gl.getAttribLocation(this.shaderProgram, "normal");
    this.gl.enableVertexAttribArray(this.NormalAttribute);

    // this gives us access to the matrix uniform
    this.lightSrcBuffer = this.gl.getUniformLocation(this.shaderProgram,"lightSrc");
    this.camPosBuffer = this.gl.getUniformLocation(this.shaderProgram,"camera");
    this.MVPmatrix = this.gl.getUniformLocation(this.shaderProgram,"uMVP");
    this.MVmatrix = this.gl.getUniformLocation(this.shaderProgram,"modelViewMatrix");
    this.Pmatrix = this.gl.getUniformLocation(this.shaderProgram,"projectionMatrix");
    this.Nmatrix = this.gl.getUniformLocation(this.shaderProgram,"normalMatrix");
    this.time = this.gl.getUniformLocation(this.shaderProgram,"time");
  }
  setDefaultPCNI(){
    this.vertexPos = new Float32Array([
          1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,
           1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,
           1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,
          -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,
          -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,
           1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]);
    this.vertexColors = new Float32Array(
      [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
           1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
           1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
           0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1 ]
    );
    this.vertexNormal = new Float32Array([
          1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,
           1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,
           1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,
          -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,
          -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,
           1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]);
    this.triangleIndices = new Uint8Array(
      [  0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,    // top
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // bottom
        20,21,22,  20,22,23 ]); // back

    this.trianglePosBuffer = this.gl.createBuffer();
    this.bindPosition();
    this.triangleNormalBuffer = this.gl.createBuffer();
    this.bindNormal();
    this.colorBuffer = this.gl.createBuffer();
    this.bindColor();
    // a buffer for indices
    this.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.triangleIndices, this.gl.STATIC_DRAW);
  }

  parseColor(color) {
    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);
    return [R/255.0,G/255.0,B/255.0];
  }
  setPolygons(polygons){
    if (polygons.length==0) {return;}
    this.vertexPos = new Float32Array(polygons.length*9);
    this.vertexColors = new Float32Array(polygons.length*9);
    this.vertexNormal = new Float32Array(polygons.length*9);
    // this.triangleIndices = new Float32Array(polygons.length*9);
    var cnt = 0;
    for (var j=0; j<polygons.length; j++){
      var p_color = this.parseColor(polygons[j].color);

      for (var pt of polygons[j].vertices){
        this.vertexNormal.subarray(cnt,cnt+3).set(pt.normal);
        this.vertexPos.subarray(cnt,cnt+3).set([pt.x,pt.y,pt.z]);
        this.vertexColors.subarray(cnt,cnt+3).set(p_color);
        cnt += 3;
      }
    }
    
    this.bindPosition();
    this.bindNormal();
    this.bindColor();
  }
  bindNormal(){
    //buffer for normal
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleNormalBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexNormal, this.gl.STATIC_DRAW);
    this.triangleNormalBuffer.itemSize = 3;
    this.triangleNormalBuffer.numItems = this.vertexNormal.length/3;
    this.gl.vertexAttribPointer(this.NormalAttribute, this.triangleNormalBuffer.itemSize,
    this.gl.FLOAT, false, 0, 0);
  }
  bindPosition(){
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.trianglePosBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexPos, this.gl.STATIC_DRAW);
    this.trianglePosBuffer.itemSize = 3;
    this.trianglePosBuffer.numItems = this.vertexPos.length/3;
    this.gl.vertexAttribPointer(this.PositionAttribute, this.trianglePosBuffer.itemSize,
    this.gl.FLOAT, false, 0, 0);
  }
  bindColor(){
    // a buffer for colors
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexColors, this.gl.STATIC_DRAW);
    this.colorBuffer.itemSize = 3;
    this.colorBuffer.numItems = this.colorBuffer.length/3;
    this.gl.vertexAttribPointer(this.ColorAttribute, this.colorBuffer.itemSize,
      this.gl.FLOAT, false, 0, 0);
  }
  render(polygons,T_model,T_camera,T_proj,lightSrc, cam){
    var tMV = m4.multiply(T_model,T_camera);
    var tMVP = m4.multiply(tMV,T_proj);
    var tN = m4.inverse(m4.transpose(tMV));
    var d = new Date();
    var t = d.getTime();

    // Set up uniforms & attributes
    this.gl.uniform3fv(this.lightSrcBuffer,lightSrc);
    this.gl.uniform3fv(this.camPosBuffer,cam);
    this.gl.uniformMatrix4fv(this.MVPmatrix,false,tMVP);
    this.gl.uniformMatrix4fv(this.MVmatrix,false,tMV);
    this.gl.uniformMatrix4fv(this.Pmatrix,false,T_proj);
    this.gl.uniformMatrix4fv(this.Nmatrix,false,tN);
    this.gl.uniform1f(this.time,false,t);

    this.setPolygons(polygons);
    // Do the drawing
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.trianglePosBuffer.numItems);
    //this.gl.drawElements(this.gl.TRIANGLES, this.triangleIndices.length, this.gl.UNSIGNED_BYTE, 0);
  }
}
