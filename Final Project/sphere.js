
function sphereIntersection(sphere, ray) {
    var eye_to_center = Vector.subtract(sphere.point, ray.point),
        v = Vector.dotProduct(eye_to_center, ray.vector),
        eoDot = Vector.dotProduct(eye_to_center, eye_to_center),
        discriminant = (sphere.radius * sphere.radius) - eoDot + (v * v);
    if (discriminant < 0) {
        return;
    } else {
      return v - Math.sqrt(discriminant);
    }
}


function sphereNormal(sphere, pos) {

    return Vector.unitVector(
        Vector.subtract(pos, sphere.point));
}

// takes one face's imagedata and find the pixel associated with either the
// reflected or refractedRay
function envMapColor(face, reflectedRay) {
  var imageData = images[face];
  var xComp = Math.abs(reflectedRay.x),
      yComp = Math.abs(reflectedRay.y),
      zComp = Math.abs(reflectedRay.z);

  var uScaled, vScaled;

  if ( face == POSZ || face == NEGZ) {
    uScaled = ( (reflectedRay.x/zComp) / 2 + 0.5) * 1024; // normalizes to be in range [0,1024]
    vScaled = ( (reflectedRay.y/zComp) / 2 + 0.5) * 1024;
  } else if ( face == POSX || face == NEGX) {
    uScaled = ( (reflectedRay.z/xComp) / 2 + 0.5) * 1024;
    vScaled = ( (reflectedRay.y/xComp) / 2 + 0.5) * 1024;
  } else {
    uScaled = ( (reflectedRay.x/yComp) / 2 + 0.5) * 1024;
    vScaled = ( (reflectedRay.z/yComp) / 2 + 0.5) * 1024;
  }

    var uPixel = Math.floor(uScaled),
        vPixel = Math.floor(vScaled);

    // Could fix this better. Probably has to deal with orientation
    // of images in relation to the outgoing rays, but didn't have time to fix
    var index;
    if (face == NEGY)
      index = ((vPixel * 4 * 1024) + ((1024-uPixel) * 4));
    else if (face == NEGZ)
          index = (((1024-vPixel) * 4 * 1024) + (uPixel * 4));
    else
      index = (((1024-vPixel) * 4 * 1024) + ((1024-uPixel) * 4));

    var red = imageData[index],
        green = imageData[index+1],
        blue = imageData[index+2];

    return {x:red, y:green, z:blue};
  }

// Finds the correct face based on the reflectedRay
// the reflectedRay might actually be the refractedRay
function findFaceAndColor(scene, reflectedRay) {

  var xComp = Math.abs(reflectedRay.x),
      yComp = Math.abs(reflectedRay.y),
      zComp = Math.abs(reflectedRay.z);

  if ( xComp >= yComp && xComp >= zComp ) {
    if ( reflectedRay.x <= 0 ) { // idk why postivie exactly. I think direction based on center of points
        return envMapColor(POSX, reflectedRay);
    }
    else
      return envMapColor(NEGX, reflectedRay);
  }
  else if ( yComp > xComp && yComp >= zComp ) {
    if ( reflectedRay.y > 0)
      return envMapColor(POSY, reflectedRay);
    else
      return envMapColor(NEGY, reflectedRay);
  }
  else {
    if ( reflectedRay.z > 0) {
      return envMapColor(NEGZ, reflectedRay);
    }
    else 
      return envMapColor(POSZ, reflectedRay);
  }
}
