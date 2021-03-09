import { BulletPool } from "../ObjectPool/BulletPool";

export class Bullet
{
    private damage : number;

    public constructor(damage:number)
    {
        this.damage = damage;
    }

    public SetDamage(damage:number)
    {
        this.damage = damage;
    }

    public OnHit()
    {
        //Do damage via interface 

        //Return to the object pool
        BulletPool.GetInstance().ReturnToPool(this);
    }
}