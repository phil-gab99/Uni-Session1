/*
* @Philippe Gabriel
* @Version 1.9.7 2020-04-10
*
* This program aims to produce a string table holding the contents of an
* inputted two-dimensional array with a right item alignment and correct column
* width
**/

/*
* The convertString function converts the entries of a given line array of
* elements into their string equivalent
*
* @param line Line array for which the elements are to be converted
* @return strLine Converted line array with appropriate string entries
**/

var convertString = function(line) {

    var strLine = line.map(
        function(entry) {
            return entry + "";
        }
    );

    return strLine;
};

/*
* The rectMatrix function resizes a two-dimensional array so that each of its
* lines hold an equal amount of elements
*
* @param mat Non-rectangular two-dimensional matrix
* @param dim Integer indicating correct line dimensions
* @return rectMat Rectanguar two-dimensional matrix derived from resizing the
* initial inputted matrix
**/

var rectMatrix = function(mat,dim) {

    var rectMat = mat.map(
        function(line) {
            Array(dim - line.length).fill(0).forEach(
                function(_) {
                    line.push("");
                }
            );
            return line;
        }
    );

    return rectMat;
};

/*
* The getCol function retrieves a given column of a given two-dimensional array
* to then store it in an array for further analysis on each element of the
* column
*
* @param mat Two-dimensional array upon which a column is to be extracted
* @param col Integer indicating which column to extract
* @return column Array holding desired column for analysis
**/

var getCol = function(mat, col) {

    var column = mat.map(
        function(line) {
            return line[col];
        }
    );

    return column;
};

/*
* The repeatString function repeats a given amount of times a given string
* through a series of concatenations
*
* @param str String input to be repeated
* @param times Integer indicating amount of times to repeat
* @return text String resulting from specified amount of concatenations of
* initial string input
**/

var repeatString = function(str, times) {

    var text = "";

    Array(times).fill(0).forEach(
        function(_) {
            text += str;
        }
    );

    return text;
};

/*
* The colRange function determines the largest width of the elements within a
* column for each column of a two-dimensional array to then configure the right
* amount of width units to accomodate for the largest element for each column
*
* @param mat Two-dimensional array for which column widths are to be analyzed
* @param cols Total columns belonging to matrix
* @return width Array holding the row border width sequence adjusted for
* each column of the matrix
**/

var colRange = function(mat, cols) {

    var width = Array(cols).fill(0).map(
        function(_, i) {
            var column = getCol(mat, i); //Current column to analyze
            var repeat = 0;              //Repeating factor determining width

            column.forEach(
                function(entry) {
                    //Largest width entry determines column width
                    if (repeat < entry.length) {
                        repeat = entry.length;
                    }
                }
            );

            //Appropriate column width is indicated by string sequence
            return repeat;
        }
    );
    return width;
};

/*
* The fillTable function is reponsible for constructing a string table from
* given table contents, given table row borders and given table column
* dimensions
*
* @param content Two-dimensional array containing the table contents
* @param rowBorder String with well-sized table border rows
* @param colWidth Array indicating the width of each column in the table
* @return table String holding filled table
**/

var fillTable = function (content, rowBorder, colWidth) {

    var table = "";

    content.forEach(
        function(line) {
            table += rowBorder + "\n";
            colWidth.forEach(
                function(col, i) {
                    //The proper column width is applied for each table cell
                    table += "|" + repeatString(" ", col - line[i].length)
                    + line[i];
                }
            );
            table += "|\n";
        }
    );

    table += rowBorder; //Last border row to close off table from bottom
    return table;
};

/*
* The grilleMat function generates a table from a given two-dimensional array
* with the proper column widths associated with each elements within a column
* while also treating cases of missing input and non-square matrices
*
* @param mat Two-dimensional array from which a table is produced
* @return table String holding the output table from the information provided
* from the two-dimensional array
**/

var grilleMat = function(mat) {

    //Each line entry is converted to its corresponding string sequence
    var textData = mat.map(convertString);
    var max      = 1; //Total columns within table

    var colWidth  = [];
    var rowBorder = "";

    var table = "";

    //Assuming that inputted matrix lines may hold a varying amount of elements
    textData.forEach(
        function(line) {
            //Line with most elements determines total columns of table
            if (max < line.length) {
                max = line.length;
            }
        }
    );

    //Array lines are resized to a proper rectangular matrix
    textData = rectMatrix(textData,max);

    //Column width measurements with appropriate widths for each column
    colWidth = colRange(textData, max);

    //Each column width applied to table row borders
    rowBorder = "+" + colWidth.map(
        function(width) {
            return repeatString("-", width);
        }
    ).join("+") + "+";

    table = fillTable(textData, rowBorder, colWidth);

    return table;
};

/*
* The testGrilleMat procedure serves for unit-based tests for all the functions
* of the program
**/

var testGrilleMat = function() {

    var assert = require("assert");

    assert(getCol([[1,2,3],[4,5,6],[7,8,9]], 0)                   == "1,4,7");
    assert(getCol([["a","b","c"],["d","e","f"],["g","h","i"]], 2) == "c,f,i");
    assert(getCol([[1,"a","2"],["b","3",4],["5",6,"c"]], 1)       == "a,3,6");
    assert(getCol([[1,2],["a",""],[3,"b"]], 1)                    == "2,,b");
    assert(getCol([[""],[""],[""]], 0)                            == ",,");
    assert(getCol([[],[],[]], 0)                                  == ",,");

    assert(repeatString("a",0)  == "");
    assert(repeatString("a",2)  == "aa");
    assert(repeatString("a",10) == "aaaaaaaaaa");
    assert(repeatString("",0)   == "");
    assert(repeatString("",10)  == "");

    assert(
        colRange([["1","2"],["3","4"],["5","6"]],2)             == "1,1"
    );
    assert(
        colRange([["1","2","3"],["4","5","6"],["7","8","9"]],3) == "1,1,1"
    );
    assert(
        colRange([["hello world!", "71"],["21", "test"]],2)     == "12,4"
    );
    assert(
        colRange([["test", "71"],["21210", "a"]],2)             == "5,2"
    );
    assert(
        colRange([["",""],["","42"],["","0"]],2)                == "0,2"
    );
    assert(
        colRange([["",""]],2)                                   == "0,0"
    );
    assert(
        colRange([["","","","test"],["test","","",""]],4)       == "4,0,0,4"
    );
    assert(
        colRange([[""],[""]],1)                                 == "0"
    );

    assert(
        fillTable([["oranges", "5"],["kiwis","1000"]], "+-------+----+",[7,4])
        == "+-------+----+\n"
        + "|oranges|   5|\n"
        + "+-------+----+\n"
        + "|  kiwis|1000|\n"
        + "+-------+----+"
    );
    assert(
        fillTable([[""," "],["2",""]], "+-+-+", [1,1])
        == "+-+-+\n"
        + "| | |\n"
        + "+-+-+\n"
        + "|2| |\n"
        + "+-+-+"
    );
    assert(
        fillTable([["",""],["2",""]], "+-++", [1,0])
        == "+-++\n"
        + "| ||\n"
        + "+-++\n"
        + "|2||\n"
        + "+-++"
    );
    assert(
        fillTable([[""]],"++",[0])
        == "++\n"
        + "||\n"
        + "++"
    );
    assert(
        fillTable(
            [
                ["prénom", "nom", "chèque"],
                ["Jean", "Dubuc", "1750"],
                ["Anne", "Gadbois", "0"],
                ["Julie", "Tremblay", "2400"],
                ["Paul", "Tremblay", "0"],
                ["Marie", "Valois", "1200"]
            ], "+------+--------+------+",[6,8,6]
        )
        == "+------+--------+------+\n"
        + "|prénom|     nom|chèque|\n"
        + "+------+--------+------+\n"
        + "|  Jean|   Dubuc|  1750|\n"
        + "+------+--------+------+\n"
        + "|  Anne| Gadbois|     0|\n"
        + "+------+--------+------+\n"
        + "| Julie|Tremblay|  2400|\n"
        + "+------+--------+------+\n"
        + "|  Paul|Tremblay|     0|\n"
        + "+------+--------+------+\n"
        + "| Marie|  Valois|  1200|\n"
        + "+------+--------+------+"
    );

    assert(
        grilleMat([["oranges", 5],["kiwis",1000]])
        == "+-------+----+\n"
        + "|oranges|   5|\n"
        + "+-------+----+\n"
        + "|  kiwis|1000|\n"
        + "+-------+----+"
    );
    assert(
        grilleMat([[""," "],[2,""]])
        == "+-+-+\n"
        + "| | |\n"
        + "+-+-+\n"
        + "|2| |\n"
        + "+-+-+"
    );
    assert(
        grilleMat([["",""],[2,""]])
        == "+-++\n"
        + "| ||\n"
        + "+-++\n"
        + "|2||\n"
        + "+-++"
    );
    assert(
        grilleMat([[""," "],[2]])
        == "+-+-+\n"
        + "| | |\n"
        + "+-+-+\n"
        + "|2| |\n"
        + "+-+-+"
    );
    assert(
        grilleMat([["",""],[2]])
        == "+-++\n"
        + "| ||\n"
        + "+-++\n"
        + "|2||\n"
        + "+-++"
    );
    assert(
        grilleMat([[""]])
        == "++\n"
        + "||\n"
        + "++"
    );
    assert(
        grilleMat([[]])
        == "++\n"
        + "||\n"
        + "++"
    );
    assert(
        grilleMat(
            [
                ["prénom", "nom", "chèque"],
                ["Jean", "Dubuc", 1750],
                ["Anne", "Gadbois", 0],
                ["Julie", "Tremblay", 2400],
                ["Paul", "Tremblay", 0],
                ["Marie", "Valois", 1200]
            ]
        )
        == "+------+--------+------+\n"
        + "|prénom|     nom|chèque|\n"
        + "+------+--------+------+\n"
        + "|  Jean|   Dubuc|  1750|\n"
        + "+------+--------+------+\n"
        + "|  Anne| Gadbois|     0|\n"
        + "+------+--------+------+\n"
        + "| Julie|Tremblay|  2400|\n"
        + "+------+--------+------+\n"
        + "|  Paul|Tremblay|     0|\n"
        + "+------+--------+------+\n"
        + "| Marie|  Valois|  1200|\n"
        + "+------+--------+------+"
    );
    assert(
        grilleMat(
            [[0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,2,3,4,5,6,7,8,9,10,11],
            [0,2,4,6,8,10,12,14,16,18,20,22],
            [0,3,6,9,12,15,18,21,24,27,30,33],
            [0,4,8,12,16,20,24,28,32,36,40,44],
            [0,5,10,15,20,25,30,35,40,45,50,55],
            [0,6,12,18,24,30,36,42,48,54,60,66],
            [0,7,14,21,28,35,42,49,56,63,70,77],
            [0,8,16,24,32,40,48,56,64,72,80,88],
            [0,9,18,27,36,45,54,63,72,81,90,99],
            [0,10,20,30,40,50,60,70,80,90,100,110],
            [0,11,22,33,44,55,66,77,88,99,110,121]]
        )
        == "+-+--+--+--+--+--+--+--+--+--+---+---+\n"
        + "|0| 0| 0| 0| 0| 0| 0| 0| 0| 0|  0|  0|\n"
        + "+-+--+--+--+--+--+--+--+--+--+---+---+\n"
        + "|0| 1| 2| 3| 4| 5| 6| 7| 8| 9| 10| 11|\n"
        + "+-+--+--+--+--+--+--+--+--+--+---+---+\n"
        + "|0| 2| 4| 6| 8|10|12|14|16|18| 20| 22|\n"
        + "+-+--+--+--+--+--+--+--+--+--+---+---+\n"
        + "|0| 3| 6| 9|12|15|18|21|24|27| 30| 33|\n"
        + "+-+--+--+--+--+--+--+--+--+--+---+---+\n"
        + "|0| 4| 8|12|16|20|24|28|32|36| 40| 44|\n"
        + "+-+--+--+--+--+--+--+--+--+--+---+---+\n"
        + "|0| 5|10|15|20|25|30|35|40|45| 50| 55|\n"
        + "+-+--+--+--+--+--+--+--+--+--+---+---+\n"
        + "|0| 6|12|18|24|30|36|42|48|54| 60| 66|\n"
        + "+-+--+--+--+--+--+--+--+--+--+---+---+\n"
        + "|0| 7|14|21|28|35|42|49|56|63| 70| 77|\n"
        + "+-+--+--+--+--+--+--+--+--+--+---+---+\n"
        + "|0| 8|16|24|32|40|48|56|64|72| 80| 88|\n"
        + "+-+--+--+--+--+--+--+--+--+--+---+---+\n"
        + "|0| 9|18|27|36|45|54|63|72|81| 90| 99|\n"
        + "+-+--+--+--+--+--+--+--+--+--+---+---+\n"
        + "|0|10|20|30|40|50|60|70|80|90|100|110|\n"
        + "+-+--+--+--+--+--+--+--+--+--+---+---+\n"
        + "|0|11|22|33|44|55|66|77|88|99|110|121|\n"
        + "+-+--+--+--+--+--+--+--+--+--+---+---+"
    );
    assert(
        grilleMat(
            [[0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,2,3,4,5,6,7,8,9,10,11],
            [0,2,4,6,8,10,12,14,16],
            [],
            [0,4,8,12,16,20,24,28,32,36,40,44],
            [0,5,10,15,20,25,30,35,40],
            [0,6,12,18,24,30,36,42],
            [0,7,14,21,28,35,42,49,56,63,70,77],
            [0,8,16,24,32,40,48,56],
            [0,9,18,27,36,45,54,63,72,81,90,99],
            [10,20,30,40,50,60,70,80],
            [0,11,22,33,44,55,66,77,88,99,110]]
        )
        == "+--+--+--+--+--+--+--+--+--+--+---+--+\n"
        + "| 0| 0| 0| 0| 0| 0| 0| 0| 0| 0|  0| 0|\n"
        + "+--+--+--+--+--+--+--+--+--+--+---+--+\n"
        + "| 0| 1| 2| 3| 4| 5| 6| 7| 8| 9| 10|11|\n"
        + "+--+--+--+--+--+--+--+--+--+--+---+--+\n"
        + "| 0| 2| 4| 6| 8|10|12|14|16|  |   |  |\n"
        + "+--+--+--+--+--+--+--+--+--+--+---+--+\n"
        + "|  |  |  |  |  |  |  |  |  |  |   |  |\n"
        + "+--+--+--+--+--+--+--+--+--+--+---+--+\n"
        + "| 0| 4| 8|12|16|20|24|28|32|36| 40|44|\n"
        + "+--+--+--+--+--+--+--+--+--+--+---+--+\n"
        + "| 0| 5|10|15|20|25|30|35|40|  |   |  |\n"
        + "+--+--+--+--+--+--+--+--+--+--+---+--+\n"
        + "| 0| 6|12|18|24|30|36|42|  |  |   |  |\n"
        + "+--+--+--+--+--+--+--+--+--+--+---+--+\n"
        + "| 0| 7|14|21|28|35|42|49|56|63| 70|77|\n"
        + "+--+--+--+--+--+--+--+--+--+--+---+--+\n"
        + "| 0| 8|16|24|32|40|48|56|  |  |   |  |\n"
        + "+--+--+--+--+--+--+--+--+--+--+---+--+\n"
        + "| 0| 9|18|27|36|45|54|63|72|81| 90|99|\n"
        + "+--+--+--+--+--+--+--+--+--+--+---+--+\n"
        + "|10|20|30|40|50|60|70|80|  |  |   |  |\n"
        + "+--+--+--+--+--+--+--+--+--+--+---+--+\n"
        + "| 0|11|22|33|44|55|66|77|88|99|110|  |\n"
        + "+--+--+--+--+--+--+--+--+--+--+---+--+"
    );
};

testGrilleMat(); //Comment this line to disable unit tests