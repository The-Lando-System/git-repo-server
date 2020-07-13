#!/bin/bash

if [ -z "$1" ]; then
  echo 'NO_REPO_PATH'
  exit 1
fi

echo $(ls -md $1/*.git)