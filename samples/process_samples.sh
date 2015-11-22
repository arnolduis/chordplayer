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
source="base"
dest="2mp"
processing="gain 0 fade 0.05 2 0.1 pad 0 2 reverb 50 70 100 100 20 5 "
flags=""

for f in ./$source/$instrument/*.ogg; 
do
	tempfile="${f##*/}"
	echo ${tempfile%.*}
	sox $flags $f ./$dest/$instrument/${tempfile%.*}.ogg $processing
done

# original
# processing="fade 0.05 2 0.1" 

# reverb: [reverberance (50%) [HF-damping (50%) [room-scale (100%) [stereo-depth (100%) [pre-delay (0ms) [wet-gain (0dB)]]]]]]

# strings reverb. 
# processing="gain -5 fade 0.05 2 0.1 pad 0 3 reverb 100 57 100 100 20 5 fade 0 5 2"

# guitar 
# processing="gain -3 fade 0.05 2 0.1 pad 0 3 reverb 50 90 80 100 0 5"

# piano
# processing="gain 0 fade 0.05 2 0.1 pad 0 2 reverb 50 70 100 100 20 5 "
# 