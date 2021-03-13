//Using a finite state machine to handle input and the state of the player in a clear way
//Makes it easier to have many different states which have unique behaviour
export class PlayerInput
{
    //stores the state of the player
    state : PlayerState = PlayerState.STANDING;

    public HandleInput(input : Input) : void
    {
        switch (this.state)
        {
            case PlayerState.STANDING :
                if(input == Input.PRESS_UP_ARROW) //Jump if press up
                {
                    console.log("Jumped");
                    this.state = PlayerState.JUMPING;
                    //Add velocity up
                    //Set sprite to jump
                } 
                else if(input == Input.PRESS_DOWN_ARROW) //Crouch if press down
                {
                    console.log("Ducked");
                    this.state = PlayerState.DUCKING;
                    //Set sprite to ducking
                }
                break;
            case PlayerState.JUMPING : 
                if(input == Input.PRESS_DOWN_ARROW) //Ground pound if press down while jump
                {
                    console.log("Ground pound");
                    this.state = PlayerState.DIVING;
                    //Set sprite to ground pound
                }
                break;
            case PlayerState.DUCKING : 
                if(input == Input.RELEASE_DOWN_ARROW) //Stand up if arrow released
                {
                    console.log("Standing up");
                    this.state = PlayerState.STANDING;
                    //Set sprite to standing
                }
                break;
        }
    }
}
//represents the state the player is in
enum PlayerState
{
    STANDING,DUCKING,JUMPING,DIVING
}
//represents some of the inputs the player can receive
export enum Input
{
    PRESS_DOWN_ARROW, RELEASE_DOWN_ARROW, PRESS_UP_ARROW
}