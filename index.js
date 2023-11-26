const express = require('express')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('server is ready');
})

app.listen(port, ()=>{
    console.log('SERVER IS RUNNING!!', port);  
})