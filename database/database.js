const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;

async function connect() {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  database = client.db("kCook");
}
function getDB() {
  if (!database) {
    throw { message: "Db connection incomplete" };
  }
  return database;
}

module.exports = {
  connectToDb: connect,
  getDB: getDB,
};
