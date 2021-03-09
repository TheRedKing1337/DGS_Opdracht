export class VoronoiNoise implements HeightmapInterface
{
    public GetHeightmap() : number[]
    {
        //make perlin noise heightmap
        let heightmap : number[] = [5,4,3,2,1];
        return heightmap;
    }
}