// App Setup
require("dotenv").config();
const { app, server } = require("./Socket/index");

const express = require("express");
const cors = require("cors");
const ExpressError = require("./Util/ExpressError");
const userRouter = require("./Routes/user");
const meetingRouter = require("./Routes/meeting");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const User = require("./Models/userSchema");
const LocalStrategy = require("passport-local").Strategy;

app.set('trust proxy', 1); // Trust proxy in production (like Heroku or Nginx)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const dbUrl = process.env.DBURL;

// CORS Configuration
app.use(
  cors({
    origin:process.env.FRONTENDURL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

// MongoDB Connection
async function main() {
  await mongoose.connect(dbUrl);
}

main().then(() => {
  console.log("Connected to the database");
}).catch((err) => {
  console.log("Error connecting to database:", err);
});

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// MongoStore Configuration for Sessions
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || "defaultsecret", // Ensure this secret is set correctly
  },
  touchAfter: 24 * 3600, // Session update only once per 24 hours
});

store.on("error", (err) => {
  console.error("Error in Mongo session store:", err);
});

// Session Middleware
const sessionOptions = {
  store,
  secret: process.env.SECRET || "defaultsecret",  // Ensure this secret is set correctly
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiration
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days maxAge
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure cookies in production
    sameSite: 'None', // Important for cross-site requests
  },
};

// Passport Initialization
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Logging session and user for debugging
app.use((req, res, next) => {
  console.log('Session:', req.session); // Log session data
  console.log('User:', req.user); // Log user data
  res.locals.currUser = req.user;
  next();
});

// Root route
app.get("/", (req, res, next) => {
  console.log("This is req.user", req.user);
  res.send("Root route");
});

// User and Meeting Routes
app.use("/CareerBridge/user", userRouter);
app.use("/user/meetings", meetingRouter);

// Catch-All Route for 404 Errors
app.use("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).json({ message, error: true });
});

// Server Listener
server.listen(8080, () => {
  console.log("App is listening on port 8080");
});
