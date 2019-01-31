
// Loads the environment images
function loadData(face, imgsrc) {
  var tempCanvas = document.createElement('canvas');
  var tempContext = tempCanvas.getContext('2d');
  var img = new Image();
  img.addEventListener('load', function() {
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    tempContext.drawImage(img, 0, 0 );
    var myData = tempContext.getImageData(0, 0, img.width, img.height);
    images[face] = myData.data;
  }, false);
    img.src = imgsrc;
}

// Associates certain face to a const index
// images[POSX] returns the imagedata for the positive x face
function setUp() {

  loadData(POSX, './Cube Images/posx.jpg');
  loadData(POSY, './Cube Images/posy.jpg');
  loadData(POSZ, './Cube Images/posz.jpg');
  loadData(NEGX, './Cube Images/negx.jpg');
  loadData(NEGY, './Cube Images/negy.jpg');
  loadData(NEGZ, './Cube Images/negz.jpg');
}

// Takes a json file and parses it to get the scene
function parseFile() {

  var url = document.getElementById("file").files[0].name;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      myScene = JSON.parse(this.responseText);
    }
  };
  xmlhttp.open("GET", url, false);
  xmlhttp.send();
}

// used to save the canvas as a png after every load
function getCanvasAsPNG(canvasId, pngName) {
	let uri = document.getElementById(canvasId).toDataURL("image/png");

	var link = document.createElement("a");
	link.download = pngName;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	delete link;
}
