// Checks intersection point of a ray and the objects in the scene
// Return appropriate color of the pixel by calling surface
function trace(ray, scene, depth) {
  if (depth > 3) return;

  var distObject = intersectScene(ray, scene);
  if (distObject[0] === Infinity) {
      return Vector.WHITE;
  }

  var dist = distObject[0],
      object = distObject[1];

  var pointAtTime = Vector.add(ray.point, Vector.scale(ray.vector, dist));
  if (object.type == 'sphere')
    normal = sphereNormal(object, pointAtTime);
  else if (object.type == 'triangle')
    normal = triNormal(object);

  return surface(ray, scene, object, pointAtTime, normal, depth);
}
