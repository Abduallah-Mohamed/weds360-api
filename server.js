const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanatize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const morgan = require("morgan");
const articles = require("./routes/article");
const auth = require("./routes/auth");
const users = require("./routes/users");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const path = require("path");

// Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// morgan is a Node.js and Express middleware to log HTTP requests and errors
app.use(morgan("dev"));

// connect to the database
connectDB();

// File upload
app.use(fileupload());

// Sanatize data - prevent mongodb hacking
app.use(mongoSanatize());

// set security headers
app.use(helmet());

// Prevent user to enter script tags - xss attacks
app.use(xss());

// make user NOT to make 100 request in 10 minutes
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 1000,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Serve the static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount Routes
app.use("/api/v1/article", articles);
app.use("/api/v1", auth);
app.use("/api/v1/users", users);

// to work for specific routes it must to be below this routes because the middleware in express work in linear order.
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`App is runing on PORT ${PORT}`.blue));
