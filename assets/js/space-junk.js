let container;
let aspectRatio = '16:9';
let POS_X = 1800;
let POS_Y = 1000;
let POS_Z = 1800;
let WIDTH;
let HEIGHT;

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

    container = $("#space-junk");

    WIDTH = container.outerWidth();
    HEIGHT = WIDTH * getRatioFactor(aspectRatio)

    container.css('height', HEIGHT + 'px');

    // This is where stuff in our animation will happen:
    scene = new THREE.Scene();

    // This will draw what the camera sees onto the screen:
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);

    // 3D red/green
    //anaglyphRenderer = new THREE.AnaglyphEffect(renderer);
    //anaglyphRenderer.setSize(WIDTH, HEIGHT);

    renderer.setClearColor(0x111111);
    container.append(renderer.domElement);

    // Create Globe
    // setup a camera that points to the center
    camera = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, NEAR, FAR);
    camera.position.set(POS_X, POS_Y, POS_Z);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
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
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        let strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }

        let strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );
        } else {
            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];
        }

        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}


// Add the earth
// Earth radius = 6371 so we divided by 10 here
function addEarth() {
    let spGeo = new THREE.SphereGeometry(637, 30, 30);

    // load a resource
    var loader = new THREE.TextureLoader();
    loader.load(
        // resource URL
        "/assets/images/globe-1.jpg",
        // Function when resource is loaded
        function (texture) {
            texture.minFilter = THREE.LinearFilter;
            let mat2 = new THREE.MeshPhongMaterial({
                map: texture,
                shininess: 0.2
            });
            sp = new THREE.Mesh(spGeo, mat2);
            scene.add(sp);
        },
        // Function called when download progresses
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // Function called when download errors
        function (xhr) {
            console.log('An error happened');
        }
    );
}

// add a simple light
function addLights() {
    let light = new THREE.DirectionalLight(0xffffff);
    scene.add(light);
    light.position.set(POS_X, POS_Y, POS_Z);
}

function addSatellites() {
    jQuery.get('/assets/data/satellite-data.csv', function (data) {
        let satelliteData = csvToArray(data);
        // Create geometry to merge cubes in to for efficiency
        let geom = new THREE.Geometry();
        let cubeMat = new THREE.MeshLambertMaterial({color: 0xffffff, opacity: 0.6, emissive: 0xffffff});
        //let cubeMat = new THREE.MeshLambertMaterial({opacity: 0.6});
        let materials = [];

        let count = 0;

        jQuery.each(satelliteData, function (key, sat) {

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

        let satellites = new THREE.Mesh(geom, new THREE.MultiMaterial(materials));
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

$(document).ready(function () {
    init();
    addEarth();
    addLights();
    addSatellites();
    render();
});
