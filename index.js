const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const db = require("./Config/db");

// dotenv config to load environment variables from.env file
dotenv.config();

//connect to database
db();

//routes

const admin = require("./Routes/adminRoute");
const service = require("./Routes/serviceRoute");
const invoice = require("./Routes/invoiceRoute");

//init app and middleware
const app = express();

//middleware to handle CORS requests (Cross-Origin Resource Sharing)
app.use(cors());
//body parser middleware to parse incoming request bodies
app.use(bodyParser.json({ limit: "10mb" }));
//express middleware to parse JSON and url-encoded data
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//port
const PORT = 5000 || process.env.PORT;

//home route
app.get("/", (req, res) => {
  res.send("Welcome to Ashraf Sever");
});

//use routes

app.use("/api/v1", admin);
app.use("/api/v1", service);
app.use("/api/v1", invoice);

//listen server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});
