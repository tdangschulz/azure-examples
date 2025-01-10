const mysql = require("mysql2/promise");

exports.database = async (req, res) => {
  const connection = await connecting();

  res.json({
    message: await testQuery(connection),
    status: "success",
  });
};

const connecting = async () => {
  // Create the connection to database
  return await mysql.createConnection({
    host: "192.168.42.179",
    user: "user",
    password: "password",
    port: 3306,
    database: "myDB",
  });
};

const testQuery = async (connection) => {
  // A simple SELECT query
  try {
    const [results, fields] = await connection.query(
      "SELECT * FROM `Language` WHERE `id` = 1"
    );

    return results;
  } catch (err) {
    console.log(err);
  }
};
