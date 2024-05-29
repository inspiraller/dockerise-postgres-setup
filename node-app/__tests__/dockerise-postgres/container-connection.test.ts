import dotEnv from "dotenv";
import { describe, it, expect } from "@jest/globals";
import { DatabasePool, createPool, sql } from "slonik";

dotEnv.config();

const { env } = process;

const db = env.PG_DB as string;
const user = env.PG_USER as string;
const pwd = env.PG_PWD as string;
const table = env.PG_TABLE as string;

export const port = 5432;
export const host = "localhost";

let pool: DatabasePool;

describe("dockerise postgres connection test", () => {
  beforeAll(() => {
    pool = createPool(
      `postgresql://${user}:${pwd}@${host}:${port}/${db}`
    );
  })
  afterAll(() => {
    pool.end();
  })
  it("opens connection to docker postgres", async () => {
    expect(pool.getPoolState().activeConnectionCount).toBe(0);
    await pool.connect( async (connection) => {
      expect(pool.getPoolState().activeConnectionCount).toBe(1);
      return true;
    });
    expect(pool.getPoolState().activeConnectionCount).toBe(0);
  });
  it("runs sql query on connection", async () => {
    const resultExist = await pool.connect( async (connection) => {
      expect(pool.getPoolState().activeConnectionCount).toBe(1);
      return connection.query(sql`SELECT EXISTS (SELECT FROM pg_tables WHERE tablename  = ${table});`);
    });
    expect(resultExist.rows[0].exists).toBe(true);
  });
});
