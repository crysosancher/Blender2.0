require("dotenv").config();
const { Pool } = require("pg");

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

//create createCountWarningTable table if not there
const createCountWarningTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS countwarning(memberjid text , count integer);"
  );
};

module.exports.getCountWarning = async (memberjid) => {
  await createCountWarningTable();
  let result = await pool.query(
    "SELECT count FROM countwarning WHERE memberjid=$1;",
    [memberjid]
  );
  if (result.rowCount) {
    return result.rows[0].count;
  } else {
    return 0;
  }
};

module.exports.setCountWarning = async (memberJid) => {
  if (!groupJid.endsWith("@g.us")) return;
  await createCountWarningTable();

  //check if groupjid is present in DB or not
  let result = await pool.query(
    "select * from countwarning WHERE memberjid=$1;",
    [memberJid]
  );

  //present
  if (result.rows.length) {
    let count = result.rows[0].count;

    await pool.query(
      "UPDATE countwarning SET count = count+1 WHERE memberjid=$1;",
      [memberJid]
    );
    await pool.query("commit;");
    return count + 1;
  } else {
    await pool.query("INSERT INTO countwarning VALUES($1,$2);", [
      memberJid,
      1,
    ]);
    await pool.query("commit;");
    return 1;
  }
};
