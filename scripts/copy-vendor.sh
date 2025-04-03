#!/bin/bash

mkdir -p assets/js/vendor

copy_if_needed() {
  src=$1
  dest=$2

  if [ ! -f "$dest" ] || [ "$src" -nt "$dest" ]; then
    cp "$src" "$dest"
  fi
}

