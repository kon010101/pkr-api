const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const {isAuth} = require('./auth/isAuth')

//api
const user = require("./api/user");

//load cfg
dotenv.config({ path: "./config/config.env" });

//connect to database
connectDB();

const app = express();

//use morgan for logging + add cors in development
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    app.use(cors());
}

//middlewares
app.use(cookieParser());
app.use(express.json());

//api routes
app.use("/api/user", user);

app.post('/protected', async (req, res) => {
    console.log("PROCC")
    try {
      const userId = isAuth(req);
      if (userId !== null) {
        res.send({
          data: 'This is protected data.',
        });
      }
    } catch (err) {
      res.send({
        error: `${err.message}`,
      });
    }
  });

//constants
const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV}`));
