#!/bin/bash

echo 'enter an image path:'
read img_path

magick $img_path -resize 400x -gravity Center -crop 400x250+0+0 +repage -sharpen 18 ${img_path%%.*}_thumbnail.jpg
