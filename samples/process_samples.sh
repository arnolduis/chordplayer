#!/bin/bash

# SAVEIFS=$IFS
# IFS=$(echo -en "\n\b")
# for f in ./strings/*.ogg; 
# do
# 	tempfile="${f##*/}"
# 	number=$( echo "${tempfile%.*}" | cut -d ' ' -f2 | cut -d"-" -f2)
# 	mv $f ./rename/string_$number.ogg
# done
# IFS=$SAVEIFS

instrument="piano"
length="2mp"
processing="fade 0.05 2 0.1"

for f in ./base/$instrument/*.ogg; 
do
	tempfile="${f##*/}"
	echo ${tempfile%.*}
	sox $f ./$length/$instrument/${tempfile%.*}.ogg $processing
done
