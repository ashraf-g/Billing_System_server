const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./src/config/db");

// dotenv config to load environment variables from.env file
require("dotenv").config({ path: "./src/.env" });

//connect to database
db();

//init app and middleware
const app = express();

//middleware to handle CORS requests (Cross-Origin Resource Sharing)
let corsPolicy = {
  origin: "*",
};
app.use(cors(corsPolicy));
//body parser middleware to parse incoming request bodies
app.use(bodyParser.json({ limit: "10mb" }));
//express middleware to parse JSON and url-encoded data
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//home route
app.get("/", (req, res) => {
  res.send("Welcome to Ashraf Sever");
});

//use routes
require("./src/routes/adminRoute")(app);
require("./src/routes/serviceRoute")(app);

//listen server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT} `);
});
