const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

//load cfg
dotenv.config({ path: "./config/config.env" });

//connect to database

const app = express();

//use morgan for logging + add cors in development
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    app.use(cors());
}

//middlewares
app.use(express.json());

//api routes

//constants
const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV}`));
