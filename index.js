const express = require("express");
require("dotenv").config();
const csrf = require("csurf");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const Handlebars = require("handlebars");
const path = require("path");
const errorHandler = require("./middleware/error");
const fileMiddleware = require("./middleware/file");
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
  helpers: require("./utils/hbs-helpers"),
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
const profileRouter = require("./routes/profile");

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
//check image for avatar
app.use(fileMiddleware.single("avatar"));
app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);
app.use("/", homeRouter);
app.use("/add", addRouter);
app.use("/courses", coursesRouter);
app.use("/card", cardRouter);
app.use("/orders", ordersRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
// error 404 page
app.use(errorHandler);

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

    app.listen(PORT, (req, res) => {
      console.log("I am running ... on", PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
