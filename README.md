# What does this repo do
This example shows how to dockerise a postgres container.
- Copy data from local folder into the container
- initialise a seed.sql to create a table with name from .env
- Copy the content from my init.table.csv and MERGE it with existing content at "/var/postgresql/data/" NOT copy over it.
- Copy conf files pg_hba and postgresql.conf into the /temp folder
- Sym link the /temp folder conf files to the destination of "/var/postgresql/data/postgresql.conf"

# First copy .env.example to both folders as .env
/dockerise-postgres/.env
/node-app/.env

# dockerise start postgres
cd dockerise-postgres
docker-compose up --build

# close connection
docker-compose down mycontainer
docker image rm postgres

# node
cd node-app
pnpm i
pnpm start

# Testing:
## or debug
docker exec -it mycontainer bash

## connect
// connect     containername  language username  database
docker exec -it mycontainer psql -U mysuperuser -d mydb

# Search if table exist
```
SELECT EXISTS (SELECT FROM pg_tables WHERE tablename = 'mytable');
```

# Search files 
```
SELECT * FROM mytable ORDER BY id ASC;
```

# view db
\dt

```
List of relations
 Schema | Name  | Type  |        Owner
--------+-------+-------+---------------------
 public | mytable | table | postgres_mytable_user
(1 row)
```
# exit
\q

# Force exit?
[ctrl] D 

# docker commands - show containers
- docker ps -a
- docker volume ls
- docker image ls

**log the docker container id for debugging**
- docker logs baf32ff7ec03

------------------------------------------
# Troubleshooting: - syntax error at or near "$1"
- This seems to be caused by interpolation problems.
- Ensure you have not wrapped a pool.connect inside a pool.connect
- Know that the variables interpolated may be processed with a single quote
- Ensure each sql statments end in semi colon;

# Investigation:
- kill/clear the postgres-sql container and volumes
- Consider downgrading or upgrading slonik
- Test the sql commands in docker container as above

# Run bash script
sh postgres-db\script.sh
- pass variables - https://www.baeldung.com/linux/use-command-line-arguments-in-bash-script


# NOTES: .env variables
https://stackoverflow.com/questions/29377853/how-can-i-use-environment-variables-in-docker-compose
- .env is not .env_file !

# Debug docker
docker-compose config

# TODO = copy conf:
- https://stackoverflow.com/questions/30848670/how-to-customize-the-configuration-file-of-the-official-postgresql-docker-image

# chmod useful
https://www.warp.dev/terminus/linux-chmod-command#:~:text=To%20make%20a%20file%20executable,%2C%20e.g.%20chmod%20ug%2Bx.


# DEBUGGING cache not clearing
- only way to clear cache 
docker ps -a
docker mycontainer stop
docker mycontainer rm
docker volume prune
docker system prune
If this still fails
- docker image ls
- docker image rm myimg
- docker-compose build --no-cache

# DEBUGGING - BASH script not found
- this is because of using latest postgres img -     image: postgres
which uses alpine that doesnt use bash.

**Dockerfile**
```dockerfile
# DONT! 
# RUN myscript.sh
# DOOOO RUN ./myscript.sh
``` 
**myscript.sh**
```sh
#!/bin/sh
echo 'something'
```

