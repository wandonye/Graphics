precision highp float;
attribute vec3 position;
attribute vec3 normal;
uniform mat3 normalMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec3 fNormal;
uniform float time;
varying vec3 modelP;
varying vec3 modelN;
varying vec3 rawP;
varying vec3 rawN;
varying vec3 fPosition;
const float frequence = 10.0;
varying float juliaIntensity;


void main()
{
  rawP=position;
  rawN = normal;
  juliaIntensity = (1.0 + 0.5*cos(time * frequence));
  modelP = juliaIntensity*position;

  fNormal = normalize(normalMatrix * normal);
  vec4 pos = modelViewMatrix * vec4(modelP, 1.0);
  fPosition = pos.xyz;
  gl_Position = projectionMatrix * pos;
}
