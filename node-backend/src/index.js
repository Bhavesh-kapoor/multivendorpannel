import app from "./app.js";
import express from "express";
import env from "dotenv";

import connectDB from "./db/connection.js";
import { engine } from "express-handlebars";
env.config();


try {
  await connectDB().then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server is running at ${process.env.PORT}`);
    });
  });
} catch (err) {
  console.log(err);
}
