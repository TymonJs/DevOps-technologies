const express = require("express")
const app = express()
const { createClient } = require("redis")
app.use(express.json())


const redisClient = createClient({
    url: 'redis://redis:6379'
})

redisClient.on("error", err => console.error(err))
redisClient.connect().then(() => console.log("Connected to Redis"))

app.post("/home", async (req,res) => {
    const {key ,value} = req.body

    try{
        await redisClient.set(key,value)
        res.send(`Saved: ${key}: ${value}`)
    }
    catch{
        res.status(500).send("Error saving the data")
    }
})
app.get("/home/:key", async (req,res) => {
    const {key} = req.params

    try{
        const value = await redisClient.get(key)
        res.send(value? value: "Key not found")
    }
    catch{
        res.status(500).send("Error fetchning the data")
    }
})

app.listen("3000", () => console.log("Running on 3000"))