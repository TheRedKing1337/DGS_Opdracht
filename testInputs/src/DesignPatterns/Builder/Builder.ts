export class ApartmentBuilder
{
    public BuildStudio() : Apartment
    {
        let studio = new Apartment(500);
        let bedroom = new Bedroom(4,3);
        bedroom.AddWindow(0.8,1,true);
        let livingRoom = new LivingRoom(4,3);
        livingRoom.AddWindow(0.8,1,false);
        livingRoom.AddWindow(0.8,1,true);

        studio.AddRoom(bedroom);
        studio.AddRoom(livingRoom);

        return studio;
    }    
    public BuildPenthouse(): Apartment
    {
        let penthouse = new Apartment(500);
        let bedroom = new Bedroom(8,5);
        bedroom.AddWindow(2,1,true);
        bedroom.AddWindow(2,1,true);
        bedroom.AddWindow(2,1,true);
        let livingRoom = new LivingRoom(6,12);
        livingRoom.AddWindow(1.5,1,false);
        livingRoom.AddWindow(1.5,1,true);
        let kitchen = new Kitchen(6,12);
        kitchen.AddWindow(1.5,1,false);
        kitchen.AddWindow(1.5,1,false);
        kitchen.AddWindow(1.5,1,false);

        penthouse.AddRoom(bedroom);
        penthouse.AddRoom(livingRoom);
        penthouse.AddRoom(kitchen);

        return penthouse;
    }
}
export class Apartment
{
    rooms : Room[] = [];
    cost : number;

    constructor(cost : number)
    {
        this.cost = cost;
    }

    public AddRoom(room : Room) : void
    {
        this.rooms.push(room);
    }
    public GetSize() : number
    {
        let size : number = 0;
        for(let i=0;i<this.rooms.length;i++)
        {
            size += this.rooms[i].GetSize();
        }
        return size;
    }
}
abstract class Room
{
    width : number;
    length : number;
    windows : RoomWindow[] = [];

    public constructor(width : number, length : number)
    {
        this.width = width;
        this.length = length;
    }

    public AddWindow(width : number, height : number, canOpen : boolean) : void
    {
        this.windows.push(new RoomWindow (width, height, canOpen));
    }
    public GetSize() : number
    {
        return this.width * this.length;
    }
}
class Bedroom extends Room
{

}
class LivingRoom extends Room
{

}
class Kitchen extends Room
{

}
class RoomWindow
{
    width : number;
    height : number;
    canOpen : boolean;

    public constructor(width : number, height : number, canOpen : boolean)
    {
        this.width = width;
        this.height = height;
        this.canOpen = canOpen;
    }
}