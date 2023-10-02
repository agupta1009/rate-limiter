const express = require("express");
const app = express();
const TimedMap = require("./TimedMap");
const dotenv = require("dotenv");
dotenv.config();

//  Load the config file
const rateLimitWindowSec = parseInt(process.env.RATE_LIMIT_WINDOW_SEC) || 1;
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;
const port = parseInt(process.env.port);

// Initialize an object aka self expirinng hash map to store request api count
const routeRequestCounts = new TimedMap(rateLimitWindowSec * 60 * 1000);
app.set('trust proxy', true);

// this is the middle thing aka middleware to have the request count for different ip's
app.use((req, res, next) => {
  const ip =
     req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (!routeRequestCounts.get(ip)) {
    routeRequestCounts.set(ip, 1); // Initialize count if not already present
  } else {
    routeRequestCounts.set(ip, 1 + routeRequestCounts.get(ip));
  }
  if (routeRequestCounts.get(ip) > maxRequests) {
    console.log("number of allowed call exceeded");
    return res.status(429).json({
      message:
        "number of allowed api calls exceeded. Allowed calls: " +
        maxRequests +
        " Current Calls: " +
        routeRequestCounts.get(ip),
    });
  }
  next();
});

// api routes

// api 1
app.get("/api1", async (req, res) => {
  const ip =
     req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log(ip)
  res.status(200).json({
    calls: routeRequestCounts.get(ip),
    message: "this is your api1",
  });
});

// api 2
app.get("/api2", async (req, res) => {
  const ip =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  res.status(200).json({
    calls: routeRequestCounts.get(ip),
    message: "this is your api2",
  });
});

// server port
app.listen(port, () => {
  console.log("server started at port: " + port);
});
