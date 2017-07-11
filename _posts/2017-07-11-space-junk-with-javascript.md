---
title: "Space Junk with Javascript"
header:
  image: /assets/images/space-junk.png
category:
 - science
 - dev
 
tags:
 - javascript
 - three.js
 - "Space Track"
---

This is a JavaScript model of the existing satellites oribiting our Earth at present 
(only satellites updated in last 30 days).

<div id="space-junk" style="width:100%; background:black;"></div>
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="/assets/js/threejs/three.min.js"></script>
<script src="/assets/js/threejs/OrbitControls.js"></script>
<script src="/assets/js/space-junk.js"></script>

This is my first attempt at modelling anything in 3D with JavaScript, and not being a maths expert, 
I need to confirm how correct it is, but I think it looks like a good start.

You can control the model, moving the earth around or zoom in and out using the mouse.

I found quite a number of useful sites and code libraries to help me make this so I've listed
them here.


* [Space Track](https://www.space-track.org)

  Data source for satellite position information
  
* [three.js World Globe Tutorial](http://www.smartjava.org/content/render-open-data-3d-world-globe-threejs)

  Very useful information on creating a world globe in JavaScript.
  
* [satellite.js](https://github.com/shashwatak/satellite-js)

  A JavaSript library for satellite propagation from TLE data (Not using this in the end as
    pre-processing the data in Python to save bandwidth)
    
* [sgp4](https://pypi.python.org/pypi/sgp4/")

  A Python library for satellite propagation from TLE data
  
* [3D Game Programming for Kids](http://www.amazon.co.uk/gp/product/B00HUEG8O6/ref=as_li_tl?ie=UTF8&camp=1634&creative=19450&creativeASIN=B00HUEG8O6&linkCode=as2&tag=chrismacphers-21)

  A great and simple book for a quick start in to 3D JavaScript programming with three.js 







