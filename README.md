# What does this repo do
This example shows how to dockerise a postgres container.
- I want to create my container with defined variables in a .env file.
- I want to be able to seed my container with a pre-created table init.mytable.csv BUT NOT overwrite the existing data inside: "/var/postgresql/data/". (I want to merge it with the existing data)
- I want to provide a conf file to the container onload.
(Having to symlink to another folder to prevent timing issue of docker loading its own default postgresql.conf over my loaded item)
- I want to be able to connect to the container via docker exec command and run psql statements
- I want to be able to connect to the container exernally via nodejs or equivalent and run sql statements against it to output data
---
# Setup
## 1. First copy .env.example to both folders as .env
- /dockerise-postgres/.env
- /node-app/.env

## 2. dockerise start postgres
- cd dockerise-postgres
- docker-compose up --build

#### Troubleshoot: close connection
- docker-compose down mycontainer
- docker image rm postgres

## 3. node
- cd node-app
- pnpm i
- pnpm start

**Expected output**
 - Should connect to db using variables from .env
 - Should run sql command and log to the console

done!
---

# Testing:
## Debug inside the container
- docker exec -it mycontainer bash

## Connect to container via psql
// connect   containername  language username  database
- docker exec -it mycontainer psql -U mysuperuser -d mydb

### Run commands inside the container using psql
```
SELECT EXISTS (SELECT FROM pg_tables WHERE tablename = 'mytable');
SELECT * FROM mytable ORDER BY id ASC;
```

### exit
\q

### Force exit?
[ctrl] D 

---
# Debug docker useful
- docker-compose config
- docker ps -a
- docker mycontainer stop
- docker mycontainer rm
- docker volume prune
- docker system prune
- docker image ls
- docker image rm myimg
- docker-compose build --no-cache
