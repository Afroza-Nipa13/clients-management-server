require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app =express();
const port =process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterph.bwaiqag.mongodb.net/?retryWrites=true&w=majority&appName=ClusterPH`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const userCollection =client.db("userDB").collection("users")



  // user related api

  app.get('/users', async(req, res) =>{
    const users = req.body;
    const result = await userCollection.find().toArray()
    res.send(result)
  })

  app.post('/users', async(req, res)=>{
    const userProfile =req.body;
    const result = await userCollection.insertOne(userProfile)
    res.send(result)
  })

  app.patch('/users', async(req, res)=>{
    const {email,lastSignInTime} =req.body;
    const filter = { email: email}
    const docUpdate = {
      $set : {
        lastSignInTime:lastSignInTime
      }
    }
    const result = await userCollection.updateOne(filter, docUpdate)
    res.send(result)

  })

  app.delete('/users/:id', async (req, res)=>{
    const id =req.params.id;
    const query = {_id : new ObjectId(id)}
    const result = await userCollection.deleteOne(query);
    res.send(result)
  })
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res) => {
    res.send('Be happy today...YOur server is running!')
})

app.listen(port, () =>{
    console.log(`Your server is running on port : ${port}`)
})