/*
* @Philippe Gabriel
* @Version 1.3 2020-02-10
*
* This program converts a given integer within the range of 1 to 3999 into its
* corresponding Roman numeral equivalent
**/

var romanNumber; //String that will hold the Roman equivalent

/*
* The repeter function outputs a certain amount of a specified Roman numerals
* with respect to the parameters passed to it
*
* @param n Integer indicating the amount of times the Roman numeral is repeated
* @param t String holding the Roman numeral that is to be repeated
* @return digit String composed of the string repetition of a Roman numeral
**/

var repeter = function(n, t) {

  var digit = "";

  for (var i = 1; i <= n; i++) {
    digit += t; //Concatenation of Roman numerals
  }

  return digit;
};

/*
* The chiffre function encodes in Roman numerals a single digit of the inputted
* decimal number
*
* @param decimal Integer for which the most significant digit is to be
* converted in Roman numeral
* @param digitPos Integer indicating the digit position of the decimal number
* to be converted
* @param rom1 String for the first Roman numeral to consider for conversion
* @param rom2 String for the second Roman numeral to consider for conversion
* @param rom3 String for the third Roman numeral to consider for conversion
* @return digitRoman String containing the Roman numeral sequence of the digit
* of interest
**/

var chiffre = function(decimal, digitPos, rom1, rom2, rom3) {

  var digitValue = Math.floor(decimal/digitPos); //Value of digit of interest
  var digitRoman = "";

  //Concatenation of Roman numerals through specific steps with respect to the
  //digit value
  if (digitValue == 9) {
    digitRoman += repeter(1, rom1);
    digitRoman += repeter(1, rom3);
  } else if (digitValue >= 5) {
    digitRoman += repeter(1, rom2);
    digitRoman += repeter(digitValue-5, rom1);
  } else if (digitValue == 4) {
    digitRoman += repeter(1, rom1);
    digitRoman += repeter(1, rom2);
  } else {
    digitRoman += repeter(digitValue, rom1);
  }

  return digitRoman;
};

/*
* The romain function converts a given integer into its Roman equivalent
*
* @param number The decimal number inputted which needs conversion
* @return romanNumber The Roman numeral equivalent of the inputted number
* defined as a global variable
**/

var romain = function(number) {

  if (number < 1 || number > 3999) {
    return "Nombre non permis!";
  } else {

    var hundreds = number % 1000; //Hundreds portion of the main number
    var tens = number % 100;      //Tens portion of the main number
    var ones = number % 10;       //Ones portion of the main number

    romanNumber = ""; //Reinitialize the string for a new number to convert

    if (number >= 1000) {
      romanNumber += chiffre(number, 1000, "M");
    }

    if (hundreds >= 100) {
      romanNumber += chiffre(hundreds, 100, "C", "D", "M");
    }

    if (tens >= 10) {
      romanNumber += chiffre(tens, 10, "X", "L", "C");
    }

    if (ones >= 1){
      romanNumber += chiffre(ones, 1, "I", "V", "X");
    }
  }
  return romanNumber;
};

/*
* The testRomain function serves for unary based test cases for all the
* other functions
**/

var testRomain = function() {
  assert(repeter(3, "C")                  == "CCC");
  assert(chiffre(1024, 1000, "M")         == "M");
  assert(chiffre(763, 100, "C", "D", "M") == "DCC");
  assert(chiffre(39, 10, "X", "L", "C")   == "XXX");
  assert(chiffre(1, 1, "I", "V", "X")     == "I");
  assert(romain(1)                        == "I");
  assert(romain(3999)                     == "MMMCMXCIX");
  assert(romain(888)                      == "DCCCLXXXVIII");
  assert(romain(3333)                     == "MMMCCCXXXIII");
  assert(romain(2001)                     == "MMI");
  assert(romain(439)                      == "CDXXXIX");
  assert(romain(2948)                     == "MMCMXLVIII");
  assert(romain(4000)                     == "Nombre non permis!");
};

testRomain(); //Comment this line to disable unary tests