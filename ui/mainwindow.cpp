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
        ui->sunPositionSlider, ui->sunPositionText, settings.sunPosition, 0.f, 100.f))
    BIND(FloatBinding::bindSliderAndTextbox(
        ui->roughnessSlider, ui->roughnessText, settings.roughness, 0.f, 1.f))

    #undef BIND
}
