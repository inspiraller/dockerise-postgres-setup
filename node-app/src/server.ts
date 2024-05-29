import dotEnv from "dotenv";
import { sql, createPool } from "slonik";

dotEnv.config();

const { env } = process;

const PG_DB = env.PG_DB as string;
const PG_USER = env.PG_USER as string;
const PG_PWD = env.PG_PWD as string;
const PG_TABLE = env.PG_TABLE as string;

// console.log("env=================", env);
const init = () => {
  // postgresql://[user[:password]@][host[:port]][/database name][?name=value[&...]]
  console.log("CREATE POOL..");
  const pool = createPool(
    `postgresql://${PG_USER}:${PG_PWD}@localhost:5432/${PG_DB}`
  );

  pool.connect(async (connection) => {
    try {
      const resultExist = await connection.query(sql`SELECT EXISTS (SELECT FROM pg_tables WHERE tablename  = ${PG_TABLE});`);
      const isExist = resultExist.rows[0].exists;
      console.log('DB exists =', {isExist})

      // NOTE: Could need to use sql.identifier to reference dynamic table name.
      const resultRows = await connection.query(sql`SELECT * FROM ${sql.identifier([PG_TABLE])} ORDER BY id ASC`);
      console.log('TABLE ROWS', {resultRows})

    } catch (err) {
      console.log(err);
    }
  });
};

init();
