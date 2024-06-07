FROM postgres

# Env variable is not sufficient here. Need arg.
ARG PG_DB
ARG PG_TABLE

# seed.sql (needs to be populated with variables)
COPY ./scripts/seed.sql /docker-entrypoint-initdb.d/seed.sql
COPY ./scripts/populate-args.sh /scripts/populate-args.sh
RUN chmod +x /scripts/populate-args.sh
RUN /scripts/populate-args.sh PG_DB "${PG_DB}" PG_TABLE "${PG_TABLE}"


# copy-data.sh
COPY ./postgresql_data ./temp

##  ssl permission
RUN chmod 600 /temp/ssl/server.key
RUN chown postgres:postgres /temp/ssl/server.key

## -----------------------------------------------------------
# /docker-entrypoint-initdb.d
# copy-data.sh
COPY ./scripts/copy-data.sh /docker-entrypoint-initdb.d/copy-data.sh

# sym-conf.sh
COPY ./scripts/sym-conf.sh /docker-entrypoint-initdb.d/sym-conf.sh





