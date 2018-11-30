#ifndef SETTINGS_H
#define SETTINGS_H

#include <QObject>

struct Settings{
    void loadDefaults();
    bool bumpMapping;
    float sunPosition;
};

// The global Settings object, will be initialized by MainWindow
extern Settings settings;

#endif // SETTINGS_H
