#!/bin/bash
if [ -z "$1" ]; then
  echo 'NO_REPO_PATH'
  exit 1
fi

if [ -z "$2" ]; then
  echo 'NO_REPO_NAME'
  exit 1
fi

GIT_DIR=$1/$2.git

if [ ! -d "$GIT_DIR" ]; then
  echo 'REPO_NOT_EXISTS'
  exit 1
fi

rm -rf $GIT_DIR

echo "Successfully deleted repository named [$2.git]"