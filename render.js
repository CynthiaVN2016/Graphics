function render(scene) {
  var camera = scene.camera,
      objects = scene.objects,
      lights = scene.lights;

  var eyeVector = Vector.unitVector(Vector.subtract(camera.vector, camera.point)),
      vpRight = Vector.unitVector(Vector.crossProduct(eyeVector, Vector.UP)),
      vpUp = Vector.unitVector(Vector.crossProduct(vpRight, eyeVector)),
      fovRadians = Math.PI * (camera.fieldOfView / 2) / 180,
      heightWidthRatio = height / width,
      halfWidth = Math.tan(fovRadians),
      halfHeight = heightWidthRatio * halfWidth,
      camerawidth = halfWidth * 2,
      cameraheight = halfHeight * 2,
      pixelWidth = camerawidth / (width - 1),
      pixelHeight = cameraheight / (height - 1);

    var index, color;
    var ray = {
        point: camera.point
    };
    var xmax = 0, xmin = 0;
    var ymax = 0, ymin = 0;
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          var xcomp = Vector.scale(vpRight, (x * pixelWidth) - halfWidth),
               ycomp = Vector.scale(vpUp, (y * pixelHeight) - halfHeight);
               // var xcomp = Vector.scale(vpRight, x),
               //      ycomp = Vector.scale(vpUp, y);

               if (xcomp.x > xmax) xmax = xcomp.x;
               if (xcomp.x < xmin) xmin = xcomp.x;
               if (ycomp.y > ymax) ymax = ycomp.y;
               if (ycomp.y < ymin) ymin = ycomp.y;

           ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));
           color = trace(ray, scene, 0);
           index = (x * 4) + (y * width * 4),
           data.data[index + 0] = color.x;
           data.data[index + 1] = color.y;
           data.data[index + 2] = color.z;
           data.data[index + 3] = 255;
       }
   }

   ctx.putImageData(data, 0, 0);
 }
