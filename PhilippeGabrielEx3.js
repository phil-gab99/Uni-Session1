/*
* @Philippe Gabriel
* @Version 1.3 2020-01-27
*
* Ce programme étudie la vitesse de convergence de deux termes de départs vers
* le nombre d'Or par une méthode de divisions de termes successifs d'une
* séquence obtenue à partir des deux premiers termes.
**/

var nombreOr = (1 + Math.sqrt(5)) / 2; //Le nombre d'or

var terme1 = 10;              //Le premier terme de départ
var terme2 = 16;              //Le deuxième terme de départ
var termeTemp = 0;            //Valeur temporaire servant d'intermédiaire

if (terme2 < terme1) {        //Échange de valeurs pour optimiser la vitesse
  termeTemp = terme1;
  terme1 = terme2;
  terme2 = termeTemp;
}

var approx = terme2 / terme1; //Approximation du nombre d'or

print("terme #1 = " + terme1);
print("terme #2 = " + terme2);

var i = 2;    //L'index de la suite qui débute à partir du second terme
var max = 50; //Valeur maximale de l'index signalant l'arrêt du programme

while (approx != nombreOr && i != max) {

  termeTemp = terme2;       //Valeur du terme stocké temporairement
  terme2 += terme1;         //Terme consistant en la somme des deux précédents
  terme1 = termeTemp;       //Terme consistant à celui qui précède la somme

  i++;

  approx = terme2 / terme1; //Approxmation ré-évaluée

  if (i % 10 == 0) { //Affichage du résultat de la division à chaque 10 termes
    print("terme #" + i + " / terme #" + (i-1) + " = " + approx);
  }
}

if (i != max) {
  //Affichage des résultats démontrant la vitesse de convergence
  if (i % 10 != 0) { //Afin de ne pas réafficher la dernière opération
    print("terme #" + i + " / terme #" + (i-1) + " = " + approx);
  }
  print("nombre d'or obtenu au terme #" + i);
  print("terme #" + (i-1) + " = " + terme1);
  print("terme #" + i + " = " + terme2);
}
