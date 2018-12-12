#ifndef TERRAIN_H
#define TERRAIN_H
#include "glew-1.10.0/include/GL/glew.h"
#include "glm/glm.hpp"            // glm::vec*, mat*, and basic glm functions
#include "glm/gtx/transform.hpp"  // glm::translate, scale, rotate
#include "glm/gtc/type_ptr.hpp"   // glm::value_ptr

class Terrain {

public:
    Terrain();
    ~Terrain();
private:
    void intializeGL();
    GLuint m_mountainProgram;
};

#endif // TERAIN_H
