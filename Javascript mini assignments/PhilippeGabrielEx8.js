/*
* @Philippe Gabriel
* @Version 1.4.12 2020-03-30
*
* This program calculates the paycheck of each individual employee at some
* corporation and outputs the company's payroll by pairing each employee with
* their earned pay in a text file format
**/

var fs = require("fs");

var readFile = function (path) {
    return fs.readFileSync(path).toString();
};

var writeFile = function (path, texte) {
    fs.writeFileSync(path, texte);
};

/*
* The decouperEnLignes function separates a given string block into distinct
* lines by storing each line at a separate array index
*
* @param contenu String to be converted
* @return lignes Array holding each line of string block at separate index
**/

var decouperEnLignes = function (contenu) {

    var lignes = contenu.split("\r\n"); //Accomodate for Windows OS convention

    //In case of no modification, accomodate for Mac OS convention
    if (lignes.length == 1) {
        lignes = contenu.split("\r");

        //In case of no modification, accomodate for UNIX OS convention
        if (lignes.length == 1) {
            lignes = contenu.split("\n");
        }
    }

    //Avoid case of last empty line in a file
    if (lignes[lignes.length - 1] == "") {
        lignes.pop();
    }

    return lignes;
};

/*
* The lireCSV function converts the contents of a csv file into that of a two-
* dimensional array by allocating each index of the parent array to an array
* for each distinct line within the file which in turn allocates each index to
* each comma-separated element within the line
*
* @param path String indicating csv file path in which contents will be
* converted
* @return resultat 2D-Array holding the contents of the csv file
**/

var lireCSV = function(path) {

    //Array of each line of content stored at different indexes
    var lignes = decouperEnLignes(readFile(path));
    var resultat = [];

    //Each line occupies a distinct index of the parent array
    //Each comma-separated element occupies a distinct index of its line array
    for (var i = 0; i < lignes.length; i++) {
        resultat.push(lignes[i].split(","));
    }

    return resultat;
};

/*
* The record function converts a two-dimensional array holding the contents of
* a csv file into a record array where each index holds the employee's full
* name as well as their associated information of interest
*
* @param mat 2D-array to be converted holding content of csv file
* @return recEmp Record array with arranged information of interest
**/

var record = function(mat) {
    var recEmp = mat.map(
        function(line) {
            //Each employee's information occupies a property within an object
            return {
                name:   line[0],
                amount: line[1]
            };
        }
    );
    return recEmp;
};

/*
* The empData function calculates the paycheck from the given information on
* each employee's salary and work hours in the previous pay period and readies
* the corporation's payroll information to be transcribed onto a text file
*
* @param salary Record array holding salary details for each employee
* @param hours Record array holding work hours details for each employee
* @return payroll String holding the contents describing the paycheck details
* for each employee which are to be transcribed onto a text file
**/

var empData = function(salary, hours) {

    var payroll = "";

    //Array of employee names which have work hours
    var hourNames = hours.map(
        function(line) {
            return line.name;
        }
    );
    var currEmp; //Index of current employee who has work hours

    for (var i = 0; i < salary.length; i++) {
        currEmp = hourNames.indexOf(salary[i].name);
        if (currEmp != -1) { //When an employee has work hours recorded
            payroll += salary[i].name + ": payer "
            + salary[i].amount * hours[currEmp].amount + "$"
            + (i != salary.length - 1 ? "\n" : "");
        } else {             //When an employee has no work hours recorded
            payroll += salary[i].name + ": payer 0$"
            + (i != salary.length - 1 ? "\n" : "");
        }
    }
    return payroll;
};

/*
* The cheques procedure retrieves the paycheck for each employee of some
* corporation from two given csv files containing each employee's salary and
* work hours throughout the previous pay period to then output the payroll onto
* a report text file
*
* @param salaryPath String indicating file path of the salary csv file
* @param hoursPath String indicating file path of the hours csv file
* @param reportPath String indicating file path of the report text file onto
* which the company's payroll is to be written
**/

var cheques = function(salaryPath, hoursPath, reportPath) {

    //Record arrays holding salary and work hours details for each employee
    var salary = record(lireCSV(salaryPath));
    var hours  = record(lireCSV(hoursPath));

    var contents = empData(salary, hours); //Payroll information

    writeFile(reportPath, contents); //Contents are written onto a text file
};

/*
* The testCheques procedure serves for unit based tests for some of the key
* functions of the program
**/

var testCheques = function() {

    var assert = require("assert");

    assert(decouperEnLignes("HelloWorld")         == "HelloWorld");
    assert(decouperEnLignes("HelloWorld\n")       == "HelloWorld");
    assert(decouperEnLignes("HelloWorld\r")       == "HelloWorld");
    assert(decouperEnLignes("HelloWorld\r\n")     == "HelloWorld");
    assert(decouperEnLignes("Hello\nWorld")       == "Hello,World");
    assert(decouperEnLignes("Hello\rWorld")       == "Hello,World");
    assert(decouperEnLignes("Hello\r\nWorld")     == "Hello,World");
    assert(decouperEnLignes("Hello\nWorld\n")     == "Hello,World");
    assert(decouperEnLignes("Hello\rWorld\r")     == "Hello,World");
    assert(decouperEnLignes("Hello\r\nWorld\r\n") == "Hello,World");
    assert(decouperEnLignes("\n")                 == "");
    assert(decouperEnLignes("\r")                 == "");
    assert(decouperEnLignes("\r\n")               == "");
    assert(decouperEnLignes("")                   == "");

    assert( //Two equivalent ordered inputs
        empData(
            [
                {name: "Jean Dubuc",     amount: "25"},
                {name: "Anne Gadbois",   amount: "20"},
                {name: "Julie Tremblay", amount: "40"},
                {name: "Paul Tremblay",  amount: "20"},
                {name: "Marie Valois",   amount: "15"}
            ],
            [
                {name: "Jean Dubuc",     amount: "70"},
                {name: "Anne Gadbois",   amount: "65"},
                {name: "Julie Tremblay", amount: "60"},
                {name: "Paul Tremblay",  amount: "50"},
                {name: "Marie Valois",   amount: "80"}
            ]
        )
        ==
        "Jean Dubuc: payer 1750$\n"
        + "Anne Gadbois: payer 1300$\n"
        + "Julie Tremblay: payer 2400$\n"
        + "Paul Tremblay: payer 1000$\n"
        + "Marie Valois: payer 1200$"
    );

    assert( //Two equivalent unordered inputs
        empData(
            [
                {name: "Marie Valois",   amount: "15"},
                {name: "Jean Dubuc",     amount: "25"},
                {name: "Paul Tremblay",  amount: "20"},
                {name: "Julie Tremblay", amount: "40"},
                {name: "Anne Gadbois",   amount: "20"}
            ],
            [
                {name: "Paul Tremblay",  amount: "50"},
                {name: "Marie Valois",   amount: "80"},
                {name: "Julie Tremblay", amount: "60"},
                {name: "Anne Gadbois",   amount: "65"},
                {name: "Jean Dubuc",     amount: "70"}
            ]
        )
        ==
        "Marie Valois: payer 1200$\n"
        + "Jean Dubuc: payer 1750$\n"
        + "Paul Tremblay: payer 1000$\n"
        + "Julie Tremblay: payer 2400$\n"
        + "Anne Gadbois: payer 1300$"
    );

    assert( //Two unequivalent ordered inputs
        empData(
            [
                {name: "Jean Dubuc",     amount: "25"},
                {name: "Anne Gadbois",   amount: "20"},
                {name: "Julie Tremblay", amount: "40"},
                {name: "Paul Tremblay",  amount: "20"},
                {name: "Marie Valois",   amount: "15"}
            ],
            [
                {name: "Jean Dubuc",     amount: "70"},
                {name: "Julie Tremblay", amount: "60"},
                {name: "Marie Valois",   amount: "80"}
            ]
        )
        ==
        "Jean Dubuc: payer 1750$\n"
        + "Anne Gadbois: payer 0$\n"
        + "Julie Tremblay: payer 2400$\n"
        + "Paul Tremblay: payer 0$\n"
        + "Marie Valois: payer 1200$"
    );

    assert( //Two unequivalent unordered inputs
        empData(
            [
                {name: "Anne Gadbois",   amount: "20"},
                {name: "Marie Valois",   amount: "15"},
                {name: "Paul Tremblay",  amount: "20"},
                {name: "Julie Tremblay", amount: "40"},
                {name: "Jean Dubuc",     amount: "25"}
            ],
            [
                {name: "Marie Valois",   amount: "80"},
                {name: "Jean Dubuc",     amount: "70"},
                {name: "Julie Tremblay", amount: "60"}
            ]
        )
        ==
        "Anne Gadbois: payer 0$\n"
        + "Marie Valois: payer 1200$\n"
        + "Paul Tremblay: payer 0$\n"
        + "Julie Tremblay: payer 2400$\n"
        + "Jean Dubuc: payer 1750$"
    );

    assert( //An ordered input with second empty input
        empData(
            [
                {name: "Jean Dubuc",     amount: "25"},
                {name: "Anne Gadbois",   amount: "20"},
                {name: "Julie Tremblay", amount: "40"},
                {name: "Paul Tremblay",  amount: "20"},
                {name: "Marie Valois",   amount: "15"}
            ], []
        )
        ==
        "Jean Dubuc: payer 0$\n"
        + "Anne Gadbois: payer 0$\n"
        + "Julie Tremblay: payer 0$\n"
        + "Paul Tremblay: payer 0$\n"
        + "Marie Valois: payer 0$"
    );

    assert( //A differently ordered input with second empty input
        empData(
            [
                {name: "Anne Gadbois",   amount: "20"},
                {name: "Marie Valois",   amount: "15"},
                {name: "Paul Tremblay",  amount: "20"},
                {name: "Julie Tremblay", amount: "40"},
                {name: "Jean Dubuc",     amount: "25"}
            ], []
        )
        ==
        "Anne Gadbois: payer 0$\n"
        + "Marie Valois: payer 0$\n"
        + "Paul Tremblay: payer 0$\n"
        + "Julie Tremblay: payer 0$\n"
        + "Jean Dubuc: payer 0$"
    );

    assert(empData([], []) == ""); //Two empty inputs
};

// testCheques(); //Comment this line to disable unit tests
cheques("salaires.csv","heures.csv","rapport.txt");