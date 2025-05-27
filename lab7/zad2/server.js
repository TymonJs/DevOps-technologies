const express = require("express")
const app = express()
const cors = require("cors")
const {MongoClient} = require("mongodb")

uri = "mongodb://db:27017"
const client =  new MongoClient(uri)

app.use(cors())

app.get("/",(req,res) => {
    res.send("dziala")
})

app.get('/users', async (req, res) => {
    try {
      await client.connect();
      const db = client.db('test');
      const users = await db.collection('users').find().toArray();
      res.json(users);
    } 
    catch (err) {
      console.error(err);
      res.status(500).send('db error');
    } 
    finally {
      await client.close();
    }
  });
  
  app.listen(3000, () => {
    console.log(`Running on 3000`);
  });