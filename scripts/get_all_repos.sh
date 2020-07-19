#!/bin/bash

if [ -z "$1" ]; then
  echo 'NO_REPO_PATH'
  exit 1
fi

echo $(find $1 -type d -name '*.git' | tr '\n' ',')