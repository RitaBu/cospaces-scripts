#include "../lib/object_utils.js"

function MyType () {
  this.str = "kekeke";
  this.num = 1337;
  this.func = function() { DX.log("hello"); }
}

var obj = {};
obj["MyType"] = [
    new MyType()
];

obj["MyType"][0].func();

var objStr = Serializer.serialize(obj);

DX.log("custom serialization: " + objStr);

var restoredObj = Serializer.parse(objStr);

restoredObj["MyType"][0].func();