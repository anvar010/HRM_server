const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes')
const connect = require('./db/config')
let dotenv = require('dotenv');
dotenv.config();

app.use(express.json())

const port = process.env.PORT;

app.get('/',(req,res)=>{
    res.status(200).send("Test API");
});

app.use(express.json())
app.use(authRoutes);

app.use(express.urlencoded({extended : false}));

connect();

app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`)
  });
