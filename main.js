const express = require("express")
const app = express()
const TimedMap = require('./TimedMap');


// Initialize an object aka self expirinng hash map to store request api count
const routeRequestCounts = new TimedMap(60 * 1000);

// this is the middle thing aka middleware to have the request count for different ip's
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress
  if (!routeRequestCounts.get(ip)) {
    routeRequestCounts.set(ip,1); // Initialize count if not already present
  }else{
    routeRequestCounts.set(ip, 1 + routeRequestCounts.get(ip));
  }
  if(routeRequestCounts.get(ip)>20){
    console.log("number of allowed call exceeded")
    return res.status(429).json({
        message:"number of allowed api calls exceeded. Allowed calls: 20 Current Calls: " + routeRequestCounts.get(ip)
    })

  }
  next();
});

// api routes 

// api 1
app.get('/api1', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress
    console.log(ip)
    res.status(200).json({
        "calls":routeRequestCounts.get(ip),
        "message":"this is your api1"
    })
  });


// api 2
  app.get('/api2', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress
  console.log(ip)
  res.status(200).json({
      "calls":routeRequestCounts.get(ip),
      "message":"this is your api2"
  })
});


// server port
app.listen(8000,function(){
    console.log("server started at port 8000")
})