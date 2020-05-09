#! /bin/bash

####
# @Philippe Gabriel
# @Version 1.3.2 2020-04-30
# Final_Gabriel_Q3.sh bash script
#
# Ce programme calcule la racine carré d'un nombre réel positif en utilisant
# la stratégie de Héron
####


if [ `echo "$1 <= 0" | bc` -eq 1 ] || [ `echo "$2 <= 0" | bc` -eq 1 ]; then
    echo "Veuillez entrez des paramètres positifs"
else

    x=$1
    eps=$2

    ri=`echo $x*0.5 | bc` #Première approximation r0

    rsqr=`echo $ri*$ri | bc`

    #On détermine la valeur absolue du critère de Héron
    if [ `echo "$rsqr-$x < 0" | bc` -eq 1 ]; then
        crit=`echo $x-$rsqr | bc`
    else
        crit=`echo $rsqr-$x | bc`
    fi

    #Tout et aussi longtemps que le critère est respecté, on réajuste la racine
    while [ `echo "$crit > $eps" | bc` -eq 1 ]; do

        #Calcul de rn par rapport à rn-1
        ri=`echo $x/$ri + $ri | bc -l`
        ri=`echo $ri*0.5 | bc`

        rsqr=`echo $ri*$ri | bc`

        #On détermine la valeur absolue du critère de Héron
        if [ `echo "$rsqr-$x < 0" | bc` -eq 1 ]; then
            crit=`echo $x-$rsqr | bc`
        else
            crit=`echo $rsqr-$x | bc`
        fi
    done

    echo $ri #Racine carré de x
fi
