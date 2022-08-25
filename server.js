import express from "express";
import { readdirSync } from "fs";
import cors from "cors";
import mongoose from "mongoose";
const morgan = require("morgan");

//enable .env use in the application
require("dotenv").config();

//initialize the server
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

//cors prevents Cross Origin Resource Sharing error
app.use(cors());
//log all requests and responses for better development
app.use(morgan("dev"));
//can use instead of body-parser to parse incoming requests
app.use(express.json());

const port = process.env.PORT || 6000;

//importing all routes
readdirSync("./routes").map((x) => app.use("/api", require(`/routes/${x}`)));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
