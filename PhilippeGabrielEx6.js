/*
* @Philippe Gabriel
* @Version 1.0 2020-02-17
*
* This program aims to draw a target with a defined amount of rings which in
* turn are composed of hexagons with defined lengths
**/

var count = 0;    //Integer indicating amount of polygons drawn
var horzDist = 0; //Integer used for the turtle's horizontal displacement
var vertDist = 0; //Integer used for the turtle's vertical displacement

/*
* The repositionTurtle procedure sets the turtle in place for the drawing of
* the subsequent shapes located on the same ring or for setting up the drawing
* of the shapes on the next ring
*
* @param side Integer representing the side length of the polygon
* @param nbPoly Integer indicating the number of polygons to draw
**/

var repositionTurtle = function(side, nbPoly) {
    var step = nbPoly/6; //Variable determining the amount of hexagons per step
    pu();

    //With respect to the drawn amount of hexagons within specific step ranges,
    //different positioning procedures are ensued
    if (count < step) {
        fd(0, horzDist * 2);
    } else if (count < (2*step)) {
        fd(vertDist, horzDist);
    } else if (count < (3*step)) {
        fd(vertDist,-horzDist);
    } else if (count < (4*step)) {
        bk(0,horzDist * 2);
    } else if (count < (5*step)) {
        bk(vertDist, horzDist);
    } else if (count < (6*step)) {
        bk(vertDist, -horzDist);
    } else {
        bk(3*side);
    }
    pd();
};

/*
* The regHexagon procedure draws a given amount of hexagons with defined side
* length
*
* @param side Integer representing the side length of the polygon
* @param nbPoly Integer indicating the number of polygons to draw
**/

var regHexagon = function(side, nbPoly) {

    while (count < nbPoly) {
        for (var j = 1; j <= 6; j++) {
            fd(side);
            rt(60);
        }
        count++;
        repositionTurtle(side, nbPoly);
    }

};

/*
* The cible procedure initiates the drawing of a target ring filled with
* hexagons with a defined length and specified amount of rings
*
* @param cote Integer representing the side length of the polygon
* @param n Integer indicating the number of rings the target will have
**/

var cible = function (cote, n) {

    //The displacements are set with respect to the side length defined
    horzDist = Math.cos(Math.PI/6) * cote;
    vertDist = Math.sin(Math.PI/6) * cote + cote;

    for (var i = 1; i <= n; i++) {

        //The drawing of the first ring composed of a single hexagon is a
        //special case in the sequence of hexagons of subsequent rings
        regHexagon(cote, (i != 1 ? 12*(i-1) : i));

        count = 0; //Variable reinitialized for the next ring
    }
};

cible(10, 3);