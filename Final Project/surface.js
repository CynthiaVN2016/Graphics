
// If `trace()` determines that a ray intersected with an object, `surface`
// decides what color it acquires from the interaction.

//updated from original to have types for lights and colors for lambertAmount to account for light colors

function surface(ray, scene, object, pointAtTime, normal, depth) {

  var b = object.color,
          c = Vector.ZERO,
          lambertAmount = 0;

  if (object.type == 'sphere') {
    if ( toReflect || !toRefract )
      b = findFaceAndColor(scene, Vector.reflectThrough(ray.vector, normal));
    else
      b = findFaceAndColor(scene, Vector.refractThrough(ray.vector, normal));
  }
  else if (object.type == 'triangle')
    return findTriColor(scene, object, pointAtTime);

    // **[Lambert shading](http://en.wikipedia.org/wiki/Lambertian_reflectance)**
    // is our pretty shading, which shows gradations from the most lit point on
    // the object to the least.
    if (object.lambert) {
          for (var i = 0; i < scene.lights.length; i++) {
              var lightPoint = scene.lights[0];

            // First: can we see the light? If not, this is a shadowy area
            // and it gets no light from the lambert shading process.

           if (isLightVisible(pointAtTime, scene, lightPoint)){
            // Otherwise, calculate the lambertian reflectance, which
            // essentially is a 'diffuse' lighting system - direct light
            // is bright, and from there, less direct light is gradually,
            // beautifully, less light.

           	var contribution = Vector.dotProduct(Vector.unitVector(
               				Vector.subtract(lightPoint, pointAtTime)), normal);
           	if (contribution > 0) lambertAmount += contribution;

          }
      }
    }


    //  adjust lit color by object color and divide by 255 since light color is 0 to 255
    // lambertAmount = Vector.compScale(lambertAmount, b);
    // lambertAmount = Vector.scale (lambertAmount, object.lambert);
    // lambertAmount = Vector.scale(lambertAmount, 1./255.);

    // **[Specular](https://en.wikipedia.org/wiki/Specular_reflection)** is a fancy word for 'reflective': rays that hit objects
    // with specular surfaces bounce off and acquire the colors of other objects
    // they bounce into.
      if (object.specular) {

        // This is basically the same thing as what we did in `render()`, just
        // instead of looking from the viewpoint of the camera, we're looking
        // from a point on the surface of a shiny object, seeing what it sees
        // and making that part of a reflection.
        var reflectedRay = {
              point: pointAtTime,
              vector: Vector.reflectThrough(ray.vector, normal)
          };
          var reflectedColor = trace(reflectedRay, scene, ++depth);
          if (reflectedColor) {
              c = Vector.add(c, Vector.scale(reflectedColor, object.specular));
          }
      }


    // lambert should never 'blow out' the lighting of an object,
    // even if the ray bounces between a lot of things and hits lights
// u lambertAmount is scaled and clamped
   // lambertAmount = Vector.scale(lambertAmount, 1./255.);
   // lambertAmount = Math.min(1, lambertAmount);

    // **Ambient** colors shine bright regardless of whether there's a light visible -
    // a circle with a totally ambient blue color will always just be a flat blue
    // circle.
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
