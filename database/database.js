const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;

async function connect() {
  const client = await MongoClient.connect(
    "mongodb+srv://chungpodo:C5UOdgTJJejarxi8@cluster0.8eqm44w.mongodb.net/?retryWrites=true&w=majority"
  );
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
