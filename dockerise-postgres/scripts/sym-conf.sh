#!/bin/sh

# https://stackoverflow.com/questions/77240853/custom-pg-hba-conf-not-copied-to-postgresql-docker-container

echo "scripts/sym-conf.sh ___________________________________"

symlinkFile () {
   local SOURCE_FILE
   SOURCE_FILE="$1"
   TARGET_FILE="$2"

   echo "SOURCE_FILE=$SOURCE_FILE"
   echo "TARGET_FILE=$TARGET_FILE"

  # Check if the symlink already exists
  if [ -L "$TARGET_FILE" ]; then
    echo "Symlink already exists for pg_hba.conf, no action needed."
  else
    # Check if the target file already exists
    if [ -e "$TARGET_FILE" ]; then
      # Delete the existing file
      rm "$TARGET_FILE"
      echo "Existing file pg_hba.conf deleted."
    fi

    # Create the symlink
    ln -s "$SOURCE_FILE" "$TARGET_FILE"
    echo "Symlink for pg_hba.conf created."
  fi
}

symlinkFile "/temp/conf/pg_hba.conf" "/var/postgresql/data/pg_hba.conf"
symlinkFile "/temp/conf/postgresql.conf" "/var/postgresql/data/postgresql.conf"
