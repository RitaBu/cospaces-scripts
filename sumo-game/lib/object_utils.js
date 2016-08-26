#ifndef OBJECT_UTILS_H
#define OBJECT_UTILS_H

Object.prototype.getName = function() { //get "type" from object
  var funcNameRegex = /function (.{1,})\(/;
  var results = (funcNameRegex).exec((this).constructor.toString());
  var resStr = (results && results.length > 1) ? results[1] : "";
  return resStr;
};

function getName(ctr) { //get "type" from object constructor
  var temp = new ctr();
  return temp.getName();
}

var Serializer = (function() {
  function ObjectWrapper(objectType) {
    this.wrapperType = "object_wrapper";
    this.objectType = objectType;
  }

  function FunctionWrapper(func) {
    this.wrapperType = "function_wrapper";
    this.functionSource = func.toString();
  }

  function serializeArray(arr) {
    var res = [];
    for(var i = 0; i < arr.length; i++) {
      switch(typeof arr[i]) {
        case "function":
          res.push(new FunctionWrapper(arr[i]));
          break;
        case "object":
          if(arr[i] === null) {
            res.push(arr[i]);
          } else {
            if (Array.isArray(arr[i])) {
              res.push(serializeArray[arr[i]]);
            } else {
              res.push(serializeWithFunctions(arr[i]));
            }
          }
          break;
        default:
          res.push(arr[i]);
          break;
      }
    }
    return res;
  }


  function serializeWithFunctions(obj) {
    var res = new ObjectWrapper(obj.getName());
    for(prop in obj) {
      if(!obj.hasOwnProperty(prop)) continue;

      switch(typeof obj[prop]) {
        case "function":
          res[prop] = new FunctionWrapper(obj[prop]);
          break;
        case "object":
          if(obj[prop] === null) {
            res[prop] = null;
          } else {
            if (Array.isArray(obj[prop])) {
              res[prop] = serializeArray(obj[prop]);
            } else {
              res[prop] = serializeWithFunctions(obj[prop]);
            }
          }
          break;
        default:
          res[prop] = obj[prop];
          break;
      }
    }
    return res;

  }

  function parseArray(arr) {
    var res = [];
    for(var i = 0; i < arr.length; i++) {
      switch(typeof arr[i]) {
        case "object":
            if(arr[i] === null) {
              res.push(arr[i]);
            } else {
              if (Array.isArray(arr[i])) {
                res.push(parseArray[arr[i]]);
              } else {
                if (arr[i].wrapperType === "object_wrapper") {
                  res.push(parseWithFunctions(arr[i]));
                }
                if (arr[i].wrapperType === "function_wrapper") {
                  eval("res.push(" + arr[i].functionSource + ");");
                }
              }
            }
          break;
        default:
            res.push(arr[i]);
          break;
      }
    }
    return res;
  }

  function parseWithFunctions(obj) {
    var res = null;
    if(obj.objectType.length > 0) {
      eval("res = new " + obj.objectType + "();");
    } else {
      res = {};
    }
    
    for(prop in obj) {
      if(!obj.hasOwnProperty(prop)) continue;
      if(prop === "objectType") continue;
      if(prop === "wrapperType") continue;
      switch(typeof obj[prop]) {
        case "object":
            if(obj[prop] === null) {
              res[prop] = null;
            } else {
              if (Array.isArray(obj[prop])) {
                res[prop] = parseArray(obj[prop]);
              } else {
                if (obj[prop].wrapperType === "object_wrapper") {
                  res[prop] = parseWithFunctions(obj[prop]);
                }
                if (obj[prop].wrapperType === "function_wrapper") {
                  if (!res.hasOwnProperty(prop)) {
                    eval("res[prop] = " + obj[prop].functionSource + ";");
                  }
                }
              }
            }
          break;
        default:
            res[prop] = obj[prop];
          break;
      }
    }
    return res;
  }

  return {
    serialize : function(obj) { return JSON.stringify(serializeWithFunctions(obj)); },
    parse : function(str) { return parseWithFunctions(JSON.parse(str)); }
  };
})();


#endif