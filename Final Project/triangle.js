
// ## Detecting collisions against a triangle

//
function triIntersection(tri, ray) {

  var pointA = tri.point1;
  var pointB = tri.point2;
  var pointC = tri.point3;

  var a = pointA.x - pointB.x;
  var b = pointA.y - pointB.y;
  var c = pointA.z - pointB.z;
  var d = pointA.x - pointC.x;
  var e = pointA.y - pointC.y;
  var f = pointA.z - pointC.z;
  var g = ray.vector.x;
  var h = ray.vector.y;
  var i = ray.vector.z;
  var j = pointA.x - ray.point.x;
  var k = pointA.y - ray.point.y;
  var l = pointA.z - ray.point.z;

  var ei_hf = (e*i) - (h*f);
  var gf_di = (g*f) - (d*i);
  var dh_eg = (d*h) - (e*g);
  var ak_jb = (a*k) - (j*b);
  var jc_al = (j*c) - (a*l);
  var bl_kc = (b*l) - (k*c);

  var bigM = a*ei_hf + b*gf_di + c*dh_eg;
  var betaTop = j*ei_hf + k*gf_di + l*dh_eg;
  var weirdTop = i*ak_jb + h*jc_al + g*bl_kc;
  var tTop = -1*(f*ak_jb + e*jc_al + d*bl_kc);

  var weird = weirdTop/bigM;
  if (weird < 0 || weird > 1)
    return;
  var beta = betaTop/bigM;
  if (beta < 0 || beta > (1-weird))
    return;
  var t = tTop/bigM;
  if (t < .001)
    return;

  return t;

}

// A normal is, at each point on the surface of a sphere or some other object,
// a vector that's perpendicular to the surface and radiates outward. We need
// to know this so that we can calculate the way that a ray reflects off of
// a surface.
function triNormal(tri) {
  var pointA = tri.point1;
  var pointB = tri.point2;
  var pointC = tri.point3;

  var bmina = Vector.subtract(pointB, pointA);
  var cmina = Vector.subtract(pointC, pointA);
  var normal = Vector.unitVector(Vector.crossProduct(bmina, cmina));
  return normal;
}

// Finds the correct face associated w/ the triangle and color it
function findTriColor(scene, object, pointAtTime) {
    var face = object.image;
    var imageData = images[face];
    var uScaled, vScaled;
    var index;

    // var uDir = Vector.subtract(p1, p2),
    //     vDir = Vector.subtract(p3, p2);

    if (face == POSZ || face == NEGZ) { // using the x & y coordinates
      uScaled = ( pointAtTime.x / 10 + 0.5) * 1024;
      vScaled = ( pointAtTime.y / 10 + 0.5) * 1024;

      var uPixel = Math.floor(uScaled),
          vPixel = Math.floor(vScaled);

      index = ((vPixel * 4 * 1024) + ((1024-uPixel) * 4));

    } else if (face == POSY) { // using the x & z coordinates
      uScaled = ( pointAtTime.x / 10 + 0.5) * 1024;
      vScaled = ( pointAtTime.z / 10 + 0.5) * 1024;

      var uPixel = Math.floor(uScaled),
          vPixel = Math.floor(vScaled);

      index = (((1024-vPixel) * 4 * 1024) + ((1024-uPixel) * 4));

    } else if (face == NEGX) { // using the y & z coordinates
      uScaled = ( pointAtTime.z / 10 + 0.5) * 1024;
      vScaled = ( pointAtTime.y / 10 + 0.5) * 1024;

      var uPixel = Math.floor(uScaled),
          vPixel = Math.floor(vScaled);

      index = ((vPixel * 4 * 1024) + ((1024-uPixel) * 4));

    } else if (face == POSX) { // using the y & z coordinates
      uScaled = ( pointAtTime.z / 10 + 0.5) * 1024;
      vScaled = ( pointAtTime.y / 10 + 0.5) * 1024;

      var uPixel = Math.floor(uScaled),
          vPixel = Math.floor(vScaled);

      index = ((vPixel * 4 * 1024) + (uPixel * 4));

    } else { // using the x & z coordinates
      uScaled = ( pointAtTime.x / 10 + 0.5) * 1024;
      vScaled = ( pointAtTime.z / 10 + 0.5) * 1024;

      var uPixel = Math.floor(uScaled),
          vPixel = Math.floor(vScaled);

      index = ((vPixel * 4 * 1024) + ((1024-uPixel) * 4));
    }


    var red = imageData[index],
        green = imageData[index+1],
        blue = imageData[index+2];

    return {x:red, y:green, z:blue};
}
