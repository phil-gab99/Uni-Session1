/*
* @Philippe Gabriel
* @Version 1.0.6 2020-04-20
*
* This program aims to identify whether a given positive integers holds in its
* binary encoding an even or odd amount of set bits
**/

/*
* The parite function determines whether a given positive integer has an even
* number of set bits in its binary encoding
*
* @param n Positive integer in decimal encoding
* @return evenSetBits Boolean indicating whether the inputted integer has an
* even number of set bits or not - In case of invalid input, returns false
**/

var parite = function(n) {

    var evenSetBits = false;

    //Avoiding negative and floating numbers input
    if (n < 0 || n != n >> 0) return evenSetBits;

    if (n == 0) { //Base case with even set bits

        return true;
    } else {

        var setLastBit = (n & 1); //Identifying least significant bit

        var nextLastBit = parite(n >> 1); //Next bit is analyzed

        //Result converted to boolean counterpart through double negation
        evenSetBits = !!((setLastBit + nextLastBit) % 2);

        return evenSetBits;
    }
};

/*
* The testParite procedure serves for unit-based tests for the parite function
**/

var testParite = function() {

    var assert = require('assert');

    assert(parite(0)    == true);
    assert(parite(1)    == false);
    assert(parite(2)    == false);
    assert(parite(3)    == true);
    assert(parite(4)    == false);
    assert(parite(5)    == true);
    assert(parite(6)    == true);
    assert(parite(7)    == false);
    assert(parite(8)    == false);
    assert(parite(10)   == true);
    assert(parite(14)   == false);
    assert(parite(15)   == true);
    assert(parite(26)   == false);
    assert(parite(-1)   == false);
    assert(parite(1.5)  == false);
    assert(parite(-1.5) == false);
};

testParite(); //Comment this line to disable unit tests