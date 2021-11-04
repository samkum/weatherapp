const http = require('http');

const fs = require('fs');

const requests = require('requests');

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempval, orgval) =>{
    let temp = tempval.replace("{%tempreature%}", Math.round(orgval.main.temp - 273.15));
    temp = temp.replace("{%tempreaturemin%}", Math.round(orgval.main.temp_min - 273.15));
    temp = temp.replace("{%tempreaturemax%}", Math.round(orgval.main.temp_max - 273.15));
    temp = temp.replace("{%location%}", orgval.name);
    temp = temp.replace("{%tempstatus%}", orgval.weather[0].main);
    console.log(orgval.weather[0]);
    return temp;
}

const server = http.createServer((req, res)=>{

    if (req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=paris&appid=a5c4487198d3ec9e945c8e27123aca19"
        ).on("data", (chunk)=>{
            const obj = JSON.parse(chunk);
            const arr = [obj];
            console.log(arr);
            const realTimeData = arr.map((val)=> replaceVal(homeFile, val)).join("");
            res.write(realTimeData);
        })
        .on("end", (err)=>{
            if (err) return console.log(err);
            res.end();
        })
    }

});

server.listen(8000, "127.0.0.1");