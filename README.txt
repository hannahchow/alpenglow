How to run
Run the executable file. Then, once in UI, it will begin with a simple, low definition mountain at dawn. From there, the following options are available:
* Use the position slider. This will affect the position of the camera, allowing you to traverse the terrain
* Use the sunPosition slider. This will affect time of day, which leads to the sun being in a different position in the sky, the sky having different colors, the scene being lit differently, etc. 
* Use the octaves slider. This will affect the number of octaves of noise being used in the mountain range, resulting in more/less realistic terrain
* Use the snowAmount sliders, which will control the parameter determining amount of snow at the top of the mountain
* Use the snow checkbox to initiate snow in the first place!
* Use the normal mapping checkbox, which will apply a normal map to increase the noise of the surface normals. Particularly helpful in low octaves where there isn’t much noise to begin with.

Design Decisions
We built our CPU logic into the view file, as created by the QTCreator template. The general CPU template starts with mainwindow.ui, which is where we designed the UI, then in mainwindow.cpp we use databindings to bind the ui sliders to constants in the settings class. We then use the view class provided by the QT template to handle the CPU logic, including sending the settings as uniform to the frag shader and setting up the program broadly. The rest of the logic is contained in the UI, detailed as follows.

The rendering is based on a raymarching scheme. This follows the standard raymarching scheme, which begins at the origin and marches in the direction of a pixel a number of steps, evaluating a terrain function to determine if we have hit the mountain. If the ray goes a prescribed distance without hitting a mountain, we then invoke our atmosphere function, which deals with lighting to determine time of day and thus color. Those processes are detailed below. 

To simulate the atmosphere, several features were implemented. The sky’s coloration is composed of several gradients shifting and swapping with one another. Primarily, there are two gradients called candygrad and peakingthru, which we swap out when the sun crosses the horizon. The sun is implemented in two pieces: the actual directional light, which illuminates the landscape, and a simulated light orb, which is created in sky_gradient and provides the visual representation of the sun itself. The colors of both the directional light and the light orb are multiplied by a color vector which is changed in line with the movement of the sun. The scene was given more depth through the implementation of fog. The fog’s color is a mix of white and the changing color of the sky. 

Another feature we implemented was normal mapping. This was meant to artificially provide texture detail on smoother surfaces. Thus, when the octaves of terrain noise is low, turning on normal mapping will provide detail. In order to do this, the normal map is sampled (similar to how it is done in lab 10). Then, using the sampled RGB values, the normal is calculated. From there, it is mixed with the surface normal to add noise. Using a terrain-like texture, this noise mimics terrain. It can be used to add noise at high octaves too, but it mimics much of the other noise, so it doesn’t create as noticeable an impact.

The crux of this project was the terrain itself. This relies on the sine function, and a series of octaves. The number of octaves is set by the UI. The lower octaves provide broader, more simplistic noise while the higher octaves provide greater noise but are weighted less so as to create peaks and valleys without over exaggerating any portion of the height. To bolster and smooth these peaks and valleys, we used a smoothstep function to help emphasize the peaks/valleys. 

Finally, we have snow. There is a checkbox that controls its existence, and a slider the controls its amount. The amount of snow is based on the surface normal. The higher the snow amount, the higher the threshold of the normal to the XZ plane. Thus, a low snow amount would mean only really flat surfaces retain sound, while high snow amounts mean that most surfaces above a certain height will retain snow.

Known bugs?
None :) 
