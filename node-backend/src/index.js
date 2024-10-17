import app from "./app.js";
import express from "express";
import env from "dotenv";

import { engine } from "express-handlebars";
env.config();

app.engine(
  "hbs",
  engine({
    extname: ".hbs", // Set file extension to '.hbs'
    defaultLayout: "main", // Optional: layout file (like 'main.hbs')
    layoutsDir: "./views/layouts", // Directory for layout files
    partialsDir: "./views/partials", // Directory for partials
  })
);
app.set("view engine", "hbs"); // Set view engine to 'hbs'
app.set("views", "./views");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

try {
  app.listen(process.env.PORT, () => {
    console.log(`server is running at ${process.env.PORT}`);
  });
} catch (err) {
  console.log(err);
}
