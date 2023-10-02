const express=require("express")
const app=express()


// api routes 
app.get('/api1', (req, res) => {
    res.status(200).json({
        "success":"true",
        "message":"this is your api 1"
    })
  });



// server port
app.listen(8000,function(){
    console.log("server started at port 8000")
})