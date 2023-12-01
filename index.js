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
    res.send('NEED server is ready');
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
const bidJobsCollection = database.collection("bidJobs");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //get api
    //get some data  
    app.get('/bidJobs', async (req, res) =>{
        console.log(req.query.email);
        let query = {};
        if (req.query?.buyerEmail) {
            query = { buyerEmail: req.query.buyerEmail };
          } else if (req.query?.email) {
            query = { email: req.query.email };
          }

        const cursor = bidJobsCollection.find(query).sort( { status: 1 } );
        const result = await cursor.toArray();
        res.send(result);
      })
    
    
      app.get('/jobs', async (req, res) =>{
        console.log(req.query.email);
        let query = {};
        if(req.query?.email){
            query = {email: req.query.email}
        }

        const cursor = jobsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      })
    
    
    //get all data
    app.get('/jobs', async (req, res) =>{
        const cursor = jobsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

    app.get('/bidJobs', async(req, res) =>{
        
        const cursor = bidJobsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    //get one data
    app.get('/jobs/:id', async (req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const job = await jobsCollection.findOne(query);
        res.send(job);
      })

    //create data or insert a data to database
    app.post("/jobs", async (req, res) => {
        console.log(req.body);
        const newJob = req.body;
        const result = await jobsCollection.insertOne(newJob);
        res.send(result);
        console.log(result);       
    });
    app.post("/bidJobs", async (req, res) => {
        console.log(req.body);
        const newJob = req.body;
        const result = await bidJobsCollection.insertOne(newJob);
        res.send(result);
        console.log(result);       
    });

    //delete data
    app.delete('/jobs/:cid', async(req, res) => {
        const id  = req.params.cid;
        console.log(`PLEASE DELETE ID FROM DATABASE: ${id}`);
        const query = { _id: new ObjectId(id)};
        console.log(query);
        
        const result = await jobsCollection.deleteOne(query);
        res.send(result);
      })

    //api for update data
    app.patch('/bidJobs/:id', async(req, res) =>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const updateStatus = req.body;
        console.log(updateStatus);
        const updateDoc = {
            $set: {
              status: updateStatus.status
            },
          };
        const result = await bidJobsCollection.updateOne(filter, updateDoc);
        res.send(result);
    })

    app.put('/jobs/:id', async (req, res) => {
        const id = req.params.id;
        const toBeUpdatedJob = req.body;
        console.log(toBeUpdatedJob);
        const query = { _id: new ObjectId(id)};
        const options = { upsert: true };
        const updateJob = {
          $set: {
            email:toBeUpdatedJob.fEmail,
            title:toBeUpdatedJob.fJobTitle,
            deadline:toBeUpdatedJob.fDeadline,
            description:toBeUpdatedJob.fDescription,
            category:toBeUpdatedJob.fCategory,
            minimumPrice:toBeUpdatedJob.fMinimumPrice,
            maximumPrice:toBeUpdatedJob.fMaximumPrice
          }
        }
        const result = await jobsCollection.updateOne(query, updateJob, options);
        res.send(result);
      })



    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);
