#version 330 core

in vec3 color;
in vec2 texc;
out vec4 fragColor;

uniform sampler2D tex;
uniform int useTexture = 0;

void main(){
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
