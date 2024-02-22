import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./dirname.js";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import config from "./config/config.js";

// Vistas
import viewsRoutes from "./routes/views.routes.js";
import githubLoginViewRouter from "./routes/github-login.views.js"
import usersViewRouter from './routes/users.views.router.js';
import productsViewRouter from "./routes/product.views.router.js"

// Apis
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import jwtRouter from './routes/jwt.router.js'

// Custom Extended
import UsersExtendRouter from './routes/custom/users.extend.router.js'

// Passport imports
import passport from 'passport';
import initializePassport from './config/passport.config.js'

// Esto sirve para recorrer arrays en handlebars
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

const app = express();

const MONGO_URL = "mongodb://127.0.0.1:27017/coderhouse";

// Mongo Local
// mongoose.set("strictQuery", true);
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// Configuración de Handlebars
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

//Cookies
//router.use(cookieParser());
app.use(cookieParser("CoderS3cr3tC0d3"));

// Middleware de passport
initializePassport();
app.use(passport.initialize());
// app.use(passport.session());

// Configuracion de Express
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", viewsRoutes);
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/productos", productsRouter)
app.use("/carritos", cartsRouter)
app.use("/agregar-productos", productsViewRouter)
app.use("/github", githubLoginViewRouter)
app.use("/api/jwt", jwtRouter)
app.use('/users', usersViewRouter)

const usersExtendRouter = new UsersExtendRouter();
app.use("/api/extend/users", usersExtendRouter.getRouter());

console.log(config);


const SERVER_PORT = config.port;

app.listen(SERVER_PORT, console.log(`Server running on port ${SERVER_PORT}` ));