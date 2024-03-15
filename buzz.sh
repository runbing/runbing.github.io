#!/bin/bash

name=$(echo `date '+%Y-%m-%d-%H%M'`)
date=$(echo `date '+%Y-%m-%d %H:%M:%S'`)
templ=$(cat <<TEXT
---
layout: post
date: $date +0800
---
TEXT
)
echo "$templ" > _buzzes/${name}.md
