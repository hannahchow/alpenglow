#version 330 core

in vec3 color;
in vec2 texc;
in vec2 uv;
out vec4 fragColor;

uniform sampler2D tex;
uniform int useTexture = 0;
uniform vec2 resolution;



float f(vec3 p){
    return sin(p.x)*sin(p.z);
}

const float epsilon = 0.001;
vec2 e = vec2(epsilon, 0.0); // For swizzling
vec3 calcNormal(vec3 p) {
    float x = f(p - e.xyy) - f(p + e.xyy);
    float y = 2.0*epsilon;
    float z = f(p - e.yyx) - f(p + e.yyx);
    return normalize(vec3(x,y,z));
}

float raymarch(vec3 ro, vec3 rd){
    float marchDist = 0.001;
    float boundingDist = 50.0;
    float threshold = 0.001;
    for(int i = 0; i < 1000; i++){
        vec3 p = ro + rd*marchDist;
        if(f(p) > p.y){
            return marchDist;
        }
        marchDist += 0.01;
    }
    return -1.0;
}

const vec3 MOUNTAIN_COLOR = vec3(66.0, 62.0, 56.0) / 255.0;
vec3 render(vec3 ro, vec3 rd, float t){
    vec3 pos = ro + rd*t;
    vec3 n = calcNormal(pos);
    vec3 light = normalize(vec3(1.0,0.6,0.5));

    float ambient = 0.1;
    float diffuse = clamp(dot(n, light), 0.0, 1.0);
    float specular = pow(clamp(dot(rd, reflect(light, n)), 0.0, 1.0), 32.0);

    vec3 color = (pos.y > 0.6) ? vec3(1.0) : MOUNTAIN_COLOR;
    return color * (ambient + diffuse + specular);
}

void main() {
    vec3 rayOrigin = vec3(0.0, 4.8, 6.0);
    vec3 target = vec3(0.0);
    vec3 look = normalize(rayOrigin - target);
    vec3 up = vec3(0.0, 1.0, 0.0);

    vec3 cameraForward = -look;
    vec3 cameraRight = normalize(cross(cameraForward, up));
    vec3 cameraUp = normalize(cross(cameraRight, cameraForward));

    vec2 modified_uv = (gl_FragCoord.xy/resolution.xy) - vec2(1.0);
//            2.0*(gl_FragCoord.xy/resolution.xy) - vec2(1.0);
    modified_uv.x *= resolution.x/resolution.y;

    vec3 rayDirection = vec3(modified_uv, 1.0);
    rayDirection = normalize(rayDirection.x * cameraRight + rayDirection.y * cameraUp + rayDirection.z * cameraForward);

    float t = raymarch(rayOrigin, rayDirection);
    vec3 col = vec3(0.0);
    if(t > 0.0){
        col = render(rayOrigin, rayDirection, t);
    }

    fragColor = vec4(col, 1.0);
}\
