#! /bin/bash

####
# @Étienne Ameye
# @Philippe Gabriel
# @Version 1.1.8 2020-04-29
# ./fib.sh bash script
#
# Ce programme vise à calculer itérativement le terme dans la suite de
# Fibonacci à la position spécifiée par l'usager passée en argument
####

n=$1 #Paramètre entré par l'usager

#Conditions intiiales de la suite Fibonacci
Fi_2=1 #Terme i-2
Fi_1=1 #Terme i-1

if [ $# -ne 1 ]; then               #Restriction sur nombre d'arguments
    echo "Veuillez spécifier un paramètre uniquement"
elif [ $n -lt 0 ]; then             #Valeur négative entrée
    echo "Veuillez entrer un paramètre valide"
elif [ $n -eq 0 -o $n -eq 1 ]; then #Conditions de base de la suite
    echo "F($n) = 1"
else

    i=2 #Index indiquant l'état du calcul

    while [ $i -le $n ]; do

        let Fi=$Fi_1+$Fi_2 #Le ième terme est calculé

        #Les termes précédents sont mis-à-jour pour la prochaine itération
        Fi_2=$Fi_1
        Fi_1=$Fi

        let i++
    done

    echo "F($n) = $Fi"
fi