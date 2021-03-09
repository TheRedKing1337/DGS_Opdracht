export class WorldBuilder
{
    //Stores the strategy which the class is using
    private activeStrategy : HeightmapInterface;

    //assigns the strategy
    public constructor(strategyToUse : HeightmapInterface)
    {
        this.activeStrategy = strategyToUse;
    }

    public ChangeStrategy(strategyToUse : HeightmapInterface)
    {
        this.activeStrategy = strategyToUse; 
    }

    public BuildWorld()
    {
        //Uses the strategy to get a result
        let heightmap = this.activeStrategy.GetHeightmap();

        return heightmap;

        //do stuff with heightmap
    }
}