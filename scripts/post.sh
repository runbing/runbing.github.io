#!/bin/bash

site_dir=$(dirname $BASH_SOURCE)/..
name=$(date '+%Y-%m-%d-%s')
datetime=$(date '+%Y-%m-%d %H:%M:%S')
templ=$(cat <<TEMPL
---
layout: article
title: ""
date: $datetime +0800
updated: $datetime +0800
author:
  - Runbing
tags:
  -
categories:
  -
excerpt:
---
\n
TEMPL
)

echo -e "$templ" > ${site_dir}/_posts/${name}.md
