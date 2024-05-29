#!/bin/sh
echo "scripts/populate-args.sh ___________________________________"

while test $# -gt 0
do
  echo "populate arg ${1} into seed.sql"
  sed  -i "s/\${$1}/$2/g" /docker-entrypoint-initdb.d/seed.sql
  shift
  shift
done


