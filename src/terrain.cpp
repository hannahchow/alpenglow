#include "terrain.h"
#include "Settings.h"
#include "lib/ResourceLoader.h"
#include <iostream>

Terrain::Terrain():
    m_mountainProgram(0)
{
}

Terrain::~Terrain(){

}

void Terrain::intializeGL(){
    ResourceLoader::initializeGlew();
    glClearColor(0.0f, 0.0f, 0.0f, 0.0f);
    m_mountainProgram = ResourceLoader::createShaderProgram(
                ":/shaders/default.vert", ":/shaders/default.frag");
}
