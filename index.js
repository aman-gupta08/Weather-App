const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    // temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    const icon = orgVal.weather[0].icon;
    const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    temperature = temperature.replace("{%icon%}", imageURL);
    temperature = temperature.replace("{%description%}", orgVal.weather[0].description);

    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Jalandhar,IN&units=metric&appid=01bf985e0e674d24ca07bef2e88351b2')
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                // console.log(arrData[0].main.temp);
                const realTimeData = arrData
                .map((val) => replaceVal(homeFile, val))
                .join("");

                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);

                // console.log('end');
                res.end();
            });
    }
    else {
        res.write("<h1>404: Page Not Found</h1>");
        res.end();
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("server is running on port 8000");
});