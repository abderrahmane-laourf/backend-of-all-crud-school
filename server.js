//import app
const app = require("./app");
const runSeeder = require("./app/seeders");

//import config module
const CONFIG = require("./config/config");

//import database connection function
const connectToDB = require("./db/mongodb");

//invoke connecToDB function
connectToDB();

// seed data
runSeeder();

app.listen(CONFIG.PORT, () => {
  console.log(`Server is running on http://localhost:${CONFIG.PORT}`);
});
