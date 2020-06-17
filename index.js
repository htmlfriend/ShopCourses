const express = require("express");
require("dotenv").config();
const csrf = require("csurf");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const Handlebars = require("handlebars");
const path = require("path");
const keys = require("./keys");
// fucking mongoose needs to resolve the property oh handelbars!!!
// you need to install handlebars/allow-prototype-access
// or try to install express-handlebars 4.5.0 or higher
const exphbrs = require("express-handlebars");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const app = express();
const hbs = exphbrs.create({
  defaultLayout: "main",
  extname: "hbs",

  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

const store = new MongoStore({
  collection: "sessions",
  uri: keys.MONGODB_URI,
});

const homeRouter = require("./routes/home");
const coursesRouter = require("./routes/courses");
const addRouter = require("./routes/add");
const cardRouter = require("./routes/card");
const ordersRouter = require("./routes/orders");
const authRouter = require("./routes/auth");

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

// middleware
// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById("5ee14a46ebe9184240024301");
//     req.user = user;
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);
app.use("/", homeRouter);
app.use("/add", addRouter);
app.use("/courses", coursesRouter);
app.use("/card", cardRouter);
app.use("/orders", ordersRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // const url = `mongodb+srv://user:password@cluster0-5y97q.mongodb.net/shop`;
    // remove user and password
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    //create user in system
    // const candidate = await User.findOne();
    // if (!candidate) {
    //   const user = new User({
    //     email: "Yura@mail.ru",
    //     name: "Yurii",
    //     cart: { items: [] },
    //   });
    //   await user.save();
    // }
    app.listen(PORT, (req, res) => {
      console.log("I am running ... on", PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
