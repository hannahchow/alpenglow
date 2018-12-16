#version 330 core

in vec3 color;
in vec2 texc;
in vec2 uv;
out vec4 fragColor;

uniform float sunPosition;
uniform bool normalMapping;
uniform float snowHieght;
uniform float snowAmount;
uniform int octaves;
uniform sampler2D tex;
uniform int useTexture = 0;
uniform vec2 resolution;
uniform float iTime;
uniform float cameraPosition;

vec3 light = normalize(vec3(sin(sunPosition/99.f*2)*50, sin(sunPosition/99.f*2)*200-50, sin(sunPosition/99.f*2-1)*100));
float rrr = clamp(sin(sunPosition/99.f*2)*40, 0.0, 1.0);
float ggg = clamp(sin(sunPosition/99.f*2)*30, 0.0, 0.5);
float bbb = 0.2;

const float dMax = 10.0;

float rand(vec2 p) {
        return fract(sin(dot(p, vec2(12.231,64.102))) * 63360.01203);
}


float noise(vec2 p) {
    float A = rand(vec2(floor(p.x), floor(p.y)));
    float B = rand(vec2(floor(p.x) + 1.0, floor(p.y)));
    float C = rand(vec2(floor(p.x), floor(p.y) + 1.0));
    float D = rand(vec2(floor(p.x) + 1.0, floor(p.y) + 1.0));

    float fc = fract(p.x);
    float bicubicc = fc * fc * (3.0 - 2.0 * fc);

    float fr = fract(p.y);
    float bicubicr = fr * fr * (3.0 - 2.0 * fr);

    float AB = mix(A, B, bicubicc);
    float CD = mix(C, D, bicubicc);

    float final = mix(AB, CD, bicubicr);

    return final;
}


float overlay(float x, float y)
{
    if (x < 0.5)
        return 2.0*x*y;
    else
        return 1.0 - 2.0*(1.0 - x)*(1.0 - y);
}

vec3 blend(vec3 n1, vec3 n2){
    float factor = 0.05;
    return normalize(vec3(mix(n1.xy, n2.xy, factor), mix(n1.z, n2.z, 0.45-factor)));
}

float heightmap(vec3 p) {

    float dMin = dMax; // nearest intersection
    float d; // depth
    float material = -1.0; // material ID

    // adding octaves of height
    float h = 0.0; // height
    float w = 0.5; // octave weight
    float m = 0.4; // octave multiplier

    //iterating through 10 octaves of height
    for (int i=0; i < octaves; i++) {
        h += w * noise(p.xz * m);
        w *= 0.5;
        m *= 2.0;
    }

    //makes a more mountainous look
    h += smoothstep(0.1, 1.0, h);

    d = p.y - h;
    if (d<dMin) {
        dMin = d;
        material = 0.0;
    }
    return dMin;
}

vec3 sampleTexture( sampler2D sam, in vec3 p, in vec3 n){
    return(abs(n.x)*texture(sam, p.yz) + abs(n.y)*texture(sam, p.xz) + abs(n.z)*texture(sam, p.xy)).xyz;
}

const float epsilon = 0.001;
vec2 e = vec2(epsilon, 0.0); // For swizzling
vec3 calcNormal(vec3 p) {
    float x = heightmap(p - e.xyy) - heightmap(p + e.xyy);
    float y = 2.0*epsilon;
    float z = heightmap(p - e.yyx) - heightmap(p + e.yyx);
    return normalize(vec3(x,y,z));
}

vec4 sky_gradient(vec3 rd, vec3 sunpos, float t){

    float y = gl_FragCoord.y / resolution.y;

    vec4 yellow = vec4(255, 250, 213, 255) / 255.f;
    vec4 burnt = vec4(251, 152, 20, 255) / 255.f;
    vec4 gold = vec4(255, 181, 17, 255) / 255.f;
    vec4 coral = vec4(233, 133, 129, 255) / 255.f;
    vec4 gray = vec4(208, 205, 220, 255) / 255.f;
    vec4 black = vec4(77, 85, 120, 255) / 255.f;

    vec4 candygrad = mix(gray, coral, smoothstep(0.5, 1.0, y));
    vec4 peakingthru = mix(coral, black, smoothstep(0.6, 1.0, y));
    vec4 swapper = (t >= -0.85) ? candygrad : peakingthru;

    vec4 blue = vec4(148,183,226, 255) / 255.f;
    vec4 lightblue = vec4(179, 208, 244, 255) / 255.f;

    float step1 = 0.0;
    float step2 = 0.4;
    float step3 = 1.0;


    vec4 color = mix(blue, lightblue, smoothstep(step1, step2, y* -t));
    color = mix(color, swapper, smoothstep(step2, step3, y* -t+0.2));

    float sun = max(pow(clamp(dot(rd*vec3(-1,1,-1),sunpos), 0.0, 1.0), 1000.0), 0.0);

    color += vec4(rrr, ggg, bbb, 1.0)*sun;
    return color;
}

float raymarch(vec3 ro, vec3 rd){
    const float marchDist = 0.001; // precision
    float currHeight = 0.0; // distance
    float nextStep = marchDist * 2.0; // step

    for (int i=0; i < 36; i++) {
        if (abs(nextStep)> marchDist) {
            currHeight += nextStep; // next step
            float pos = heightmap(ro + rd * currHeight); // next intersection
            nextStep = pos; // distance

        } else {
            break;
        }
    }
    return currHeight;
}


const vec3 MOUNTAIN_COLOR = vec3(66.0, 62.0, 56.0) / 255.0;
vec3 render(vec3 ro, vec3 rd, float t){
    //color of the sky
    float time = 2.2*cos(0.1*sunPosition);
    vec3 color = sky_gradient(rd, light, sunPosition/99.f*2-1).xyz;
    //light = -light;

    float height = raymarch(ro, rd);

    vec3 world = ro + rd * height;

    vec3 normal = calcNormal(world); // terrain normals
    if(normalMapping){
        normal = blend(normal, sampleTexture(tex,world,normal));
    }

    // color it like a mountain if it satisfies these heights
    if (height < dMax) {

        // gray undertone of rock color
        color = vec3(102.0) / 255.f;

        float slope = 1.0 - dot (normal, vec3 (0.0, 1.0, 0.0));
        vec2 rander = vec2(rd.x,rd.y);

        if (slope < 0.3 && world.y > 1.0-(0.2*rand(rander))){
           color = mix(vec3(1.0, 1.0, 1.0), color, slope * slope);
        }

        //phong lighting model
//        light.y = (sunPosition/99.f*2-1 >= -0.85 && sunPosition/99.f*2-1 <= 0.7) ? light.y + 75/(sunPosition*sunPosition) : light.y ;
        float ambient = 0.25;
        float diffuse = 1.5*clamp(dot(normal, light), 0.0, 1.0);
        float rr = clamp(sin(sunPosition/99.f*2)*4, 0.5, 1.0);
        float gg = clamp(sin(sunPosition/99.f*2)*4, 0.5, 0.9);
        float bb = 0.7;
        vec3 suncolor = vec3(rr, gg, bb);
        color *= vec3(suncolor.xy, 0.8);
        color = color * (ambient + diffuse);
    }
    return color;
}


void main() {
    vec3 rayOrigin = vec3(0.0, 2000, -100.0 - cameraPosition);
    rayOrigin.y = 0.4 * noise((rayOrigin.xz * 0.5)) + 1.5;
    vec3 target = vec3(0.0);
    vec3 look = normalize(rayOrigin - target);
    vec3 up = vec3(0.0, 1.0, 0.0);

    vec3 cameraForward = -look;
    vec3 cameraRight = normalize(cross(cameraForward, up));
    vec3 cameraUp = normalize(cross(cameraRight, cameraForward));

    vec2 modified_uv = 2.0*(gl_FragCoord.xy/resolution.xy) - vec2(1.0);
    modified_uv.x *= resolution.x/resolution.y;

    vec3 rayDirection = vec3(modified_uv, 1.0);
    rayDirection = normalize(rayDirection.x * cameraRight + rayDirection.y * cameraUp + rayDirection.z * cameraForward);

    float t = raymarch(rayOrigin, rayDirection);
    vec3 col = vec3(0.0);
        col = render(rayOrigin, rayDirection, t);
        fragColor = vec4(col, 1.0);
}
