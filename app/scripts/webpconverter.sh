#!/bin/bash

FILES="$1/*.png"

for f in $FILES
do
  echo $f
	filename="${f##*/.png}"
  extension="${filename##*.}"
  filename="${filename%.*}"
	echo $filename
	cwebp -q 80 $f -o ${filename}.webp
done
