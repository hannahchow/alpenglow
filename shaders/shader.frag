#version 330 core

#define SPHERE 0
#define PLANE 1
#define NO_INTERSECT 2
#define DISPLACEMENT_FACTOR 0.1

in vec2 uv;
uniform vec2 resolution;
out vec4 fragColor;
uniform sampler2D tex;

// Data structure for raymarching results
struct PrimitiveDist {
    float dist;
    int primitive; // Can be SPHERE, PLANE, or NO_INTERSECT
};

vec3 texCube( sampler2D sam, in vec3 p, in vec3 n )
{
    vec4 x = texture(sam, p.yz);
    vec4 y= texture(sam, p.xz);
    vec4 z = texture(sam, p.xy);
    return (abs(n.x)*x + abs(n.y)*y + abs(n.z)*z).xyz;
}

float sdTwistedSphere(vec3 p) {
    vec3 spherePosition = vec3(0.0, 0.25, 0.0);
    float radius = 1.5;
    return length(p - spherePosition) - radius;
}


PrimitiveDist map(vec3 p) {
    float sphereDist = sdTwistedSphere(p);
    return PrimitiveDist(sphereDist, SPHERE);
}

const float epsilon = 0.001;
vec2 e = vec2(epsilon, 0.0); // For swizzling
vec3 calcNormal(vec3 p) {
    float x = map(p + e.xyy).dist - map(p - e.xyy).dist;
    float y = map(p + e.yxy).dist - map(p - e.yxy).dist;
    float z = map(p + e.yyx).dist - map(p - e.yyx).dist;
    return normalize(vec3(x,y,z));
}

PrimitiveDist raymarch(vec3 ro, vec3 rd) {
    float marchDist = 0.001;
    float boundingDist = 50.0;
    float threshold = 0.001;

    for (int i = 0; i < 1000; i++) {
        vec3 p = ro + marchDist * rd;
        PrimitiveDist d = map(p);
        marchDist += 0.1f * d.dist;
        if(d.dist < threshold){
            return PrimitiveDist(marchDist, d.primitive);
        }
        if(marchDist > boundingDist){
            break;
        }
    }

    return PrimitiveDist(-1.0, NO_INTERSECT);
}

vec3 render(vec3 ro, vec3 rd, float t, int which) {
    vec3 col = vec3(0.);
    vec3 pos = ro + rd * t;
    vec3 lig = normalize(vec3(1.0,0.6,0.5));

    vec3 nor = calcNormal(pos);
    float ruggedness = 1.0;
    nor = normalize((1-ruggedness) * nor + ruggedness*normalize(texCube(tex, pos, calcNormal(pos))));
    //vec3 nor = clamp(texCube(iChannel0, pos, calcNormal(pos)), 0.0, 1.0);
    float ambient = 0.1;
    float diffuse = clamp(dot(nor, lig), 0.0, 1.0);
    float shineness = 32.0;
    float specular = pow(clamp(dot(rd, reflect(lig, nor)), 0.0, 1.0), 32.0);

    col += 0.7*vec3(ambient + diffuse + specular);

    return col;
}

void main() {

    vec3 rayOrigin = vec3(0.0, 4.8, 6.0);

    float focalLength = 2.0;
    vec3 target = vec3(0.0);
    vec3 look = normalize(rayOrigin - target);
    vec3 up = vec3(0.0, 1.0, 0.0);

    // Set up camera matrix
    vec3 cameraForward = -look;
    vec3 cameraRight = normalize(cross(cameraForward, up));
    vec3 cameraUp = normalize(cross(cameraRight, cameraForward));

    //Construct the ray direction vector
    vec2 uv = vec2(gl_FragCoord[0] / resolution[0], gl_FragCoord[1] / resolution[1]);
    uv = 2.f*uv - vec2(1.f);
    uv[0] *= resolution[0]/resolution[1];
    vec3 rayDirection = vec3(uv, focalLength);

    rayDirection = rayDirection[0] * cameraRight + rayDirection[1] * cameraUp + rayDirection[2] * cameraForward;
    rayDirection = normalize(rayDirection);

    PrimitiveDist rayMarchResult = raymarch(rayOrigin, rayDirection);
    vec3 col = vec3(0.0);
    if (rayMarchResult.primitive != NO_INTERSECT) {
      col = render(rayOrigin, rayDirection, rayMarchResult.dist, rayMarchResult.primitive);
    }

    fragColor = vec4(col, 1.0);
}
