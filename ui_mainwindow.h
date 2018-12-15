/********************************************************************************
** Form generated from reading UI file 'mainwindow.ui'
**
** Created by: Qt User Interface Compiler version 5.2.0
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_MAINWINDOW_H
#define UI_MAINWINDOW_H

#include <QtCore/QVariant>
#include <QtWidgets/QAction>
#include <QtWidgets/QApplication>
#include <QtWidgets/QButtonGroup>
#include <QtWidgets/QCheckBox>
#include <QtWidgets/QDockWidget>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QHeaderView>
#include <QtWidgets/QLabel>
#include <QtWidgets/QLineEdit>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QSlider>
#include <QtWidgets/QWidget>
#include "view.h"

QT_BEGIN_NAMESPACE

class Ui_MainWindow
{
public:
    QWidget *centralWidget;
    QGridLayout *gridLayout;
    View *view;
    QDockWidget *dockWidget;
    QWidget *dockWidgetContents;
    QSlider *sunPositionSlider;
    QLabel *label;
    QLineEdit *sunPositionText;
    QSlider *octavesSlider;
    QLabel *label_2;
    QLineEdit *octavesText;
    QSlider *snowSlider;
    QLineEdit *snowText;
    QLabel *label_3;
    QCheckBox *normalMapping;

    void setupUi(QMainWindow *MainWindow)
    {
        if (MainWindow->objectName().isEmpty())
            MainWindow->setObjectName(QStringLiteral("MainWindow"));
        MainWindow->resize(800, 600);
        centralWidget = new QWidget(MainWindow);
        centralWidget->setObjectName(QStringLiteral("centralWidget"));
        gridLayout = new QGridLayout(centralWidget);
        gridLayout->setSpacing(6);
        gridLayout->setContentsMargins(11, 11, 11, 11);
        gridLayout->setObjectName(QStringLiteral("gridLayout"));
        gridLayout->setContentsMargins(0, 0, 0, 0);
        view = new View(centralWidget);
        view->setObjectName(QStringLiteral("view"));

        gridLayout->addWidget(view, 0, 0, 1, 1);

        MainWindow->setCentralWidget(centralWidget);
        dockWidget = new QDockWidget(MainWindow);
        dockWidget->setObjectName(QStringLiteral("dockWidget"));
        dockWidget->setMinimumSize(QSize(247, 38));
        dockWidget->setMaximumSize(QSize(247, 524287));
        dockWidgetContents = new QWidget();
        dockWidgetContents->setObjectName(QStringLiteral("dockWidgetContents"));
        sunPositionSlider = new QSlider(dockWidgetContents);
        sunPositionSlider->setObjectName(QStringLiteral("sunPositionSlider"));
        sunPositionSlider->setGeometry(QRect(30, 160, 160, 22));
        sunPositionSlider->setOrientation(Qt::Horizontal);
        label = new QLabel(dockWidgetContents);
        label->setObjectName(QStringLiteral("label"));
        label->setGeometry(QRect(70, 180, 241, 31));
        sunPositionText = new QLineEdit(dockWidgetContents);
        sunPositionText->setObjectName(QStringLiteral("sunPositionText"));
        sunPositionText->setGeometry(QRect(200, 160, 31, 21));
        octavesSlider = new QSlider(dockWidgetContents);
        octavesSlider->setObjectName(QStringLiteral("octavesSlider"));
        octavesSlider->setGeometry(QRect(30, 220, 160, 22));
        octavesSlider->setOrientation(Qt::Horizontal);
        label_2 = new QLabel(dockWidgetContents);
        label_2->setObjectName(QStringLiteral("label_2"));
        label_2->setGeometry(QRect(70, 240, 241, 31));
        octavesText = new QLineEdit(dockWidgetContents);
        octavesText->setObjectName(QStringLiteral("octavesText"));
        octavesText->setGeometry(QRect(200, 220, 31, 21));
        snowSlider = new QSlider(dockWidgetContents);
        snowSlider->setObjectName(QStringLiteral("snowSlider"));
        snowSlider->setGeometry(QRect(30, 280, 160, 22));
        snowSlider->setOrientation(Qt::Horizontal);
        snowText = new QLineEdit(dockWidgetContents);
        snowText->setObjectName(QStringLiteral("snowText"));
        snowText->setGeometry(QRect(200, 280, 31, 21));
        label_3 = new QLabel(dockWidgetContents);
        label_3->setObjectName(QStringLiteral("label_3"));
        label_3->setGeometry(QRect(60, 300, 241, 31));
        normalMapping = new QCheckBox(dockWidgetContents);
        normalMapping->setObjectName(QStringLiteral("normalMapping"));
        normalMapping->setGeometry(QRect(30, 340, 131, 20));
        dockWidget->setWidget(dockWidgetContents);
        MainWindow->addDockWidget(static_cast<Qt::DockWidgetArea>(1), dockWidget);

        retranslateUi(MainWindow);

        QMetaObject::connectSlotsByName(MainWindow);
    } // setupUi

    void retranslateUi(QMainWindow *MainWindow)
    {
        MainWindow->setWindowTitle(QApplication::translate("MainWindow", "A CS123 Final", 0));
        label->setText(QApplication::translate("MainWindow", "Sun Position", 0));
        label_2->setText(QApplication::translate("MainWindow", "Octaves", 0));
        label_3->setText(QApplication::translate("MainWindow", "Snow Amount", 0));
        normalMapping->setText(QApplication::translate("MainWindow", "Normal Map", 0));
    } // retranslateUi

};

namespace Ui {
    class MainWindow: public Ui_MainWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H
