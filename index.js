const http = require("http");
const fs = require("fs");
const { XMLParser, XMLBuilder } = require("fast-xml-parser");

const host = 'localhost';
const port = 8000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        // try {
            const data = fs.readFileSync('data.xml', 'utf-8');
            const maxRate = findMaxRate(data);
            console.log(maxRate);

            const xmlBuilder = new XMLBuilder();
            const xmlStr = xmlBuilder.build({ data: { max_rate: maxRate } });

            res.writeHead(200, { 'Content-Type': 'application/xml' });
            res.end(xmlStr);
    //     } catch (err) {
    //         handleError(500, "Error reading data file", res);
    //     }
    }
});

function handleError(statusCode, message, res) {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
    res.end(message);
}

function findMaxRate(xmlData) {
    const parser = new XMLParser();
    const rates = parser.parse(xmlData)["exchange"]["currency"];

    let maxRate = 0;

    for (const rate of rates) {
        const rateValue = parseFloat(rate["rate"]);

        if (!isNaN(rateValue) && rateValue > maxRate) {
            maxRate = rateValue;
        }
    }

    return maxRate;
}

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
