const MONGO_CONFIGS = require("./mongo.config");
const mongoose = require("mongoose");

//Load in all of the schemas, they will attached to each successful connection
const userSchema = require("./models/users");
const programSchema = require("./models/programs.js");
const organizationSchema = require("./models/organizations");
const formsSchema = require("./models/forms");
const submissionSchema = require("./models/submission");
const reviewSchema = require("./models/reviews");
const rankingSchema = require("./models/rankings");

//legacy
const applicationLegacySchema = require("./models/legacy/application");
const rankingLegacySchema = require("./models/legacy/stackedRankings");
const ratingLegacySchema = require("./models/legacy/ratings");

console.info("Attempting to connect to Mongo...");
const USERNAME = MONGO_CONFIGS.module.mongoUsername;
const PASS = MONGO_CONFIGS.module.mongoPassword;

//For debugging the database
mongoose.set("debug", true);

//A object to store connections - this is what we export
const connections = {};

//------------------------------------------------------------------------------
//FETCH PROGRAMS
//------------------------------------------------------------------------------

//Our Authentication database holds a list of all programs.
//Once we load in the programs we can make a connection to each of them
const mongoPrograms = connect("Authentication");

//Authentication database only holds the users and programs (global scope)
const programModel = mongoPrograms.model("programModel", programSchema);
const userModel = mongoPrograms.model("userModel", userSchema);
const organizationModel = mongoPrograms.model(
  "organizationModel",
  organizationSchema
);
const formsModel = mongoPrograms.model("formsModel", formsSchema);
const submissionModel = mongoPrograms.model(
  "submissionModel",
  submissionSchema
);
const reviewModel = mongoPrograms.model("reviewModel", reviewSchema);
const rankingModel = mongoPrograms.model("rankingModel", rankingSchema);
const newConnection = {
  mongo: mongoPrograms,
  users: userModel,
  programs: programModel,
  organizations: organizationModel,
  forms: formsModel,
  submissions: submissionModel,
  reviews: reviewModel,
  rankings: rankingModel
};
connections["Authentication"] = newConnection;

//------------------------------------------------------------------------------
//LOAD PROGRAMS
//------------------------------------------------------------------------------

connections["Authentication"].programs
  .find()
  .then(function(found) {
    //For each program create a new database connection.
    //If a database does not exist it will be created
    found
      .filter((program) => program.appVersion === 1)
      .forEach((item) => {
        addConnection(item);
      });
  })
  .catch(function(err) {
    console.error("ERROR fetching programs");
    console.error(err);
  });

//Helper
function connect(database) {
  return mongoose.createConnection(
    `mongodb+srv://${USERNAME}:${PASS}@cluster0-kbiz0.mongodb.net/${database}`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function(err) {
      if (err) {
        console.info("Mongo DB connection failed: " + database);
        console.error(err);
      } else {
        console.info("Mongo DB connection successful: " + database);
      }
    }
  );
}

function addConnection(database) {
  if (connections[database._id] == null) {
    const mongo = connect(database.databaseName);

    //These collections exist in every database except Authentication (program scope)
    const applicationModel = mongo.model(
      "applicationModel",
      applicationLegacySchema
    );
    const rankingModel = mongo.model("rankingModel", rankingLegacySchema);
    const ratingModel = mongo.model("ratingModel", ratingLegacySchema);

    //These are program specific collections. Each program has a database with
    //the collections below.
    //TODO: Move all program data to the program schema in the far future
    const newConnection = {
      mongo: mongo,
      applications: applicationModel,
      rankings: rankingModel,
      ratings: ratingModel
    };
    connections[database._id] = newConnection;
  }
}

console.info("Number of connections: " + mongoose.connections.length);
// need this for promises
mongoose.Promise = Promise;

module.exports = connections;
module.exports.addConnection = addConnection;
