import dotEnv from "dotenv";
import pg from "pg";
import fs from "fs";
import path from "path";
dotEnv.config();

const { env } = process;

const PG_DB = env.PG_DB as string;
const PG_USER = env.PG_USER as string;
const PG_PWD = env.PG_PWD as string;
const PG_TABLE = env.PG_TABLE as string;

const pem = fs
  .readFileSync(path.join(__dirname, "./ssl/server.pem"))
  .toString();

const init = () => {
  console.log("CREATE POOL..");

  const client = new pg.Client({
    user: PG_USER,
    password: PG_PWD,
    database: PG_DB,
    port: 5432,
    host: "localhost",
    ssl: {
      ca: pem,
    },
  });
  client.connect();

  client.query(
    `SELECT EXISTS (SELECT FROM pg_tables WHERE tablename  = ${PG_TABLE});`,
    (err, result) => {
      console.log('pg query 1', {err, result})
     // const isExist = result.rows[0].exists;
     // console.log("DB exists =", { isExist });
    }
  );

  // NOTE: Could need to use sql.identifier to reference dynamic table name.
  client.query(`SELECT * FROM ${PG_TABLE} ORDER BY id ASC`, (err, result) => {
    console.log('pg query 2', {err, result})
   // console.log("TABLE ROWS", { result });
  });
};

init();
