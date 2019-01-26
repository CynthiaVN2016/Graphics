function intersectScene(ray, scene) {
  var closest = [Infinity, null];
  for (var i = 0; i < scene.objects.length; i++) {
       var object = scene.objects[i];
          if (object.type == 'sphere')
           dist = sphereIntersection(object, ray);
          else if (object.type == 'triangle')
            dist = triIntersection(object, ray);
       if (dist !== undefined && dist < closest[0]) {
           closest = [dist, object];
       }
   }
   return closest;
}
