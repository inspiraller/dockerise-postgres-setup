// // RUN echo "host mydb mysuperuser    0.0.0.0/0  md5" >> /temp/conf/pg_hba.conf

// // RUN echo "host mydb mysuperuser    192.168.1.101  md5" >> /temp/conf/pg_hba.conf

// // Test listen address
// // To get host name: ping host.docker.internal
// // - https://stackoverflow.com/questions/48341164/how-to-make-postgres-docker-accessible-for-any-ip-remotely

// // host    mydb             mysuperuser      192.168.1.101/32        trust

// //  no pg_hba.conf entry for host "192.168.176.1", user "mysuperuser", database "mydb", no encryption   
// // "192.168.192.1

// // trust methods - https://www.enterprisedb.com/blog/how-to-secure-postgresql-security-hardening-best-practices-checklist-tips-encryption-authentication-vulnerabilities
// // Works for local - 0 nmeans any range
// // host    mydb             mysuperuser      192.168.0.0/16        trust

// -----------------------------------------------------------------------------------
// after restart: sudo -u postgres pg_ctl reload -D $PGDATA
// ------------------------------------------------------------------------------------
// for openssl
// - https://stackoverflow.com/questions/3358420/generating-a-sha-256-hash-from-the-linux-command-line
// echo -n "foobar" | openssl dgst -sha256
// ------------------------------------------
// import dotEnv from "dotenv";
// import { DatabasePool, createPool } from "slonik";
// import { cmdToOutput, trim } from "__tests__/__test_utils__/cmdToOutput";

// dotEnv.config();

// const { env } = process;

// const db = env.PG_DB as string;
// const user = env.PG_USER as string;
// const pwd = env.PG_PWD as string;

// export const port = 5432;
// export const host = "localhost";

// let pool: DatabasePool;

// const testUser = "testuser";
// describe("dockerise postgres connection test", () => {

//   it("Adds host to pg_hba and opens connection to docker postgres", async () => {

  

//     pool = createPool(
//       `postgresql://${testUser}:${pwd}@${host}:${port}/${db}`
//     );

//     expect(pool.getPoolState().activeConnectionCount).toBe(0);
//     await pool.connect( async (connection) => {
//       expect(pool.getPoolState().activeConnectionCount).toBe(1);
//       return true;
//     });
//     expect(pool.getPoolState().activeConnectionCount).toBe(0);

    
//     await cmdToOutput(`docker exec mycontainer bash -c ' echo "host mydb ${testUser} 192.168.1.101 sha256" >> /temp/conf/pg_hba.conf'`);

//     pool.end();
//   });

// });
