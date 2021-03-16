const http = require('http');
const mysql = require("mysql");

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write("<!DOCTYPE html><html lang='en'><body></body></html>");
    res.end('\nHello, World!\n');
});

PrintDB();

server.listen(port, hostname, () => {
console.log(`Server running at http://${hostname}:${port}/`);
});

function PrintDB()
{
    let connection = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "",
        database : "dgs_opdracht"
    });

    connection.connect(function(err) 
    {
        if (err) throw err;

        connection.query("SELECT * FROM snakehighscores", function (error, results, fields) 
        {
            if (error) throw error;

            for(let i=0;i<results.length;i++)
            {
                console.log("ID: "+results[i].id + " Name: " + results[i].name + " Score: "+results[i].score);
            }
        });

        connection.end();
    });
}