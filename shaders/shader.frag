#version 330 core

in vec3 color;
in vec2 texc;
in vec2 uv;
out vec4 fragColor;

uniform float sunPosition;
uniform bool normalMapping;
uniform bool snowStatus;
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

const float maxDistance = 16.0;

// semi random number generator
float rand(vec2 p) {
    return fract(sin(dot(p, vec2(12.231,64.102))) * 63360.01203);
}

// implementation of perlin noise for our terrain noise function
float noise(vec2 p) {
    float A = rand(vec2(floor(p.x), floor(p.y)));
    float B = rand(vec2(floor(p.x) + 1.0, floor(p.y)));
    float C = rand(vec2(floor(p.x), floor(p.y) + 1.0));
    float D = rand(vec2(floor(p.x) + 1.0, floor(p.y) + 1.0));

    float fx = fract(p.x);
    float interpx = fx * fx * (3.0 - 2.0 * fx);

    float fy = fract(p.y);
    float interpy = fy * fy * (3.0 - 2.0 * fy);

    float AB = mix(A, B, interpx);
    float CD = mix(C, D, interpx);

    float final = mix(AB, CD, interpy);

    return final;
}

//blends two normals. Used to combine surface normal with normal map normal
vec3 blend(vec3 n1, vec3 n2){
    return normalize(vec3(mix(n1.xy, n2.xy, 0.05), mix(n1.z, n2.z, 0.4)));
}

//used to sample texture for the purpose of normal mapping using point and normal vector to weight.
vec3 sampleTexture( sampler2D sam, in vec3 p, in vec3 n){
    return(abs(n.x)*texture(sam, p.yz) + abs(n.y)*texture(sam, p.xz) + abs(n.z)*texture(sam, p.xy)).xyz;
}

float heightmap(vec3 p) {

    float currDistance = maxDistance;
    float depth;

    //indicates whether or not there should be color (aka no need to add when raymarching stops)
    float material = -1.0;

    // adding octaves of noise waves to create more rugged terrain
    float height = 0.0;
    float weight = 0.5;
    float mult = 0.4;

    //iterating through user-specified octaves of height
    for (int i=0; i < octaves; i++) {
        height += weight * noise(p.xz * mult);
        weight *= 0.5;
        mult *= 2.0;
    }

    //makes a more mountainous look by boosting the mountain peaks and plateauing the rest
    height += smoothstep(0.1, 1.0, height);

    //if the depth is within the range we are marching for, we should color it!
    depth = p.y - height;
    if (depth < currDistance) {
        currDistance = depth;
        material = 0.0;
    }

    return currDistance;
}

vec3 calcNormal(vec3 p) {
    const float epsilon = 0.001;
    vec2 e = vec2(epsilon, 0.0); // For swizzling
    float x = heightmap(p - e.xyy) - heightmap(p + e.xyy);
    float y = 2.0*epsilon;
    float z = heightmap(p - e.yyx) - heightmap(p + e.yyx);
    return normalize(vec3(x,y,z));
}

vec4 sky_gradient(vec3 rd, vec3 sunpos, float t){

    float y = gl_FragCoord.y / resolution.y;

    // colors to be mixed into sky
    vec4 burnt = vec4(251, 152, 20, 255) / 255.f;
    vec4 coral = vec4(233, 133, 129, 255) / 255.f;
    vec4 gray = vec4(208, 205, 220, 255) / 255.f;
    vec4 black = vec4(77, 85, 120, 255) / 255.f;
    vec4 blue = vec4(148,183,226, 255) / 255.f;
    vec4 lightblue = vec4(179, 208, 244, 255) / 255.f;

    vec4 candygrad = mix(gray, coral, smoothstep(0.5, 1.0, y));
    vec4 peakingthru = mix(coral, black, smoothstep(0.6, 1.0, y));

    //switches out the 2 gradients above when the sun rises above the horizon
    vec4 swapper = (t >= -0.85) ? candygrad : peakingthru;

    // intervals of gradient mixing
    float step1 = 0.0;
    float step2 = 0.4;
    float step3 = 1.0;

    vec4 color = mix(blue, lightblue, smoothstep(step1, step2, y* -t));
    color = mix(color, swapper, smoothstep(step2, step3, y* -t+0.2));

    // simulates the sun orb within the sky gradient, in line with the movement of
    // the actual directional light creating the light for the scene
    float sun = max(pow(clamp(dot(rd*vec3(-1,1,-1),sunpos), 0.0, 1.0), 1000.0), 0.0);

    // changes tint color of halo around sun, dependent on sun position slider
    // these RGB values are also used to tint the value of the directional light
    color += vec4(rrr, ggg, bbb, 1.0)*sun;
    return color;
}

//standard raymarching, with checking whether the height we have generated needs to be applied
float raymarch(vec3 ro, vec3 rd){

    const float marchDist = 0.001;
    float t = 0.0;
    float nextStep = marchDist * 2.0;

    for (int i=0; i < 100; i++) {
        if (abs(nextStep)> marchDist) {
            t += nextStep;
            float pos = heightmap(ro + rd * t);
            nextStep = pos;
        } else {
            break;
        }
    }
    return t;
}

vec3 render(vec3 ro, vec3 rd, float t){

    //color of the sky
    float time = 2.2 * cos(0.1 * sunPosition);
    vec3 color = sky_gradient(rd, light, sunPosition/99.f*2-1).xyz;

    //mixing color for fog (comes later)
    vec3 fogcol = color;

    //current raymarched distance
    float dist = raymarch(ro, rd);

    //current position in world space
    vec3 world = ro + rd * dist;

    vec3 normal = calcNormal(world);
    if(normalMapping){
        normal = blend(normal, sampleTexture(tex,world,normal));
    }

    // vec2 used to generate random value for gradiating the snowline
    vec2 rander = vec2(rd.x,rd.y);

    // color it like a mountain if it satisfies these heights
    if (dist < maxDistance) {

        // gray undertone of rock color
        color = vec3(102.0) / 255.f;

        //calculates slope of mountainface
        float slope = 1.0 - dot (normal, vec3 (0.0, 1.0, 0.0));

        float ambient = 0.25;
        float diffuse = 1.5*clamp(dot(normal, light), 0.0, 1.0);

        // rgb values used to tint the mountain material in line with the sun's movement
        float rr = clamp(sin(sunPosition/99.f*2)*4, 0.5, 1.0);
        float gg = clamp(sin(sunPosition/99.f*2)*4, 0.5, 0.9);
        float bb = 0.7;

        //color of sunlight, dependent on sun position
        vec3 suncolor = vec3(rr, gg, bb);
        color *= vec3(suncolor.xy, 0.8);
        color = color * (ambient + diffuse);

        //lighting and coloring for the snow (shinier than normal!)
        if (snowStatus && slope < snowAmount && world.y > 1.0-(0.2*rand(rander))){
            color = mix(vec3(1.0, 1.0, 1.0), color, slope * slope);
            float snowambient = 0.6;
            float snowdiffuse = 0.8 * clamp(dot(normal, light), 0.0, 1.0);
            float snowspecular = pow(clamp(dot(rd, reflect(light, normal)),  0.0, 1.0), 32.0);
            float snowrr = clamp(sin(sunPosition/99.f*2)*4, 0.5, 1.0);
            float snowgg = clamp(sin(sunPosition/99.f*2)*4, 0.5, 0.9);
            float snowbb = 1.0;
            vec3 suncolor = vec3(snowrr, snowgg, snowbb);
            color = mix(color, vec3(suncolor.xy, 0.8), 0.5);
            color = color * (snowambient + snowdiffuse + snowspecular);
        }
    }

    //exponential fog equation (amount of fog that should be added as a product of the current distance)
    float fogamount = exp(-0.005 * dist * dist); // exponential fog equation

    //adding fog in
    if (dist > maxDistance) {
        color = mix(color, mix(fogcol, vec3(1.0), 1.0), fogamount); // add fog behind where we raymarch / in the sky
    } else {
        color = mix(vec3(1.0), color, fogamount); // add fog over the back mountains for a fade
    }
    return color;
}

void main() {
    //uses camera position as input for ray origin. Specifies looking information
    vec3 rayOrigin = vec3(0.0, cameraPosition, -100.0 - cameraPosition);
    rayOrigin.y = 0.4 * noise((rayOrigin.xz * 0.5)) + 1.5;
    vec3 target = vec3(0.0);
    vec3 look = normalize(rayOrigin - target);
    vec3 up = vec3(0.0, 1.0, 0.0);

    //specifying camera information
    vec3 cameraForward = -look;
    vec3 cameraRight = normalize(cross(cameraForward, up));
    vec3 cameraUp = normalize(cross(cameraRight, cameraForward));

    //finds uv coordinates -- taken from lab10
    vec2 modified_uv = 2.0*(gl_FragCoord.xy/resolution.xy) - vec2(1.0);
    modified_uv.x *= resolution.x/resolution.y;

    //raymarch point to get color
    vec3 rayDirection = vec3(modified_uv, 1.0);
    rayDirection = normalize(rayDirection.x * cameraRight + rayDirection.y * cameraUp + rayDirection.z * cameraForward);
    float t = raymarch(rayOrigin + vec3(0.0, -1500.0, 0.0), rayDirection);
    vec3 col = render(rayOrigin, rayDirection, t);
    fragColor = vec4(col, 1.0);
}
