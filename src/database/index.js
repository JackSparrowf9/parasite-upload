import mongoose from "mongoose";
import { MONGO_OPTIONS, MONGO_URI } from "../config.js";

mongoose.Promise = global.Promise;

// Only reconnect if needed. State is saved and outlives a handler invocation
let conn;

const db = {
  connect: () => {
    try {
      if (!conn) {
        console.log("Creating new database connection");
        mongoose.connect(MONGO_URI, MONGO_OPTIONS);

        conn = mongoose.connection;
      } else {
        console.log("Re-using existing database connection");
        mongoose.connection = conn;
      }

      // return mongoose.connect(MONGO_URI, MONGO_OPTIONS).then((db) => {
      //   // console.log(db.connection.readyState);
      //   isConnected = db.connection.readyState;
      //   // console.log("isConnected: ", isConnected);
      // });
    } catch (error) {
      console.log("Could not connect to database", error);
    }
  },

  ObjectId: (id) => {
    return new mongoose.Types.ObjectId(id);
  },
};

export default db;
