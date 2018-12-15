#include "Settings.h"
#include <QFile>
#include <QSettings>

Settings settings;

void Settings::loadDefaults() {
    // Set the default values below
    sunPosition = 0.f;
    octaves = 1;
    normalMapping = false;
    snow = 0.f;
}
