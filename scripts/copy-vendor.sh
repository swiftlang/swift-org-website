#!/bin/bash

mkdir -p assets/js/vendor

copy_if_needed() {
  src=$1
  dest=$2

  if [ ! -f "$dest" ] || [ "$src" -nt "$dest" ]; then
    cp "$src" "$dest"
  fi
}

copy_if_needed node_modules/animejs/lib/anime.iife.min.js assets/javascripts/new-javascripts/vendor/anime.iife.min.js
