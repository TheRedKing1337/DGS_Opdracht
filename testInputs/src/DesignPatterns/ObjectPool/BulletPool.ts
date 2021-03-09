import { Bullet } from "../ObjectPool/Bullet";

export class BulletPool
{
    //Singleton implementation
    private static instance : BulletPool;
    public constructor()
    {
        if(BulletPool.instance)
        {
            throw new Error("Dont create new instances of this class, use GetInstance instead");
        }
        BulletPool.instance = this;
    }
    public static GetInstance() 
    {
        return this.instance || (this.instance = new this())
    } 

    //The array that stores the pooled objects
    private pool: Bullet[] = [];

    //Returns a bullet from the pool
    public GetFromPool() : Bullet
    {
        //If there are no bullets in the pool add new ones, which is done in chunks of 5 in this case
        if(this.pool.length == 0)
        {
            this.AddToPool(5);
        }
        //Return the pooled object, user of pool will then have to set position/damage etc
        return this.pool.pop() as Bullet;
    }
    //Called when the bullet needs to dissapear, and returns it to the pool
    public ReturnToPool(toReturn : Bullet)
    {
        //some code to make object inactive/invisible

        this.pool.push(toReturn);
    }
    //Adds new bullets to pool when needed
    private AddToPool(amount:number)
    {
        let newBullet : Bullet
        for(let i=0;i<amount;i++)
        {
            newBullet = new Bullet(0);
            this.pool.push(newBullet);
        }
    }
}