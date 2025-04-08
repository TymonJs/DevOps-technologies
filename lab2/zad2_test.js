fetch("http://localhost:8080").then(r => 
    r.json().then(res => {

        const date = new Date();
        const obj = {
            year: date.getFullYear(),
            month: date.getMonth()+1,
            day: date.getDate(),
            hour: date.getHours()
        }
        
        const check = Object.keys(res).every(key => {
            return res[key] == obj[key]
        })

        if (check) console.log("Test przeszedł")
        else console.log("Test nie przeszedł")
        
    })
)