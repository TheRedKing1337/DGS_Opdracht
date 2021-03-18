var mysql = require('mysql');

let connection = mysql.createConnection({
  host : "localhost",
  user : "root",
  password : "",
  database : "dgs_opdracht"
});

var highscores;

connection.connect(function(err) 
{
  if (err) throw err;

  connection.query("SELECT * FROM snakehighscores", function (error, results, fields) 
  {
      if (error) throw error;
      highscores = results;
      for(let i=0;i<results.length;i++)
      {
          console.log("ID: "+results[i].id + " Name: " + results[i].name + " Score: "+results[i].score);
      }
  });

  connection.end();
});

console.log(highscores);
