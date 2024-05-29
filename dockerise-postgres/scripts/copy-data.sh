#!/bin/sh
 
echo "scripts/copy-data.sh ________________________________"
cp /temp/data/* -u /var/lib/postgresql/data
# https://stackoverflow.com/questions/77240853/custom-pg-hba-conf-not-copied-to-postgresql-docker-container


