#! /bin/bash

####
# @Philippe Gabriel
# @Version 0.0 2020-04-24
# ./greetme.sh
#
# Le but de ce programme est d'interagir avec l'usager via différentes
# commandes
####

echo Bonjour $USER
echo; date;
echo; cal;
echo; hostname;
echo; cat /etc/os-release;
echo; ls;
echo; ps -u root;
echo; echo $TERM;
echo; echo $PATH;
echo; echo $HOME;
echo; du -h
echo; id -g
echo; echo fin de script
echo; echo Bye $USER