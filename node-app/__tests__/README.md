# Pre-requisite
1. First run the docker image for postgres
- cd dockerise-postgres
- docker-compose up --build

# Steps
2. pnpm run test

# NOTES: 
- Technically coverage won't capture the files inside the dockerise-postgres
- But we can create tests here to imply expected behaviour and output of the docker container

# TODO
- Test inserted table
- Test content of table
- Test all data still exists in the container - "/var/postgresql/data/".
- Test pg_hba connection rules applied