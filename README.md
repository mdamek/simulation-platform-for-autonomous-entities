# simulation-platform-for-autonomous-entities
 A hardware and software platform for parallel simulation and visualization of the behavior of groups of autonomous entities



The Painter class provides a Paint method that allows you to display any two-dimensional arrays that store the colors of pixel data. 
Color is understood as an object with properties corresponding to the basic RGB channels. This method is based on setting subsequent pixel values 
and displaying the created image after setting all pixel values on the LED panel. 
In addition, this class provides auxiliary methods: 

***CreateArray*** - creating an empty two-dimensional array of Color objects

***Sleep*** - causing the function to stop for a certain period of time (to reduce the display refresh rate).

***PrintText*** - displays any string in the form of shifting from right to left in the center of the display

***ShowImage*** - displays any image for a specified time


There are 5 use cases in the Visualisations folder:

***FillPanelPixel*** - filling the entire display surface with random color.

***NextPixelsOn*** - lighting of subsequent pixels on the display.

***GameOfLife*** - an example of a cellular automaton closest to the implementations for which the platform is to be used

***PrintText*** - display the inscription "Pracownia problemowa Marcin Damek Dominik Kędzior"

***ShowImage*** -display images from images folder at 1 second interval


[***Action presentation - YouTube***](https://youtu.be/YfUaiunCVZE)
