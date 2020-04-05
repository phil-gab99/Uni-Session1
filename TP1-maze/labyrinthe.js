/*
* @Vincent Falardeau
* @Philippe Gabriel
* @Version 2.4.44 2020-03-11
*
* This program aims to generate a random labyrinth in the drawing window with
* respect to given specifications while also offering the possibilty for a
* robot to traverse the labyrinth from its entrance to its exit following a
* Pledge algorithm
**/

/*
* The iota function is responsible for creating an array of determined length
* filled with integer values at its indexes ranging from 0 up to n-1
*
* @param n Integer indicating the length of the array to return
* @return table Array with the set length and values at its indexes ranging
* from 0 to n - 1 and null for an invalid n value
**/

var iota = function(n) {
    var table = [];
    if(Math.floor(n) == n && n >= 0) {
        table = Array(n);
        for (var i = 0; i < table.length; i++) {
            table[i] = i;
        }
    }
    return table;
};

/*
* The contient function determines if a given value is found within a given
* array
*
* @param tab Array which will be analyzed
* @param x Integer compared with every value in the array
* @return contains Boolean determining whether there is correspondance or not
* between a value from the given array and the given integer value
**/

var contient = function(tab, x) {
    var contains = true;
    for (var i = 0; i < tab.length; i++) {
        if (tab[i] === x) {
            return contains;
        }
    }
    return !contains;
};

/*
* The ajouter function pushes a given value onto a given array if the given
* value is not already within the given array
*
* @param tab Array which will be analyzed
* @param x Integer to push onto the array copy
* @return tab Initial array with or without an additional indicated integer
* value with respect to whether the value is absent or not
**/

var ajouter = function(tab, x) {
    if(!contient(tab, x)) {
        tab.push(x);
    }
    return tab;
};

/*
* The retirer function pops a given value off of a given array if the value is
* present within the array through a copy of the given array
*
* @param tab Array which will be analyzed
* @param x Integer to not include in the array copy
* @return newTab Copy of given array without an indicated integer value
**/

var retirer = function(tab, x) {
    var newTab = [];
    for (var i = 0; i < tab.length; i++) {
        if (tab[i] != x) {
            newTab.push(tab[i]);
        }
    }
    return newTab;
};

/*
* The voisins function identifies neighboring cells of a current cell for which
* its coordinates were given with respect to the grid dimensions, diagonal
* neighbor cells are not considered
*
* @param x Horizontal coordinate of the cell
* @param y Vertical coordinate of the cell
* @param nx Height value of the grid in cell units
* @param ny Width value of the grid in cell units
* @return tabNeighbor Array containing the cell number tags of the cells
* neighboring the current cell for which its horizontal and vertical
* coordinates were given
**/

var voisins = function(x, y, nx, ny) {

    var tabNeighbor = [];
    var currCell = x + y * nx; //Current cell number tag from given coordinates

    //North (above current cell)
    if (currCell - nx >= 0) {
        tabNeighbor.push(currCell - nx);
    }
    //East (right of current cell)
    if ((currCell + 1) % nx > 0) {
        tabNeighbor.push(currCell + 1);
    }
    //South (below current cell)
    if (currCell + nx < nx * ny) {
        tabNeighbor.push(currCell + nx);
    }
    //West (left of current cell)
    if (currCell % nx > 0) {
        tabNeighbor.push(currCell - 1);
    }

    return tabNeighbor;
};

/*
* The indexToCoords function is responsible for determining a cell's
* coordinates in the horizontal and vertical plane with the cell's number tag
* and with respect to the grid's dimensions
*
* @param cellTag Integer indicating the cell number tag
* @param nx Height value of the grid in cell units
* @return coords Object containing the cell's horizontal and vertical
* coordinates respectively
**/

var indexToCoords = function(cellTag, nx) {
    if (nx == Math.floor(nx) && nx > 0) {
        var coords = {
            x: cellTag % nx,
            y: Math.floor(cellTag / nx)
        };
        return coords;
    }
};

/*
* The reposition procedure repositions the turtle so as to center the labyrinth
* on the drawing window with respect to the given dimensions of the grid and
* given cell side length or alternatively positions the turtle as to prepare it
* for the undertaking of the Pledge algorithm
*
* @param nx The width of the grid in cell units
* @param ny The height of the grid in cell units
* @param pas The length of each cell wall in pixel units
* @param pledge Boolean indicating whether Pledge algorithm is applied or not
* in order for more specific positioning and preparations
**/

var reposition = function(nx, ny, pas, pledge) {
    if(!pledge) {
        pu();
        mv((nx/2 * pas), (ny/2 * pas));
        rt(180);
    } else {
        mv(-(nx/2 * pas), (ny/2 * pas));
        fd(pas/2, pas/2);
        rt(90);
        setpc(1,0,0);
        pd();
        fd(pas);
    }
    pd();
};

/*
* The grid procedure draws a grid of specified cell dimensions with specified
* side lengths
*
* @param nx The width of the grid in cell units
* @param ny The height of the grid in cell units
* @param pas The length of each cell wall in pixel units
* @param mursV Array containing mapping of vertical walls to draw
* @param mursH Array containing mapping of horizontal walls to draw
**/

var grid = function(nx, ny, pas, mursV, mursH) {

    reposition(nx, ny, pas, false);

    //Vertical walls
    for (var i = 0; i < mursV.length; i++) {

        //Position turtle for next vertical wall of the set
        pu();
        bk(pas, -pas);
        pd();

        //Position turtle for next set of vertical walls
        if (i % (nx + 1) == 0) {
            pu();
            fd(pas, -(nx + 1) * pas);
            pd();
        }

        pd();
        //Determine whether wall is to be drawn or not
        if (mursV[i] == null) {
            pu();
        }
        fd(pas);
    }

    pu();
    lt(90);
    bk(0, -(ny + 1) * pas);
    pd();

    //Horizontal walls
    for (var i = 0; i < mursH.length; i++) {

        //Position turtle for next set of horizontal walls
        if (i % nx == 0) {
            pu();
            bk(pas * nx, pas);
            pd();
        }

        pd();
        //Determine whether wall is to be drawn or not
        if (mursH[i] == null) {
            pu();
        }
        fd(pas);
    }
};

/*
* The wallMap function randomly maps the vertical and horizontal walls
* necessary for generating a labyrinth with randomized path and a single path
* leading from the entrance to the exit with given dimensions
*
* @param nx The width of the labyrinth in cell units
* @param ny The height of the labyrinth in cell units
* @return walls Object holding the generated arrays mapping the vertical
* and horizontal walls
**/

var wallMap = function(nx, ny) {

    var cave = [0];                    //Array with cells within the cavity
    var front = voisins(0, 0, nx, ny); //Array with cells neighboring cavity

    var newCell;         //Cell to add onto cavity
    var newCellNeighbor; //Cells neighboring new cell

    var coordsCell;     //New cell coordinates for various purposes
    var coordsNeighbor; //New cell neigbor coordinates for various purposes

    //Null value at index indicates corresponding wall will not be drawn
    var mursH = iota(nx * (ny + 1)); //Array indexing horizontal walls
    var mursV = iota((nx + 1) * ny); //Array indexing vertical walls
    mursH[0] = null;                 //Entrance set by default
    mursH[mursH.length - 1] = null;  //Exit set by default

    var legalWalls;   //Array containing legal walls not to draw
    var randWall = 0; //Random index for determining which wall not to draw

    while(cave.length < nx * ny) {

        legalWalls = []; //Array is initialized for analysis of a new cell

        //Random front cell selected to add onto cave and remove from front
        newCell = front[Math.floor(Math.random() * front.length)];
        cave = ajouter(cave, newCell);
        front = retirer(front, newCell);

        //New cell neighbors preemptively stored for legal walls
        coordsCell = indexToCoords(newCell, nx);
        newCellNeighbor = voisins(coordsCell.x, coordsCell.y, nx, ny);

        for (var i = 0; i < newCellNeighbor.length; i++) {
            if (contient(cave, newCellNeighbor[i])) {

                //Cavity cell vertical coordinate is needed for conditions
                coordsNeighbor = indexToCoords(newCellNeighbor[i], nx);

                //Special conditions determining legal walls not to draw
                //Top wall of cell
                if (newCellNeighbor[i] + nx == newCell) {
                    legalWalls.push(newCell);

                //Bottom wall of cell
                } else if (newCellNeighbor[i] == newCell + nx) {
                    legalWalls.push(newCell + nx);

                //Left wall of cell
                } else if (newCellNeighbor[i] + coordsNeighbor.y + 1 ==
                newCell + coordsCell.y) {
                    legalWalls.push(newCell + coordsCell.y);

                //Right wall of cell
                } else {
                    legalWalls.push(newCell + coordsCell.y + 1);
                }

            } else {
                front = ajouter(front, newCellNeighbor[i]);
            }
        }

        //Random index among legal walls to remove is chosen
        randWall = Math.floor(Math.random() * legalWalls.length);

        if ((legalWalls[randWall] == newCell && coordsCell.y != 0)
        || (legalWalls[randWall] == newCell + nx
        && coordsCell.y - (ny - 1) != 0)) {
            mursH[legalWalls[randWall]] = null;
        } else {
            mursV[legalWalls[randWall]] = null;
        }
    }

    var walls = {
        v: mursV,
        h: mursH
    };

    return walls;
};

/*
* The laby procedure creates a labyrinth with randomized paths including a path
* from an entrance to an exit with given dimensions and a given length for each
* cell
*
* @param nx The width of the labyrinth in cell units
* @param ny The height of the labyrinth in cell units
* @param pas The length of each cell wall in pixel units
**/

var laby = function(nx, ny, pas) {

    //Conditions indicating invalid input
    if (nx != Math.floor(nx) || ny != Math.floor(ny)
    || nx <= 0 || ny <= 0 || pas <= 0) {
        return; //Exit procedure in case of invalid input
    }

    //Randomized mapping for vertical and horizontal walls is retrieved
    var walls = wallMap(nx, ny);
    grid(nx, ny, pas, walls.v, walls.h); //The labyrinth is generated
};

/*
* The labySol procedure creates a labyrinth with given dimensions and given
* cell side length and applies a Pledge algorithm so as to simulate the
* trajectory of a robot from the entrance of the labyrinth to its exit
*
* @param nx The width of the labyrinth in cell units
* @param ny The height of the labyrinth in cell units
* @param pas The length of each cell wall in pixel units
**/

var labySol = function (nx, ny, pas) {

    //Conditions indicating invalid input
    if (nx != Math.floor(nx) || ny != Math.floor(ny)
    || nx <= 0 || ny <= 0 || pas <= 0) {
        return; //Exit procedure in case of invalid input
    }

    //Randomized mapping for vertical and horizontal walls is retrieved
    var walls = wallMap(nx, ny);
    grid(nx, ny, pas, walls.v, walls.h); //The labyrinth is generated

    //The robot is positioned past the entrance
    reposition(nx, ny, pas, true);

    var cellPos = 0; //Cell tag occupied by robot
    var count = 0;   //Counter determining direction robot is facing
    var yCellPos;    //Vertical coordinate of cell position required for moving

    //Set of booleans determining from which initial direction robot turned
    var fromDown  = false;
    var fromRight = false;
    var fromUp    = false;
    var fromLeft  = false;

    walls.h[0] = 0;  //Entrance wall is shut off to avoid exiting from entrance

    if (Math.random() < 0.5) { //Test for determining side-Pledge to undertake

        do { //Left-hand Pledge

            yCellPos = indexToCoords(cellPos, nx).y;

            if (count == 0) {             //Initial downward configuration

                //No obstacle initiates forward move
                if (cellPos + nx != walls.h[cellPos + nx]) {

                    //Check if wall shut-off originated from left direction
                    //Revert temporary shut-off
                    if (fromLeft) {
                        walls.v[cellPos + yCellPos + 1] = null;
                        fromLeft = false;
                    }

                    fd(pas);
                    cellPos += nx;

                //Forward obstacle initiates Left-hand Pledge
                } else if (cellPos + nx == walls.h[cellPos + nx]) {
                    count--;
                    rt(90);
                }

            } else if (count % 4 == -1) { //Facing left

                //No left hand wall initiates left turn
                if (cellPos + nx != walls.h[cellPos + nx]) {
                    count++;
                    lt(90);

                    //Shutting off right wall and alerting origin of shut-off
                    walls.v[cellPos + yCellPos + 1] = cellPos + yCellPos + 1;
                    fromLeft = true;

                //Left hand wall and no front obstacle initiates forward move
                } else if (cellPos + nx == walls.h[cellPos + nx]
                && cellPos + yCellPos != walls.v[cellPos + yCellPos]) {

                    //Check if wall shut-off originated from up direction
                    //Revert temporary shut-off
                    if (fromUp) {
                        walls.h[cellPos + nx] = null;
                        fromUp = false;
                    }

                    fd(pas);
                    cellPos--;

                //Front obstacle initiates right turn
                } else {
                    count--;
                    rt(90);
                }

            } else if (count % 4 == -2) { //Facing upward

                //No left hand wall initiates left turn
                if (cellPos + yCellPos != walls.v[cellPos + yCellPos]) {
                    count++;
                    lt(90);

                    //Shutting off bottom wall and alerting origin of shut-off
                    walls.h[cellPos + nx] = cellPos + nx;
                    fromUp = true;

                //Left hand wall and no front obstacle initiates forward move
                } else if (cellPos + yCellPos == walls.v[cellPos + yCellPos]
                && cellPos != walls.h[cellPos]) {

                    //Check if wall shut-off originated from right direction
                    //Revert temporary shut-off
                    if (fromRight) {
                        walls.v[cellPos + yCellPos] = null;
                        fromRight = false;
                    }

                    fd(pas);
                    cellPos -= nx;

                //Front obstacle initiates right turn
                } else {
                    count--;
                    rt(90);
                }

            } else if (count % 4 == -3) { //Facing right

                //No left hand wall initiates left turn
                if (cellPos != walls.h[cellPos]) {
                    count++;
                    lt(90);

                    //Shutting off left wall and alerting origin of shut-off
                    walls.v[cellPos + yCellPos] = cellPos + yCellPos;
                    fromRight = true;

                //Left hand wall and no front obstacle initiates forward move
                } else if (cellPos == walls.h[cellPos]
                && cellPos + yCellPos + 1 != walls.v[cellPos + yCellPos + 1]) {

                    //Check if wall shut-off originated from down direction
                    //Revert temporary shut-off
                    if (fromDown) {
                        walls.h[cellPos] = null;
                        fromDown = false;
                    }

                    fd(pas);
                    cellPos++;

                //Front obstacle initiates right turn
                } else {
                    count--;
                    rt(90);
                }

            } else {                      //Facing downward

                //No left hand wall initiates left turn
                if (cellPos + yCellPos + 1 !=
                walls.v[cellPos + yCellPos + 1]) {
                    count++;
                    lt(90);

                    //Shutting off upper wall and alerting origin of shut-off
                    walls.h[cellPos] = cellPos;
                    fromDown = true;

                //Left hand wall and no front obstacle initiates forward move
                } else if (cellPos + yCellPos + 1 ==
                walls.v[cellPos + yCellPos + 1]
                && cellPos + nx != walls.h[cellPos + nx]) {

                    //Check if wall shut-off originated from left direction
                    //Revert temporary shut-off
                    if (fromLeft) {
                        walls.v[cellPos + yCellPos + 1] = null;
                        fromLeft = false;
                    }

                    fd(pas);
                    cellPos += nx;

                //Front obstacle initiates right turn
                } else {
                    count--;
                    rt(90);
                }

            }

        } while (cellPos < nx * ny); //Up until robot reaches exit

    } else {

        do { //Right-hand Pledge

            yCellPos = indexToCoords(cellPos, nx).y;

            if (count == 0) {             //Initial downward configuration

                //No obstacle initiates forward move
                if (cellPos + nx != walls.h[cellPos + nx]) {

                    //Check if wall shut-off originated from left direction
                    //Revert temporary shut-off
                    if (fromRight) {
                        walls.v[cellPos + yCellPos] = null;
                        fromRight = false;
                    }

                    fd(pas);
                    cellPos += nx;

                //Forward obstacle initiates Left-hand Pledge
                } else if (cellPos + nx == walls.h[cellPos + nx]) {
                    count--;
                    lt(90);
                }

            } else if (count % 4 == -1) { //Facing right

                //No right hand wall initiates right turn
                if (cellPos + nx != walls.h[cellPos + nx]) {
                    count++;
                    rt(90);

                    //Shutting off left wall and alerting origin of shut-off
                    walls.v[cellPos + yCellPos] = cellPos + yCellPos;
                    fromRight = true;

                //Right hand wall and no front obstacle initiates forward move
                } else if (cellPos + nx == walls.h[cellPos + nx]
                && cellPos + yCellPos + 1 != walls.v[cellPos + yCellPos + 1]) {

                    //Check if wall shut-off originated from up direction
                    //Revert temporary shut-off
                    if (fromUp) {
                        walls.h[cellPos + nx] = null;
                        fromUp = false;
                    }

                    fd(pas);
                    cellPos++;

                //Front obstacle initiates left turn
                } else {
                    count--;
                    lt(90);
                }

            } else if (count % 4 == -2) { //Facing upward

                //No right hand wall initiates right turn
                if (cellPos + yCellPos + 1 !=
                walls.v[cellPos + yCellPos + 1]) {
                    count++;
                    rt(90);

                    //Shutting off bottom wall and alerting origin of shut-off
                    walls.h[cellPos + nx] = cellPos + nx;
                    fromUp = true;

                //Right hand wall and no front obstacle initiates forward move
                } else if (cellPos + yCellPos + 1 ==
                walls.v[cellPos + yCellPos + 1]
                && cellPos != walls.h[cellPos]) {

                    //Check if wall shut-off originated from left direction
                    //Revert temporary shut-off
                    if (fromLeft) {
                        walls.v[cellPos + yCellPos + 1] = null;
                        fromLeft = false;
                    }

                    fd(pas);
                    cellPos -= nx;

                //Front obstacle initiates left turn
                } else {
                    count--;
                    lt(90);
                }

            } else if (count % 4 == -3) { //Facing left

                //No right hand wall initiates right turn
                if (cellPos != walls.h[cellPos]) {
                    count++;
                    rt(90);

                    //Shutting off right wall and alerting origin of shut-off
                    walls.v[cellPos + yCellPos + 1] = cellPos + yCellPos + 1;
                    fromLeft = true;

                //Right hand wall and no front obstacle initiates forward move
                } else if (cellPos == walls.h[cellPos]
                && cellPos + yCellPos != walls.v[cellPos + yCellPos]) {

                    //Check if wall shut-off originated from down direction
                    //Revert temporary shut-off
                    if (fromDown) {
                        walls.h[cellPos] = null;
                        fromDown = false;
                    }

                    fd(pas);
                    cellPos--;

                //Front obstacle initiates left turn
                } else {
                    count--;
                    lt(90);
                }

            } else {                      //Facing downward

                //No right hand wall initiates right turn
                if (cellPos + yCellPos != walls.v[cellPos + yCellPos]) {
                    count++;
                    rt(90);

                    //Shutting off upper wall and alerting origin of shut-off
                    walls.h[cellPos] = cellPos;
                    fromDown = true;

                //Right hand wall and no front obstacle initiates forward move
                } else if (cellPos + yCellPos == walls.v[cellPos + yCellPos]
                && cellPos + nx != walls.h[cellPos + nx]) {

                    //Check if wall shut-off originated from right direction
                    //Revert temporary shut-off
                    if (fromRight) {
                        walls.v[cellPos + yCellPos] = null;
                        fromRight = false;
                    }

                    fd(pas);
                    cellPos += nx;

                //Front obstacle initiates left turn
                } else {
                    count--;
                    lt(90);
                }

            }

        } while (cellPos < nx * ny); //Up until robot reaches exit
    }
};

/*
* The test procedures below serve for unit based test cases for their
* corresponding function
**/

var testIota = function() {
    assert(iota(4)     == "0,1,2,3");
    assert(iota(0)     == "");
    assert(iota(1)     == "0");
    assert(iota(-1)    == "");
    assert(iota("abc") == "");
};

var testContient = function() {
    assert(contient([2, 1, 8], 5)     == false);
    assert(contient([2, 1 ,8], 2)     == true);
    assert(contient([-2, -1, -8], -5) == false);
    assert(contient([-2, -1, -8], -2) == true);
    assert(contient([], 2)            == false);
    assert(contient(["2"], 2)         == false);
    assert(contient([5], "5")         == false);
};

var testAjouter = function() {
    assert(ajouter([2, 3, 4, 6], 5)  == "2,3,4,6,5");
    assert(ajouter([2, 3, 4, 6], 2)  == "2,3,4,6");
    assert(ajouter([], 1)            == "1");
    assert(ajouter([-1, 2, 3, 5], 1) == "-1,2,3,5,1");
    assert(ajouter([0], 0)           == "0");
};

var testRetirer = function() {
    assert(retirer([2, 3, 4, 6], 5)      == "2,3,4,6");
    assert(retirer([2, 3, 4, 6], 2)      == "3,4,6");
    assert(retirer([0], 0)               == "");
    assert(retirer(["a","b","c","d"], 0) == "a,b,c,d");
    assert(retirer([0, "a", 1], "a")     == "0,1");
};

var testVoisins = function() {
    assert(voisins(7,2,8,4) == "15,31,22");
    assert(voisins(7,1,8,4) == "7,23,14");
    assert(voisins(7,0,8,4) == "15,6");
    assert(voisins(0,0,8,4) == "1,8");
    assert(voisins(3,0,8,4) == "4,11,2");
    assert(voisins(3,3,8,4) == "19,28,26");
    assert(voisins(3,1,8,4) == "3,12,19,10");
    assert(voisins(7,3,8,4) == "23,30");
    assert(voisins(2,3,8,4) == "18,27,25");
    assert(voisins(0,0,1,1) == "");
    assert(voisins(0,1,2,2) == "0,3");
    assert(voisins(1,0,2,2) == "3,0");
    assert(voisins(0,0,1,2) == "1");
    assert(voisins(0,0,2,1) == "1");
};

var testIndexToCoords = function() {
    assert([indexToCoords(0,8).x, indexToCoords(0,8).y]   == "0,0");
    assert([indexToCoords(7,8).x, indexToCoords(7,8).y]   == "7,0");
    assert([indexToCoords(11,4).x, indexToCoords(11,4).y] == "3,2");
    assert([indexToCoords(40,1).x, indexToCoords(40,1).y] == "0,40");
    assert([indexToCoords(27,7).x, indexToCoords(27,7).y] == "6,3");
    assert([indexToCoords(22,8).x, indexToCoords(22,8).y] == "6,2");
};

//Comment the test procedures to disable desired unit tests
// testIota();
// testContient();
// testAjouter();
// testRetirer();
// testVoisins();
// testIndexToCoords();

labySol(10, 9, 20);