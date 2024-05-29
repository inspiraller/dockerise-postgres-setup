-- need variables
-- PG_TABLE

CREATE TABLE IF NOT EXISTS ${PG_TABLE}(
  id SERIAL PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  completed BOOLEAN NOT NULL
);

COPY ${PG_TABLE} FROM '/var/lib/postgresql/data/init.table.csv' DELIMITER ',' CSV HEADER;
