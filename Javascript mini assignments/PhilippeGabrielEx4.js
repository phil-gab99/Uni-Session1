/*
*	@Philippe Gabriel
*	@Version 1.1 2020-02-03
*
* This program displays a board with dimensions specified for the height and
* width of the tiles as well as the board dimnensions.
**/

var dim = 8;         //Board dimensions
var tileWidth = 6;   //Width of an individual tile
var tileHeight = 3;  //Height of an individual tile
var tileWhite = " "; //String character for a white tile
var tileBlack = "#"; //String character for a black tile

var boardWidth = tileWidth * dim;   //The board width in character length
var boardHeight = tileHeight * dim; //The board height in character length
var board = "";                     //String that will hold the board
var white = true;                   //Determines a tile character to increment

for (var i = 1; i <= boardHeight; i++) {

  for (var j = 1; j <= boardWidth; j++) {

    board += white ? tileWhite : tileBlack; //An appropriate character is added

    if (j % tileWidth == 0) {
      white = !white; //Alternates tile characters according to tile width
    }
  }

  board += "\n";      //Carriage return to begin filling the next line

  if (i % tileHeight == 0) {
    white = !white;   //Alternates tile characters according to tile height
  }
}

print(board);