import { WorldBuilder } from "./DesignPatterns/Strategy/WorldBuilder";
import { PerlinNoise } from  "./DesignPatterns/Strategy/PerlinNoise";
import { NoiseFactory} from "./DesignPatterns/Factory/NoiseFactory";
import { BulletPool } from "./DesignPatterns/ObjectPool/BulletPool";
import { ApartmentBuilder } from "~DesignPatterns/Builder/Builder";

//Creates a new WorldBuilder using Perlin noise
let wb = new WorldBuilder(new PerlinNoise());

//Builds a world
console.log(wb.BuildWorld().toString());

console.log("Strategy ran succesfully");

let noiseFactory = new NoiseFactory();
//Changes the used strategy to another type
wb.ChangeStrategy(noiseFactory.GetNoise("Voronoi"));

//Executes using the new type
console.log(wb.BuildWorld().toString());

console.log("Factory ran succesfully");



let bullet = BulletPool.GetInstance().GetFromPool();

console.log("Singleton ran succesfully");

bullet.OnHit();

console.log("Object pool ran succesfully");

let builder = new ApartmentBuilder();

let studio = builder.BuildStudio();

console.log(studio.GetSize());

console.log("Builder ran succesfully");


