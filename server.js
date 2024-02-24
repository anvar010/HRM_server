const express = require('express');
const app = express();
let dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;

app.get('/',(req,res)=>{
    res.status(200).send("Test API");
});

app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`)
  });
