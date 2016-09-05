#ifndef COLOR_JS
#define COLOR_JS
function Color(name,r,g,b) {
    this.name = name;
    this.r = r;
    this.g = g;
    this.b = b;
}

var indigo = new Color("Dingo", 63,81,181);
var orange = new Color("Apfelsin", 255,152,181);
var deepPurple = new Color("Rocker", 103,58,183);
var green = new Color("Punk", 76,175,80);
var black= new Color("Noob", 0,0,0);
var white = new Color("Sansei", 255,255,255);
var red = new Color("Aka", 244,67,54);
var brown = new Color("Brawny", 121,85,72);
var colors = [indigo, orange, deepPurple, green, white, black, red, brown];

#endif