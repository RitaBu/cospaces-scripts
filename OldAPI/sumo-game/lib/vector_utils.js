#ifndef VECTOR_UTILS_JS
#define VECTOR_UTILS_JS

#include "api_adapter.js"

function vec3add(vec1, vec2) {
  var res = {};
  res[0] = vec1[0] + vec2[0];
  res[1] = vec1[1] + vec2[1];
  res[2] = vec1[2] + vec2[2];
  return res;
}

function vec3mul(vec1, scalar) {
  var res = {};
  res[0] = vec1[0] * scalar;
  res[1] = vec1[1] * scalar;
  res[2] = vec1[2] * scalar;
  return res;
}

function vec3isEqual(vec1, vec2) {
  return vec1[0] == vec2[0] && vec1[1] == vec2[1] && vec1[2] == vec2[2];
}

function vec3sub(vec1, vec2) {
  var negVec2 = vec3mul(vec2, -1);
  return vec3add(vec1, negVec2);
}

function vec3lengthSquared(vec) {
  return vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2];
}

function vec3length(vec) {
  return Math.sqrt(vec3lengthSquared(vec));
}

function vec3getNormal(vec) {
  if(vec3lengthSquared(vec) > 0) {
    return vec3mul(vec, 1.0 / Math.sqrt(vec3lengthSquared(vec)));
  } else {
    return vec;
  }
}

function setRotationAroundZAxis(itemId, angle) {
  var item = DX.item(itemId);
  if(item === null) return;
  var pos = item.position();
  //item.moveToPos(pos[0], pos[1], pos[2], 0, 0, Math.sin(angle / 2), Math.cos(angle / 2));
  item.setLocalRotation(0, 0, Math.sin(angle / 2), Math.cos(angle / 2));
}

#endif