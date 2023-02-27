const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let client;
let database;

async function connect() {
  if (client && client.isConnected()) {
    // If there's already a connected client, reuse it
    database = client.db();
  } else {
    // If not, create a new client and connect to the database
    client = await MongoClient.connect(
      "mongodb+srv://chungpodo:C5UOdgTJJejarxi8@cluster0.8eqm44w.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    database = client.db("kCook");
  }
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
