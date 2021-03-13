//This observer example shows how the observer design pattern can be used to create an achievement system without linking everything in the same script
class Subject
{
    observers : Observer[] = [];
    public AddObserver(observer : Observer) : void
    {
        this.observers.push(observer);
    }
    public RemoveObserver(observer : Observer) : void
    {
        for(let i=0;i<this.observers.length;i++)
        {
            if(this.observers[i] == observer)
            {
                this.observers.splice(i);
                return;
            }
        }
    }
    public Notify(event : Event) : void
    {
        this.observers.forEach(element => {
            element.OnNotify(event);
        });
    }
}
export class Player extends Subject
{
    public Die() : void
    {
        this.Notify(Event.PLAYER_DIE);
    }
    public KilledEnemy() : void
    {
        this.Notify(Event.PLAYER_KILL);
    }
}
abstract class Observer
{
    protected subject : Subject;
    public OnNotify(event : Event) : void{}
}
enum Event
{
    PLAYER_DIE, PLAYER_KILL
}
export class Achievements extends Observer
{
    deaths : number = 0;
    kills : number = 0;
    public OnNotify(event : Event) : void
    {
        switch(event)
        {
            case Event.PLAYER_DIE : 
                this.deaths++;
                if(this.deaths == 10)
                {
                    //Unlock achievement Die 10 times
                    console.log("ACHIEVEMENT GET: DIE 10 TIMES");
                }
                break;
                //etc
            case Event.PLAYER_KILL : 
                this.kills++;
                if(this.kills == 15)
                {
                    //Unlock achievement
                    console.log("ACHIEVEMENT GET: DESTROY 15 ENEMIES");
                }
                break;
            //etc
        }
    }
}