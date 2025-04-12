const express = require("express")
const app = express()
app.use(express.json())

const { createClient } = require("redis")
const { Pool } = require("pg")

const redisClient = createClient({
    url: 'redis://redis:6379'
})

redisClient.on("error", err => console.error(err))
redisClient.connect().then(() => console.log("Connected to Redis"))

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: 5432
})

const postgresInit = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT
        );
    `);
}
postgresInit()

app.post("/redis", async (req,res) => {
    const {key ,value} = req.body

    try{
        await redisClient.set(key,value)
        res.send(`Saved: ${key}: ${value}`)
    }
    catch{
        res.status(500).send("Error saving the data")
    }
})
app.get("/redis/:key", async (req,res) => {
    const {key} = req.params

    try{
        const value = await redisClient.get(key)
        res.send(value? value: "Key not found")
    }
    catch{
        res.status(500).send("Error fetchning the data")
    }
})

app.post("/postgres", async (req,res) => {
    try{
        const { name } = req.body
        const result = await pool.query(`INSERT INTO users(name) VALUES($1) RETURNING *`,[name])
        res.status(201).json(result.rows[0])
    } catch (e){
        res.status(500).send(`Error from postgres ${e.message}`)
    }
})

app.listen("3000", () => console.log("Running on 3000"))