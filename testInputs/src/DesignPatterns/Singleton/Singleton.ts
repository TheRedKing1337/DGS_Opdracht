//A singleton is a class type that makes sure only 1 of its type exists, I implemented this into the BulletPool class
class Singleton
{
    //The stored class instance
    private static instance : Singleton;

    //In the constructor check if it already exists
    public constructor()
    {
        if(Singleton.instance)
        {
            throw new Error("Dont create new instances of this class, use GetInstance instead");
        }
        Singleton.instance = this;
    }
    //Returns the class instance if it exists, else it creates a new one
    public static GetInstance() 
    {
        return this.instance || (this.instance = new this())
    } 
}