export class ShapeDrawer
{
    public DrawSqaure(size : number) : IShape
    {
        let square = new Square();
        square.Draw(size);
        return square;
    }
    public DrawCircle(size : number) : IShape
    {
        let circle = new Circle();
        circle.Draw(size);
        return circle;
    }
    public DrawTriangle(size : number) : IShape
    {
        let triangle = new Triangle();
        triangle.Draw(size);
        return triangle;
    }
}
export interface IShape
{
    size : number;
    Draw(size : number) : void;
    Resize(size : number) : void;
}
class Square implements IShape 
{
    size : number = 0;
    public Draw(size : number) : void
    {
        this.size = size;
        console.log("Drawing Sqaure of size: "+size);
    }
    public Resize(size : number) : void
    {
        this.size = size;
    }
}
class Circle implements IShape
{
    size : number = 0;
    public Draw(size : number) : void
    {
        console.log("Drawing Circle of size: "+size);
    }
    public Resize(size : number) : void
    {
        this.size = size;
    }
}
class Triangle implements IShape
{
    size : number = 0;
    public Draw(size : number) : void
    {
        console.log("Drawing Triangle of size: "+size);
    }
    public Resize(size : number) : void
    {
        this.size = size;
    }
}