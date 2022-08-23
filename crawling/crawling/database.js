import oracledb from 'OracleDB';
// import db_info from './dbconfig.js';


// oracledb.getConnection({ user: "jeju", password: "1111", connectString: "np.silly.monster/xe" })
// console.log("Database connecting completed")


// 초기화
function init() {

  //oracle client 경로 설정
  oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_6' });
  console.log('db init complete!!!');
  console.log(oracledb.oracleClientVersionString)

}

async function run() {

  let connection;

  try {

    connection = await oracledb.getConnection({ user: "jeju", password: "1111", connectString: "np.silly.monster/xe" })

    console.log("Successfully connected to Oracle Database");

    // Insert some data

    const sql = `insert into TBL_CHARGERLOC (chagerid,name,address,latitude,longitude) values(:1, :2, :3, :4, :5)`;

    const rows =
      [[2, "DD", "DDD", 123, 456]]

    let result = await connection.executeMany(sql, rows);

    console.log(result.rowsAffected, "Rows Inserted");

    connection.commit();

    // Now query the rows back

    result = await connection.execute(
      `select chagerid,name,address,latitude,longitude from TBL_CHARGERLOC`,
      [],
      { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    const rs = result.resultSet;
    let row;

    while ((row = await rs.getRow())) {
      if (row.DONE)
        console.log(row.DESCRIPTION, "is done");
      else
        console.log(row.DESCRIPTION, "is NOT done");
    }

    await rs.close();

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}


init();
run();


// async function dbConnect() {
//   //   let connection;

//   try {
//     let connection;
//     connection = oracledb.getConnection({ user: "ADMIN", password: "Dkagh1234!!!", connectionString: "jejutest_high" });
//     console.log("Successfully connected to Oracle Database");
//     // Create a table

//     await connection.execute(`begin
//                                 execute immediate 'drop table todoitem';
//                                 exception when others then if sqlcode <> -942 then raise; end if;
//                               end;`);

//     await connection.execute(`create table todoitem (
//                                 id number generated always as identity,
//                                 description varchar2(4000),
//                                 creation_ts timestamp with time zone default current_timestamp,
//                                 done number(1,0),
//                                 primary key (id))`);

//     // Insert some data

//     const sql = `insert into todoitem (description, done) values(:1, :2)`;

//     const rows =
//       [["Task 1", 0],
//       ["Task 2", 0],
//       ["Task 3", 1],
//       ["Task 4", 0],
//       ["Task 5", 1]];

//     let result = await connection.executeMany(sql, rows);

//     console.log(result.rowsAffected, "Rows Inserted");

//     connection.commit();

//     // Now query the rows back

//     result = await connection.execute(
//       `select description, done from todoitem`,
//       [],
//       { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

//     const rs = result.resultSet;
//     let row;

//     while ((row = await rs.getRow())) {
//       if (row.DONE)
//         console.log(row.DESCRIPTION, "is done");
//       else
//         console.log(row.DESCRIPTION, "is NOT done");
//     }
//     await rs.close();

//   } catch (err) {
//     console.error(err);

//   } finally {
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   }
// }
// init()
// dbConnect()


// // 초기화
// function init() {

//   //oracle client 경로 설정
//   oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_6' });
//   console.log('db init complete!!!');
//   console.log(oracledb.oracleClientVersionString)

// }
// async function run() {

//   let connection;

//   try {

//     connection = await oracledb.getConnection({ user: "ADMIN", password: "Dkagh1234!!!", connectionString: "jejutest_high" });

//     console.log("Successfully connected to Oracle Database");

//     // Create a table

//     await connection.execute(`begin
//                                 execute immediate 'drop table todoitem';
//                                 exception when others then if sqlcode <> -942 then raise; end if;
//                               end;`);

//     await connection.execute(`create table todoitem (
//                                 id number generated always as identity,
//                                 description varchar2(4000),
//                                 creation_ts timestamp with time zone default current_timestamp,
//                                 done number(1,0),
//                                 primary key (id))`);

//     // Insert some data

//     const sql = `insert into todoitem (description, done) values(:1, :2)`;

//     const rows =
//       [["Task 1", 0],
//       ["Task 2", 0],
//       ["Task 3", 1],
//       ["Task 4", 0],
//       ["Task 5", 1]];

//     let result = await connection.executeMany(sql, rows);

//     console.log(result.rowsAffected, "Rows Inserted");

//     connection.commit();

//     // Now query the rows back

//     result = await connection.execute(
//       `select description, done from todoitem`,
//       [],
//       { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

//     const rs = result.resultSet;
//     let row;

//     while ((row = await rs.getRow())) {
//       if (row.DONE)
//         console.log(row.DESCRIPTION, "is done");
//       else
//         console.log(row.DESCRIPTION, "is NOT done");
//     }

//     await rs.close();

//   } catch (err) {
//     console.error(err);
//   } finally {
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   }
// }

// run();
// init()
