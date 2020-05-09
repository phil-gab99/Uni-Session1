/*
*	@Philippe Gabriel
*	@Version 1.4 2020-01-15
*
*	Ce programme calcule un montant mensuel à payer
*	lors de l'obtention d'un prêt hypothécaire en fournissant
*	le montant du prêt, le nombre total de mois nécessaire afin de
*	rembourser le prêt et le taux d'intérêt annuel en pourcentage.
**/

var p = 200000; //Montant du prêt à rembourser en dollars
var n = 360; 	  //Temps alloué en mois
var i = 6.5; 	  //Taux d'intérêt annuel en pourcents

var tauxInteretMois = i/(12*100); 			       	//Taux d'intérêt mensuel
var interetEff = Math.pow(1+tauxInteretMois,n);	//Taux d'intérêt effectif

var m = (p*interetEff*tauxInteretMois)/(interetEff-1);//Montant mensuel à payer

//Imprime le montant calculé
print(m);
