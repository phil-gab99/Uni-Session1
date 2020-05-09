#! /bin/bash

####
# @Étienne Ameye
# @Philippe Gabriel
# @Version 1.9.6 2020-04-29
# ./moy.sh bash script
#
# Ce programme vise à calculer la note finale de divers étudiants à travers les
# les informations fournies dans un fichier csv contenant leurs notes aux
# différents tests de leur parcours et la pondérations associée à chaque test
# pour en produire un fichier csv contenant leur entrée de la note finale
####

if [ $# -ne 1 ]; then #Restriction sur nombre d'arguments
    echo "Veuillez spécifier un paramètre uniquement"
elif [ "${1: -4}" != ".csv" -o ! -f $1 ]; then #Fichier non-csv ou n'existe pas
    echo "Veuillez spécifier un fichier csv valable"
else

    let n=`grep -c '.' $1`-1 #Nombre d'étudiants à considérer

    #Tableau contenant la note cumulative de chaque étudiant
    for (( i=0; i < n; i++ )); do
        student[$i]=0
    done

    content=`sed '1q;d' $1` #Contenu du fichier final

    #Le nombre de différents champs sont comptés
    fields=`echo "$content" | awk -F "," '{print NF}'`

    content+=$',Total\n' #Le champ de la note totale est concaténé

    #Itération sur chaque champ contenant une note
    for (( i = 3; i <= fields; i++ )); do

        #Le test ainsi que les notes associées sont extraits
        test=`cut -d ',' -f$i $1`

        #La pondération est ajustée selon le test à évalué
        pond=`echo $test | cut -d '(' -f2 | cut -d ')' -f1`
        pond=`echo $pond/100 | bc -l`

        #La note de chaque étudiant est cumulée
        for (( j=0; j < n; j++ )); do

            let noteNum=$j+2

            note=`echo "$test" | sed "${noteNum}q;d"`
            note=`echo $note*$pond | bc`

            student[$j]=`echo ${student[$j]}+$note | bc`
        done
    done

    #Concaténation des lignes restantes avec les notes des étudiants
    for (( i=0; i < n; i++ )); do

        let lineNum=$i+2

        content+=`sed "${lineNum}q;d" $1` #Ajout de la prochaine ligne

        #Ajout de la note finale de l'étudiant
        content+=','`echo ${student[$i]} | cut -d '.' -f1`'.'

        j=1
        start=1 #Variable de début de position de coupage

        #Nombre de positions après le point flottant
        let declength=`echo ${student[$i]} | cut -d '.' -f2 | wc -c`-1

        #On itère sur chaque position après le point flottant
        while [ $j -le $declength ]; do
            if [ `echo ${student[$i]} | cut -d '.' -f2 | cut -c $j` != '0' ]
            then
                #Ajout des portions du contenu ne possédant pas de 0 à la fin
                content+=`echo ${student[$i]} | cut -d '.' -f2 |
                cut -c $start-$j`

                let start=$j+1 #Déplacement de l'index de début
            fi
            let j++
        done

        let lastField=$fields+1

        #Dans le cas où il n'y a pas de décimales après la virgule
        if [ -z `echo $content | sed "${lineNum}q;d" |cut -d ',' -f$lastField |
        cut -d '.' -f2` ]; then
            content=${content%.}
        fi

        content+=$'\n'
    done

    #Le fichier est créé
    echo -n "$content" > notes.csv
fi