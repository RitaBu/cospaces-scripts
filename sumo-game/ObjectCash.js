#ifndef OBJECT_CASH_JS
#define OBJECT_CASH_JS

function ObjectCash(obj) {
    var thisRef = this;
    this.temp = {};
    for(var prop in obj) {
        if(!obj.hasOwnProperty(prop) || typeof obj[prop] == "function" || typeof obj[prop] == "object") {
            continue;
        }
        (function(prop_value){
            thisRef.temp[prop] = prop_value;
        })(obj[prop]);
        DX.log("cache stringify: " + JSON.stringify(this));
        //this.temp[prop] = obj[prop];
    }
}

ObjectCash.prototype.restore = function(obj) {
    for(var prop in this.temp) {
        if(!this.temp.hasOwnProperty(prop) ||
            typeof this.temp[prop] == "function" ||
            typeof this.temp[prop] == "object") {
            continue;
        }
        obj[prop] = this.temp[prop];
    }
}


#endif
