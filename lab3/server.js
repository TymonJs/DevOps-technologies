const http = require("http")

http.createServer((req,res) => {
    res.end("Hello node")
}).listen(3000, () => console.log("Running at 3000"))