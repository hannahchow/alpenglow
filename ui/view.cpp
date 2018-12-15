#include "view.h"

#include "viewformat.h"
#include <QApplication>
#include <QKeyEvent>
#include <iostream>
#include "Settings.h"

#include "lib/ResourceLoader.h"

View::View(QWidget *parent) : QGLWidget(ViewFormat(), parent),
    m_time(), m_timer(), m_captureMouse(false),
    m_mountainProgram(0),
    m_quad(nullptr),
    m_textureID(0)
{
    // View needs all mouse move events, not just mouse drag events
    setMouseTracking(true);

    // Hide the cursor
    if(m_captureMouse) {
        QApplication::setOverrideCursor(Qt::BlankCursor);
    }

    // View needs keyboard focus
    setFocusPolicy(Qt::StrongFocus);

    // The update loop is implemented using a timer
    connect(&m_timer, SIGNAL(timeout()), this, SLOT(tick()));
}

View::~View()
{
    glDeleteTextures(1, &m_textureID);
}

void View::initializeGL()
{
    // All OpenGL initialization *MUST* be done during or after this
    // method. Before this method is called, there is no active OpenGL
    // context and all OpenGL calls have no effect.

    //initialize glew
    ResourceLoader::initializeGlew();

    // Start a timer that will try to get 60 frames per second (the actual
    // frame rate depends on the operating system and other running programs)
    m_time.start();
    m_timer.start(1000 / 60);

    glEnable(GL_DEPTH_TEST);
    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);
    glFrontFace(GL_CCW);

    m_mountainProgram = ResourceLoader::createShaderProgram(
                ":/shaders/default.vert", ":/shaders/default.frag");
    std::vector<GLfloat> quadData;
    quadData = {
        -1, 1, 0,//XYZ 1
        0, 0, //UV 1
        -1, -1, 0,//XYZ 2
        0, 1,//UV 2
        1, 1, 0,//XYZ 3
        1, 0,//UV 3
        1, -1, 0,//XYZ 4
        1, 1//UV 4
    };
    m_quad = std::make_unique<OpenGLShape>();
    m_quad->setVertexData(&quadData[0], quadData.size(), VBO::GEOMETRY_LAYOUT::LAYOUT_TRIANGLE_STRIP, 4);
    m_quad->setAttribute(ShaderAttrib::POSITION, 3, 0, VBOAttribMarker::DATA_TYPE::FLOAT, false);
    m_quad->setAttribute(ShaderAttrib::TEXCOORD0, 2, 3*sizeof(GLfloat), VBOAttribMarker::DATA_TYPE::FLOAT, false);
    m_quad->buildVAO();


    QImage image(":/images/terrain4.jpg");
    glGenTextures(1, &m_textureID);
    glBindTexture(GL_TEXTURE_2D, m_textureID);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, image.width(), image.height(), 0, GL_RGBA, GL_UNSIGNED_BYTE, image.bits());
}

void View::paintGL()
{
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    // TODO: Implement the demo rendering here
    glUseProgram(m_mountainProgram);
    glm::vec2 resolution = glm::vec2(width(), height());
    glViewport(0,0, 2*resolution.x,2*resolution.y);
    glBindTexture(m_textureID, GL_TEXTURE_2D);
    glUniform2fv(glGetUniformLocation(m_mountainProgram, "resolution"), 1, glm::value_ptr(resolution));
    glUniform1i(glGetUniformLocation(m_mountainProgram, "normalMapping"), settings.normalMapping);
    glUniform1f(glGetUniformLocation(m_mountainProgram, "snowHeight"), settings.snowHeight);
    glUniform1i(glGetUniformLocation(m_mountainProgram, "octaves"), settings.octaves);
    glUniform1f(glGetUniformLocation(m_mountainProgram, "sunPosition"), settings.sunPosition);
    glUniform1f(glGetUniformLocation(m_mountainProgram, "snowAmount"), settings.snowAmount);
    glUniform1f(glGetUniformLocation(m_mountainProgram, "cameraPosition"), settings.cameraZoom);
    m_quad->draw();
    glUseProgram(0);
}

void View::resizeGL(int w, int h)
{
    float ratio = static_cast<QGuiApplication *>(QCoreApplication::instance())->devicePixelRatio();
    w = static_cast<int>(w / ratio);
    h = static_cast<int>(h / ratio);
    glViewport(0, 0, w, h);
}

void View::mousePressEvent(QMouseEvent *event)
{
}

void View::mouseMoveEvent(QMouseEvent *event)
{
    // This starter code implements mouse capture, which gives the change in
    // mouse position since the last mouse movement. The mouse needs to be
    // recentered after every movement because it might otherwise run into
    // the edge of the screen, which would stop the user from moving further
    // in that direction. Note that it is important to check that deltaX and
    // deltaY are not zero before recentering the mouse, otherwise there will
    // be an infinite loop of mouse move events.
    if(m_captureMouse) {
        int deltaX = event->x() - width() / 2;
        int deltaY = event->y() - height() / 2;
        if (!deltaX && !deltaY) return;
        QCursor::setPos(mapToGlobal(QPoint(width() / 2, height() / 2)));

        // TODO: Handle mouse movements here
    }
}

void View::mouseReleaseEvent(QMouseEvent *event)
{
}

void View::keyPressEvent(QKeyEvent *event)
{
    if (event->key() == Qt::Key_Escape) QApplication::quit();

    // TODO: Handle keyboard presses here
}

void View::keyReleaseEvent(QKeyEvent *event)
{
}

void View::tick()
{
    // Get the number of seconds since the last tick (variable update rate)
    float seconds = m_time.restart() * 0.001f;

    // TODO: Implement the demo update here

    // Flag this view for repainting (Qt will call paintGL() soon after)
    update();
}
