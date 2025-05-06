#!/bin/bash

site_dir=$(dirname $BASH_SOURCE)/..
name=$(echo `date '+%Y-%m-%d-%s'`)
date=$(echo `date '+%Y-%m-%d %H:%M:%S'`)
templ=$(cat <<TEXT
---
layout: post
date: $date +0800
---
TEXT
)
echo "$templ" > ${site_dir}/_buzzes/${name}.md
