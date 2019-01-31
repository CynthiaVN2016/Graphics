
// Determines the image of the pixel by
// seeing where the ray intersects and where it reflects
function surface(ray, scene, object, pointAtTime, normal, depth) {

  var b = object.color,
      c = Vector.ZERO,
      lambertAmount = 0;

  // Finds corresponding environment face after reflecting the ray
  if (object.type == 'sphere')
    b = findFaceAndColor(scene, Vector.reflectThrough(ray.vector, normal));
  else if (object.type == 'triangle')
    return findTriColor(scene, object, pointAtTime);

    // Shows gradations from the most lit point on the object to the least
    if (object.lambert) {
      for (var i = 0; i < scene.lights.length; i++) {
        var lightPoint = scene.lights[0];

        // if not visible, do not even bother
        if (isLightVisible(pointAtTime, scene, lightPoint)){
              var contribution = Vector.dotProduct(Vector.unitVector(
                 				Vector.subtract(lightPoint, pointAtTime)), normal);
             	if (contribution > 0) lambertAmount += contribution;
        }
      }
    }

    // with specular surfaces bounce off and acquire the colors of other objects they bounce into.
    if (object.specular) {

      var reflectedRay = {
            point: pointAtTime,
            vector: Vector.reflectThrough(ray.vector, normal)
          };
      var reflectedColor = trace(reflectedRay, scene, ++depth);
      if (reflectedColor)
        c = Vector.add(c, Vector.scale(reflectedColor, object.specular));
    }

    // **Ambient** lighting
    return Vector.add3(c,
       Vector.scale(b, lambertAmount * object.lambert),
       Vector.scale(b, object.ambient));
}


function isLightVisible(pt, scene, light) {
    var distObject =  intersectScene({
        point: pt,
        vector: Vector.unitVector(Vector.subtract(pt, light))
    }, scene);
    return distObject[0] > -0.005;
}
