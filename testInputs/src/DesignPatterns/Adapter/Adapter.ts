import * as mysql from "mysql";

export class HighscoreData
{
    id : number;
    name : string;
    score : number;
    public constructor(id : number,name : string,score : number)
    {
        this.id = id;
        this.name = name;
        this.score = score;
    }
}
export interface IDatabaseAdapter
{
    GetHighscores() : HighscoreData[];
}
export class DatabaseAdapter implements IDatabaseAdapter
{
    databaseHandler : DatabaseHandler;
    public constructor()
    {
        this.databaseHandler = new DatabaseHandler();
    }
    GetHighscores() : HighscoreData[]
    {
        let results = this.databaseHandler.GetHighscores();
        results.forEach(element => {
            console.log(element.result[0]);
        });
        return [new HighscoreData(0,"",0)];
    }
}
class DatabaseHandler
{
    public GetHighscores() : any
    {
        let connection = this.GetConnection();

        connection.query("SELECT * FROM snakehighscores AS result", function (error, results, fields) {
            if (error) throw error;
            return results
          });
    }
    private GetConnection() : mysql.Connection
    {
        let connection = mysql.createConnection({
            host : "localhost",
            user : "root",
            password : "",
            database : "dgs_opdracht"
        });
    
        connection.connect();

        return connection;
    }
}