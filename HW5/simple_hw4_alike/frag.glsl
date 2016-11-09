precision highp float;
uniform float time;
uniform vec2 resolution;
varying vec3 fPosition;
varying vec3 fNormal;
varying vec4 fColor;


void main()
{
  gl_FragColor = fColor*pow(3.0,3.0-abs(fPosition.z));
}
