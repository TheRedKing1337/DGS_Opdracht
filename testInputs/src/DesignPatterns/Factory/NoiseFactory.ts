import { PerlinNoise } from "../Strategy/PerlinNoise";
import { VoronoiNoise } from "../Strategy/VoronoiNoise";

export class NoiseFactory
{
    //Returns a valid interface based in the input string, used to be able to dynamicly use interfaces instead of having to use implicit code
    public GetNoise(noise : string) : HeightmapInterface
    {
        //Changes to lowerCase to prevent input errors        
        switch(noise.toLowerCase())
        {    
            case "perlin": return new PerlinNoise();
            case "voronoi": return new VoronoiNoise();
            default : throw new Error("No valid noise type name given");
        }
    }
}