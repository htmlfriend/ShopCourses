const express = require("express");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const path = require("path");
// fucking mongoose needs to resolve the property oh handelbars!!!
// you need to install handlebars/allow-prototype-access
// or try to install express-handlebars 4.5.0 or higher
const exphbrs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const app = express();
const hbs = exphbrs.create({
  defaultLayout: "main",
  extname: "hbs",

  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

const homeRouter = require("./routes/home");
const coursesRouter = require("./routes/courses");
const addRouter = require("./routes/add");
const cardRouter = require("./routes/card");
//model USER
const User = require("./models/user");

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

// middleware
app.use(async (req, res, next) => {
  try {
    const user = await User.findById("5ee14a46ebe9184240024301");
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", homeRouter);
app.use("/add", addRouter);
app.use("/courses", coursesRouter);
app.use("/card", cardRouter);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url = `mongodb+srv://user:password@cluster0-5y97q.mongodb.net/shop`;
    // remove user and password
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    //create user in system
    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: "Yura@mail.ru",
        name: "Yurii",
        cart: { items: [] },
      });
      await user.save();
    }
    app.listen(PORT, (req, res) => {
      console.log("I am running ... on", PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
