#!/bin/sh
# stash unstaged changes, run pre-commit task, stage release updates and restore stashed files

NAME=$(git branch | grep '*' | sed 's/* //')

# don't run on rebase
if [ $NAME != '(no branch)' ]
then
  git stash -q --keep-index
  gulp pre-commit

  RETVAL=$?

  if [ $RETVAL -ne 0 ]
  then
    exit 1
  fi

  git add .
  git stash pop -q
fi
