#ifndef SETTINGS_H
#define SETTINGS_H

#include <QObject>

struct Settings{
    void loadDefaults();
    int octaves;
    bool normalMapping;
    float sunPosition;
    float snow;
};

// The global Settings object, will be initialized by MainWindow
extern Settings settings;

#endif // SETTINGS_H
