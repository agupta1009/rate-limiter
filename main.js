const express=require("express")
const path=require("path")
const app=express()




// Initialize an object to store request counts for different routes
const routeRequestCounts = {};

// Da middle thing to have the request count for different ips
app.use((req, res, next) => {
    const ip=req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress
  if (!routeRequestCounts[ip]) {
    routeRequestCounts[ip] = 1; // Initialize count if not already present
  }else{
    routeRequestCounts[ip]++;
  }
  if(routeRequestCounts[ip]>20){
    console.log("number of allowed call exceeded")
    return res.status(429).json({
        message:"number of allowed api calls exceeded. \n Allowed calls: 20 \n Current Calls: " + routeRequestCounts[ip]
    })

  }
  next();
});

// api routes 
app.get('/api1', async (req, res) => {
    const ip=req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress
    console.log(ip)
    res.status(200).json({
        "calls":routeRequestCounts[ip],
        "message":"this is your api1"
    })
  });

  app.get('/api2', async (req, res) => {
  const ip=req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress
  console.log(ip)
  res.status(200).json({
      "calls":routeRequestCounts[ip],
      "message":"this is your api2"
  })
});



// server port
app.listen(8000,function(){
    console.log("server started at port 8000")
})