/*
* @Philippe Gabriel
* @Version 1.2.7 2020-03-30
*
* This program outputs an inputted string into its correspondant input with the
* exception that every word begins with its uppercase letter counterpart
* following the definition that a word is defined to be a sequence of letters
* from a to z and from A to Z
**/

/*
* The capitaliser function outputs a given string with every word beginning
* with its uppercase letter counterpart
*
* @param texte Input string to be converted
* @return result Output string with uppercased letters at the start of each
* word
**/

var capitaliser = function (texte) {

    var result = "";

    if (texte.length != 0) {

        var char;    //Unicode of character to analyze within string
        var preChar; //Unicode of character preceding the one to analyze

        for (var i = 0; i < texte.length; i++) {

            char = texte.charCodeAt(i);
            preChar = texte.charCodeAt(i - 1);

            if (
                (char <= 122 && char >= 97) //Working on lowercase letters
                && (
                    (
                        //Ensure that character is the first one of the word
                        (preChar > 122 || preChar < 97)
                        && (preChar > 90 || preChar < 65)
                    )
                    //Special case for first character of first word
                    || (preChar != preChar)
                )
            ) {
                result += String.fromCharCode(char - 32);
            } else {
                result += texte[i];
            }
        }
    }
    return result;
};

/*
* The testCapitaliser procedure serves for unit-based tests for its
* corresponding function name
**/

var testCapitaliser = function () {
    assert(capitaliser("hello world!")          == "Hello World!");
    assert(capitaliser("j'aime montreal")       == "J'Aime Montreal");
    assert(capitaliser("")                      == "");
    assert(capitaliser(" aAa BBb cCC ddd eeE")  == " AAa BBb CCC Ddd EeE");
    assert(capitaliser("      ")                == "      ");
    assert(capitaliser("   a   B   cCd d")      == "   A   B   CCd D");
    assert(capitaliser("!!!A@%^bcsd*34ty~h")    == "!!!A@%^Bcsd*34Ty~H");
    assert(capitaliser("Allo")                  == "Allo");
    assert(capitaliser("~!@#$%^&*()_+-=<>?:|")  == "~!@#$%^&*()_+-=<>?:|");
    assert(capitaliser("a")                     == "A");
    assert(capitaliser("#")                     == "#");
};

testCapitaliser(); //Comment to disable unit tests