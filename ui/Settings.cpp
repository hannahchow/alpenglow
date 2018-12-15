#include "Settings.h"
#include <QFile>
#include <QSettings>

Settings settings;

void Settings::loadDefaults() {
    // Set the default values below
    sunPosition = 0.f;
    octaves = 1;
    normalMapping = false;
    snowHeight = 0.f;
    snowAmount = 0.f;
    cameraZoom = 0.f;
}
