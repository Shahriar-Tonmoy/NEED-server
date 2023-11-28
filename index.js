const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

//Need-master
//cc6vUTXcOti1eoUz

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('server is ready');
})

app.listen(port, ()=>{
    console.log('SERVER IS RUNNING!!', port);  
})


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.irep6x0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const database = client.db("jobsDB");
const jobsCollection = database.collection("jobs");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //get api
    app.get('/jobs', async (req, res) =>{
        const cursor = jobsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

    //create data or insert a data to database
    app.post("/jobs", async (req, res) => {
        console.log(req.body);
        const newJob = req.body;
        const result = await jobsCollection.insertOne(newJob);
        res.send(result);
        console.log(result);       
    });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);
