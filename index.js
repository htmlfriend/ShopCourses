const express = require("express");
const path = require("path");
const exphbrs = require("express-handlebars");
const app = express();
const hbs = exphbrs.create({
  defaultLayout: "main",
  extname: "hbs",
});

const homeRouter = require("./routes/home");
const coursesRouter = require("./routes/courses");
const addRouter = require("./routes/add");

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/", homeRouter);
app.use("/add", addRouter);
app.use("/courses", coursesRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, (req, res) => {
  console.log("I am running ... on", PORT);
});
