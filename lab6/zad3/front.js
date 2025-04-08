const http = require("http")

const run = async() => {
    const res = await fetch("http://backend:5000")
    const list = await res.json()
    let re = list.map(c => `id: ${c.id}, name: ${c.name}`)
    re = re.join("\n")
    http.createServer((req,res) => {
        res.write(`Message from backend:\n${re}`)
        res.end()
    }).listen(3000, () => console.log("Running frontend on 3000"))
}

run()