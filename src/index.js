const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const moment = require("handlebars.moment");
const { database } = require("./keys");

//initializations
const app = express();

//settings
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars")
  })
);
app.set("view engine", ".hbs");

//Middlewares
app.use(
  session({
    secret: "sedcamrecursoshumanos",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  })
);
app.use(flash());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Global Variables
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  next();
});

//Routes
app.use(require("./routes"));
app.use(require("./routes/authentication"));
app.use("/direcciones", require("./routes/direcciones"));
app.use("/unidades", require("./routes/unidades"));
app.use("/personas", require("./routes/personas"));
app.use("/tipo_memos", require("./routes/tipo_memos"));
app.use("/memos", require("./routes/memos"));
app.use("/niveles", require("./routes/niveles"));
app.use("/requisitos", require("./routes/requisitos"));

//Public
app.use(express.static(path.join(__dirname, "public")));

//Starting the Server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
