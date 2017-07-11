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

<div id="space-junk"></div>
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="/assets/js/threejs/three.js"></script>
<script src="/assets/js/threejs/OrbitControls.js"></script>
<script>

  let container = $("#space-junk");
  
  let aspectRatio = '16:9';
  let POS_X = 1800;
  let POS_Y = 1000;
  let POS_Z = 1800;
  let WIDTH = container.offsetWidth;
  let HEIGHT = WIDTH * getRatioFactor(aspectRatio);

  let FOV = 45;
  let NEAR = 1;
  let FAR = 4000;

  let controls, scene, camera, renderer;

  function getRatioFactor(aspectRatio) {
    switch (aspectRatio) {
      case '16:9':
        return 0.5625;
      case '4:3':
        return 0.75;
    }
  }

  function init() {

    container.css('height', HEIGHT + 'px');

    // This is where stuff in our animation will happen:
    scene = new THREE.Scene();

    // This will draw what the camera sees onto the screen:
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    
    // 3D red/green
    //anaglyphRenderer = new THREE.AnaglyphEffect( renderer );
    //anaglyphRenderer.setSize(WIDTH, HEIGHT);

    renderer.setClearColor(0x111111);
    container.append(renderer.domElement);

    // Create Globe
    // setup a camera that points to the center
    camera = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, NEAR, FAR);
    camera.position.set(POS_X, POS_Y, POS_Z);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.target.copy( vector );
    //controls = new THREE.OrbitControls(camera);
    //        controls.damping = 0.2;
    //controls.addEventListener('change', render);
  }

  // ref: http://stackoverflow.com/a/1293163/2343
  // This will parse a delimited string into an array of
  // arrays. The default delimiter is the comma, but this
  // can be overriden in the second argument.
  function csvToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    let objPattern = new RegExp(
        (
          // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

              // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

              // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    let arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    let arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

      // Get the delimiter that was found.
      let strMatchedDelimiter = arrMatches[ 1 ];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (
          strMatchedDelimiter.length &&
          strMatchedDelimiter !== strDelimiter
      ){

        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push( [] );

      }

      let strMatchedValue;

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[ 2 ]){

        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[ 2 ].replace(
            new RegExp( "\"\"", "g" ),
            "\""
        );

      } else {

        // We found a non-quoted value.
        strMatchedValue = arrMatches[ 3 ];

      }


      // Now that we have our value string, let's add
      // it to the data array.
      arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
  }


  // Add the earth
  // Earth radius = 6371 so we divided by 10 here
  function addEarth() {
    let spGeo = new THREE.SphereGeometry(637, 30, 30);
    let planetTexture = THREE.ImageUtils.loadTexture("assets/images/globe-1.jpg");
    let mat2 = new THREE.MeshPhongMaterial({
      map: planetTexture,
      shininess: 0.2
    });
    sp = new THREE.Mesh(spGeo, mat2);
    scene.add(sp);
  }

  // add a simple light
  function addLights() {
    light = new THREE.DirectionalLight(0xffffff);
    scene.add(light);
    light.position.set(POS_X, POS_Y, POS_Z);
  }


  function addSatellites() {

    jQuery.get('assets/data/satellite-data.csv', function(data) {
      let satelliteData = csvToArray(data);
      // Create geometry to merge cubes in to for efficiency
      let geom = new THREE.Geometry();
      //var cubeMat = new THREE.MeshLambertMaterial({color: 0xffffff, opacity: 0.6, emissive: 0xffffff});
      let cubeMat = new THREE.MeshLambertMaterial({opacity: 0.6});
      let materials = [];
      angular.forEach(satelliteData, function (sat) {

        let x = sat[0] / 10;
        let y = sat[1] / 10;
        let z = sat[2] / 10;
        let size = 5;

        //console.log('Creating cube at ' + x + ', ' + y + ', ' + z);

        let cube = new THREE.Mesh(new THREE.BoxGeometry(size, size, size, 1, 1, 1));
        materials.push(cubeMat);

        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        cube.lookAt(new THREE.Vector3(0, 0, 0));

        cube.updateMatrix();
        geom.merge(cube.geometry, cube.matrix);
      });

      let satellites = new THREE.Mesh(geom, new THREE.MeshFaceMaterial(materials));
      scene.add(satellites);
    });
  }

  function createCube(x, y, z, colour, size) {

    if (!colour) {
      colour = 0xffffff;
    }

    if (!size) {
      size = 5;
    }

    return cube;
  }

  function render() {
    //var timer = Date.now() * 0.0001;
    //camera.position.x = (Math.cos(timer) * 1800);
    //camera.position.z = (Math.sin(timer) * 1800);
    //camera.lookAt(scene.position);
    //light.position.x = (Math.cos(timer) * 1800);
    //light.position.z = (Math.sin(timer) * 1800);
    ////light.position = camera.position;
    //light.lookAt(scene.position);

    renderer.render(scene, camera);
    //anaglyphRenderer.render( scene, camera );
    requestAnimationFrame(render);
    controls.update();
  }

  init();

  $().ready(function () {
    addEarth();
    addLights();
    addSatellites();
    render();
  });
</script>

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







