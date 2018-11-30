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
        ui->horizontalSlider, ui->lineEdit, settings.sunPosition, 0.f, 100.f))
    BIND(BoolBinding::bindCheckbox(ui->bumpMappingCheckbox, settings.bumpMapping))

    #undef BIND
}
