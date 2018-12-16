/********************************************************************************
** Form generated from reading UI file 'mainwindow.ui'
**
** Created by: Qt User Interface Compiler version 5.10.1
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
    QCheckBox *normalMapping;
    QSlider *snowAmountSlider;
    QLineEdit *snowAmountText;
    QLabel *label_4;
    QSlider *positionSlider;
    QLineEdit *positionText;
    QLabel *label_5;
    QCheckBox *snowStatus;

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
        octavesSlider->setGeometry(QRect(30, 210, 160, 22));
        octavesSlider->setOrientation(Qt::Horizontal);
        label_2 = new QLabel(dockWidgetContents);
        label_2->setObjectName(QStringLiteral("label_2"));
        label_2->setGeometry(QRect(70, 230, 241, 31));
        octavesText = new QLineEdit(dockWidgetContents);
        octavesText->setObjectName(QStringLiteral("octavesText"));
        octavesText->setGeometry(QRect(200, 210, 31, 21));
        normalMapping = new QCheckBox(dockWidgetContents);
        normalMapping->setObjectName(QStringLiteral("normalMapping"));
        normalMapping->setGeometry(QRect(30, 330, 131, 20));
        snowAmountSlider = new QSlider(dockWidgetContents);
        snowAmountSlider->setObjectName(QStringLiteral("snowAmountSlider"));
        snowAmountSlider->setGeometry(QRect(30, 260, 160, 22));
        snowAmountSlider->setOrientation(Qt::Horizontal);
        snowAmountText = new QLineEdit(dockWidgetContents);
        snowAmountText->setObjectName(QStringLiteral("snowAmountText"));
        snowAmountText->setGeometry(QRect(200, 260, 31, 21));
        label_4 = new QLabel(dockWidgetContents);
        label_4->setObjectName(QStringLiteral("label_4"));
        label_4->setGeometry(QRect(70, 280, 241, 31));
        positionSlider = new QSlider(dockWidgetContents);
        positionSlider->setObjectName(QStringLiteral("positionSlider"));
        positionSlider->setGeometry(QRect(30, 110, 160, 22));
        positionSlider->setOrientation(Qt::Horizontal);
        positionText = new QLineEdit(dockWidgetContents);
        positionText->setObjectName(QStringLiteral("positionText"));
        positionText->setGeometry(QRect(200, 110, 31, 21));
        label_5 = new QLabel(dockWidgetContents);
        label_5->setObjectName(QStringLiteral("label_5"));
        label_5->setGeometry(QRect(70, 130, 241, 31));
        snowStatus = new QCheckBox(dockWidgetContents);
        snowStatus->setObjectName(QStringLiteral("snowStatus"));
        snowStatus->setGeometry(QRect(30, 370, 72, 20));
        dockWidget->setWidget(dockWidgetContents);
        MainWindow->addDockWidget(static_cast<Qt::DockWidgetArea>(1), dockWidget);

        retranslateUi(MainWindow);

        QMetaObject::connectSlotsByName(MainWindow);
    } // setupUi

    void retranslateUi(QMainWindow *MainWindow)
    {
        MainWindow->setWindowTitle(QApplication::translate("MainWindow", "A CS123 Final", nullptr));
        label->setText(QApplication::translate("MainWindow", "Sun Position", nullptr));
        label_2->setText(QApplication::translate("MainWindow", "Terrain Octaves", nullptr));
        normalMapping->setText(QApplication::translate("MainWindow", "Normal Map", nullptr));
        label_4->setText(QApplication::translate("MainWindow", "Snowfall Amount", nullptr));
        label_5->setText(QApplication::translate("MainWindow", "Camera Position", nullptr));
        snowStatus->setText(QApplication::translate("MainWindow", "Snow", nullptr));
    } // retranslateUi

};

namespace Ui {
    class MainWindow: public Ui_MainWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H
