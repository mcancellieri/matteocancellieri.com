#!/bin/bash

FILES="$1/*.jpg"

for f in $FILES
do
  echo $f
	filename="${f##*/.jpg}"
  extension="${filename##*.}"
  filename="${filename%.*}"
	echo $filename
	cwebp -q 80 $f -o ${filename}.webp
done
