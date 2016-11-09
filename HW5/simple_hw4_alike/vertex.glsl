precision highp float;
attribute vec3 position;
attribute vec3 normal;
uniform mat3 normalMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec3 fNormal;
varying vec3 fPosition;
varying vec4 fColor;
varying vec3 modelP;
uniform float time;


void main()
{
  bool isEye = (pow(position.x-0.32,2.0)+pow(position.y-0.23,2.0))<0.01||(pow(position.x+0.32,2.0)+pow(position.y-0.23,2.0))<0.01;
  if (isEye && position.z>0.0)
  {
    fColor = vec4(1.0,0,0, 1.0);
  }
  else{
    fColor = vec4(0,1,1, 1.0);
  }

  modelP = (1.0 + 0.5*cos(time * 10.0))*position;

  fNormal = normalize(normalMatrix * normal);
  vec4 pos = modelViewMatrix * vec4(modelP, 1.0);
  gl_Position = projectionMatrix * pos;
  fPosition = gl_Position.xyz;
}
