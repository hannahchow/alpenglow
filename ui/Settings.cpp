#include "Settings.h"
#include <QFile>
#include <QSettings>

Settings settings;

void Settings::loadDefaults() {
    // Set the default values below
    sunPosition = 0.f;
    octaves = 1;
    normalMapping = false;
    snowStatus = false;
    snowAmount = 0.f;
    cameraZoom = 0.f;
}
