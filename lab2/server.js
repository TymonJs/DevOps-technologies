const express = require("express")
const app = express()

app.get("/", (req,res) => {
    const date = new Date();
    res.send(
        JSON.stringify({
            year: date.getFullYear(),
            month: date.getMonth()+1,
            day: date.getDate(),
            hour: date.getHours()+1,
        })
    )
})

app.listen(8080, () => console.log("Running on 8080"))