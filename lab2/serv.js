const express = require("express")
const app = express()
const mongoose = require("mongoose")

mongoose.connect("mongodb://mongo:27017/mydb",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection

db.on("open",() => console.log("Connected with MongoDB"))

const schema = new mongoose.Schema({name: String})
const Model = mongoose.model("Test",schema)

app.get("/", async (req,res) => {
    const data = await Model.find()
    res.json(data)
})

app.listen(8080, () => console.log("Running on 8080"))