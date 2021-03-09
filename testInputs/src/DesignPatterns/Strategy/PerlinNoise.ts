export class PerlinNoise implements HeightmapInterface
{
    public GetHeightmap() : number[]
    {
        //make perlin noise heightmap
        let heightmap : number[] = [1,2,3,4,5];
        return heightmap;
    }
}