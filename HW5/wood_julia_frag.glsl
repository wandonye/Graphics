precision highp float;
varying vec3 fNormal;
uniform float time;
varying vec3 rawP;
varying vec3 rawN;
varying vec3 fPosition;
const float frequence = 10.0;
//for julia set
const int iter = 40;
const vec2 c = vec2(0,0.8);
varying float juliaIntensity;
//for wood texture
const vec3 LightWood = vec3(0.6, 0.3, 0.1);
const	vec3 DarkWood = vec3(0.4, 0.2, 0.07);
const  vec3 Gold = vec3(0.4, 0.2, 0.07);
const float shininess = 0.5;

vec3 camera = vec3(0.0, 0.0, 1.0);


void main()
{

  vec3 aColor = vec3(0.15,0.15,0.15);//ambient light color
  vec3 lightSrc = vec3(100,0,100);//light1 direction
  vec3 lightColor = vec3(0.3,0.3,0.3);//light1 color

  vec3 objColor;
  vec3 specColor;

  float radius = sqrt(rawP.x * rawP.x + rawP.z * rawP.z);
  float rf = fract(radius*20.0)*2.0;
  if (rf > 1.0) {
  	rf = 2.0 - rf;
	}
  vec3 woodColor = mix(LightWood, DarkWood, rf);

  float diff_intensity = dot(fNormal,normalize(lightSrc));
  vec3 reflection = reflect(-lightSrc, fNormal);
  float spec_intensity = 0.00004*pow(max(dot(reflection, normalize(camera-fPosition)), 0.0), 2.0);

  objColor = diff_intensity*woodColor+spec_intensity*lightColor;

  //generate julia set
  int j1;
  int j2;
  vec3 juliaColor;
  vec2 z = rawP.xy;

  for (int i=0; i<iter; i++) {
    j1 = i;
    float x = (z.x * z.x - z.y * z.y) + c.x;
    float y = (z.y * z.x + z.x * z.y) + c.y;

    if((x * x + y * y) > 10.0) break;
    z.x = x;
    z.y = y;
  }


  z = rawP.yz;

  for (int i=0; i<iter; i++) {
    j2 = i;
    float x = (z.x * z.x - z.y * z.y) + c.x;
    float y = (z.y * z.x + z.x * z.y) + c.y;

    if((x * x + y * y) > 10.0) break;
    z.x = x;
    z.y = y;
  }

  if (j1+1==iter||j2+1==iter) {
    juliaColor =  diff_intensity*objColor+2.0*spec_intensity*lightColor;
  }else {
    juliaColor = objColor;
  }

	gl_FragColor = vec4(aColor + mix(objColor,juliaColor,juliaIntensity-0.5),1.0);

}
