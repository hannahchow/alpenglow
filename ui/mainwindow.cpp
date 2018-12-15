#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "Databinding.h"
#include "view.h"
#include "Settings.h"
#include <QGLFormat>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    settings.loadDefaults();
    ui->setupUi(this);
    dataBind();
}

MainWindow::~MainWindow()
{
    foreach (DataBinding *b, m_bindings)
        delete b;
    delete ui;
}

void MainWindow::dataBind() {
    #define BIND(b) { \
        DataBinding *_b = (b); \
        m_bindings.push_back(_b); \
    }

    BIND(FloatBinding::bindSliderAndTextbox(
        ui->sunPositionSlider, ui->sunPositionText, settings.sunPosition, 0.f, 40.f))
    BIND(IntBinding::bindSliderAndTextbox(
        ui->octavesSlider, ui->octavesText, settings.octaves, 1, 12))
    BIND(FloatBinding::bindSliderAndTextbox(
        ui->snowSlider, ui->snowText, settings.snow, 0.1, 1.2))
    BIND(BoolBinding::bindCheckbox(
        ui->normalMapping, settings.normalMapping))

    #undef BIND
}
