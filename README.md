> [!WARNING]  
> This repository is **ARCHIVED**. <br/>
> **Multiplay Sync Component is managed as a part of [ZEPETO-Modules](https://github.com/JasperGame/zepeto-modules)**.

# Multiplay Sync Component (for ZepetoWorld)

[English](./README.md) | [Korean](./README_KR.md)

## Overview    [[Youtube]](https://youtu.be/lgO840Gzhx4) 
![ezgif com-gif-maker (29)](https://user-images.githubusercontent.com/123578202/215658329-b828b2d9-b17d-4c3d-9e08-34104b2b68da.gif)

- ZEPETO Multiplay Component is a component that makes it easy to synchronize players and objects when implementing ZEPETO Multiplay. 
- In the form of a component, it is attached to an object to be synchronized and used, and multiplayer can be implemented without coding 
   - Object Transform (position, rotation, size) synchronization.
   - Dynamically create and destroy objects in multiplayer environments.
   - Synchronizes ZEPETO character's gestures and all actions, and calculates a smoother and more accurate position.
   - Provides DOTween function to set object movement pattern.
   - It includes several sample codes including moving blocks and save points that are frequently used as ZEPETO World content.
   - You can create real-time genre worlds by calculating network delays.
#### Sample not calculated network delay (it looks like different players came in first due to network delay)
![ezgif com-gif-maker (26)](https://user-images.githubusercontent.com/123578202/214829726-80b13631-2b6d-4c2a-91dc-499b46ee3e2d.gif)

#### Sample calculated network delay (Network delay is calculated so that both players appear to be moving in real time).
![ezgif com-gif-maker (27)](https://user-images.githubusercontent.com/123578202/214829782-9f3f3a5a-f493-4eba-b659-ad166f687bef.gif)

- **Dependency**
   - Unity 2020.3.9f1
   - Available from World 1.8.0 and later.
   - Based on Character Controller V2.
   - Be careful when merging with an existing project. Please apply by referring to the guide specified in the ReadMe.

## How to play the Demo Scene?
1. Download ZEPETO Multiplay Component through zip download or git clone
2. Open the project in Unity. 
3. Select Assets > Scene > Demo scene. 
4. After turning on the multiplayer server, do a QR build and experience the multiplayer test yourself. 
   - Note: In File - BuildSettings, the scene you want to test play must be at the top so you can check it immediately after building the QR. 
 <img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/214825259-6e6e6ace-f9b1-4ed7-948b-bb39ae9b3d3d.png">

## Easy Start Guide
It can be easily adapted to your existing multiplayer project or a new one!   
When merging with an existing project, proceed from step 1 of the guide below, and from step 2 when starting from this project. [Youtube](https://youtu.be/kxEb1SIQCZo)   

1. Merge with an existing project.   
   a. Back up your existing project first.   
   b. Copy the entire ZepetoScripts/MultiplaySync folder and add it to your existing project.   
   c. Add the following to your Multiplayer Schemas.(Type SchemaTypes first and type Room State.)
   ![image](https://user-images.githubusercontent.com/123578202/215644692-fa10e5bf-b778-4832-b273-b51acafbae84.png)

   > c-tip. If you don't have a server schema that you've created or not, [it's easier to use it](https://github.com/JasperGame/zepeto-world-sync-component/blob/main/Assets/World.multiplay/schemas.json) by opening schema with an editor and use it.
   
   d. Remove the script that creates and controls the ZEPETO character (ClientStarterV2 script or CreatePlayerWithUserId corresponds to this.)  
   e. Paste the multiplay server code by referring to /Assets/World.multiplay/index.ts in the sample. (Remove the existing character synchronization code and write it) 
2. Settings   
   a. Add the /Assets/ZepetoScripts/MultiplaySync/Common/MultiplayManager.ts script to the object you added the Zepeto World Multiplay component to   
   <img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/215644857-a1d73df3-cdb4-453b-9470-fbab85b30932.png">
   
3. ZEPETO Player Synchronization    
   a. ZEPETO -> Add ZepetoPlayers. (The first spawn location of the Zepeto character is the location of the ZepetoPlayers game object.)   
   b. Add the /Assets/ZepetoScripts/MultiplaySync/Player/ZepetoPlayersManager.ts script to the ZepetoPlayers component.    
   c. If there is no land, add Hireachy -> 3D Object -> Plane and change the position to 0,0,0 and scale to 10,1,10 to create the land.    
   d. After building the QR, press play to see if each character is synchronized.       
   <img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/214825381-6551bd7b-a41a-41a6-bbdf-0f8c4bfb2cbb.png">
   
4. Object synchronization.  
   a. Add /Assets/ZepetoScripts/MultiplaySync/Transform/TransformSyncHelper.ts to the game object to sync.   
   b. Change the UpdateOwner type to master and connect to the editor with your mobile phone after building.   
   c. Try moving the object in the editor's scene window and see if it moves the same on your phone.   
   d. Attach your own defined movement script to the object or use the sample code.      
   <img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/214827049-f3f7f617-cc3d-4cb1-99d3-b1d41d38285c.png">

5. Synchronize path moving objects    
   a. Add /Assets/ZepetoScripts/MultiplaySync/DOTween/DOTweenSyncHelper.ts to the block you want to sync routed movement to.   
   b. Enter two or more localPosition coordinates to move back and forth.   
   c. Add the BlockPacking.ts code in the sample code to make the ZEPETO character on the block move with it when the block moves.   
   d. After building the QR, check the operation.    
   <img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/214827072-41f62033-c8d0-4164-a4d9-a7cd2a6ab789.png">


## Project Configuration
- Asset/Scene/MultiplaySync
   - Demo : This is an example including all multiplayer sample scripts.
   - DemoRunningGame : This is an example of a ZEPETO character running game. You can compare the application of extrapolation when synchronizing.
   - DemoMovingBlock : This is an example of a ZEPETO jump map. Implement a simple jump map using the DOTween, BlockPacking, SavePoint, and FallChecking scripts.
   - DOTween : This is an example of comparing and simulating synchronization with server delay and extrapolation between two objects moving along a given path
   - PlayerSync : This is an example of synchronizing player movement speed and gestures. 
   - TransformSync: This is an example of simulating various values applied to object synchronization.  
- Asset/Resources   
   - Gesture files used for synchronization and prefabs to be created with Instantiate must be added to the Resources folder. 
- Assets/ZepetoScript/MultiplaySync
   - Common
      - MultiplayManager.ts
         - Instantiate(prefabName : string, ownerSessionId? : string, position?: Vector3, rotation?: Quaternion)
         - Destroy(DestroyObject : GameObject)
      - SyncIndexManager.ts
   - DOTween
      - DOTWeenSyncHelper.ts
         - isMasterClient : boolean
         - Id :string
   - Player 
      - PlayerSync.ts
         - isLocal :boolean
         - zepetoPlayer :ZepetoPlayer
      - ZepetoPlayersManager.ts
         - CreateAllPlayers() :void
   - Transform
      - TransformSyncHelper.ts.  
         - ChangeOwner(ownerSessionId :string) :void
         - ForceTarget() :void
         - isOwner :boolean
         - Id :string
   - SampleCode: This is a sample code of frequently used functions when implementing ZEPETO World. 
      - BlockPacking.ts: Moving blocks and characters together 
      - SavePoint.ts : Specifies character respawn location 
      - FallChecking.ts : Teleports you to the respawn point if you fall 
      - AdditionalSpeed.ts : Floor trigger movement speed increase and decrease 
      - SoccerBall.ts : Multiplayer Soccer Ball 
      - CoinAcquire.ts : Trigger Coin Acquisition 
      - GestureTrigger.ts : Play floor trigger gestures 
      - GhostMove.ts: AI NPCs that move randomly 
      - InstantiateGhost.ts : instantiate ghost when trigger is hit 
      - ScaleUpBalloon: Increase and decrease trigger balloon size 

## Properties Description
### TransformSyncHelper
 <img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/214825279-b9de45ab-c6b7-4ddf-90ba-2ee020664952.png">
 
- TransformSyncHelper needs to think about what kind of script-like movement the moving subject causes. There is no one option that is always the answer to this. For objects moving at a constant speed with a known speed, it is more accurate to interpolate by specifying the speed, and if the speed is fast and the object is important enough to interpolate the network delay, it is recommended to adopt the Extrapolation option.
   - For detailed usage, check how to set the properties for each object in the demo sample.
   - See the TransformSync sample for an example of the differences between TransformSyncHelper properties.
<br>

- UpdateOwner : It is a type property that determines who updates the object. (Runtime cannot be changed.) 
   - Master : The first player to enter will update. .
      - This includes AI NPCs and randomly moving landmarks. When that player leaves, the next player to enter takes over as Master. 
   - Undefine : There is no first owner, and the person to be updated is determined by the ChangeOwner(OwnerSessionId) method. 
      - This is the case when a person who kicks like a soccer ball becomes the owner and changes, or when a specific player updates like a pet. 
<br>

- SyncPositon : A property that synchronizes the position of that object. (Runtime cannot be changed.) 
- Use Hard Snap : This property handles teleportation when the newly received position is further away from your position by Hard Snap If Distance Greater Than. 
- PositionInterpolationType : This is a type property that smoothly interpolates between the previous received position and the new received position. 
   - None : Every time it is updated with the newly received position value, it is teleported. Use for objects that teleport without interpolation. 
   - lerp : Interpolate with Vector3.Lerp based on the given velocity. 
   - MoveToward : Interpolates with Vector3.MoveTowards based on the given velocity. This is the best calculation method given the exact speed. 
   - Estimate : Interpolates at the rate of time from the current position to the newly received position. This is the best calculation method for ever-changing velocities. 
- PositionExtrapolationType : Extrapolation of network delay. Extrapolation is a method of obtaining the direction and speed based on the past and current received positions and adding them to the next destination as an offset value. It is used when positional values are important, such as real-time running games and physics objects. 
   - Disable : No extrapolation is used. 
   - FixedSpeed : Predict based on given speed. This is the best calculation method given the exact speed. 
   - Estimate : When there is no given speed, the distance is obtained by estimating the speed based on the received position value. 
- ExtraMultipler : The multiplier for the extrapolated value. (Default: 1) If you do not use extrapolation, you do not need to enter. 
- MoveSpeed : The object's movement speed. No input is required if None is selected for PositionInterpolationType. 
<br>

- SyncRotation : This property synchronizes the object's rotation value. (Runtime cannot be changed.) 
- RotationInterpolationType : A type property that smoothly interpolates between the previous rotation value and the new rotation value. 
   - None : It rotates at once without interpolation whenever it is updated with the newly received rotation value. 
   - lerp: Interpolate with Vector3.Lerp based on the given Rotate Speed. 
   - MoveToward : Interpolates with Vector3.MoveTowards based on the given Rotate Speed. 
- Rotate Speed : Defines the speed at which the object rotates. If None is selected for ScaleInterpolationType, no entry is required.
<br>

- SyncScale: This property synchronizes the size value of the object. (Runtime cannot be changed.)
- ScaleInterpolationType : A type property that smoothly interpolates between the previous size and the new size.
   - None : It changes the size at once without interpolation whenever it is updated with the newly received size value. 
   - lerp : Interpolate with Vector3.Lerp based on the given Scale Up Speed. 
   - MoveToward : Interpolate with Vector3.MoveTowards based on the given Scale Up Speed. 
- Scale Up Speed : Defines the rate at which an object changes size. If None is selected for ScaleInterpolationType, no entry is required.


### ZepetoPlayersManager
<img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/215650777-935e3cef-9ebf-4288-84b6-214cc094ac21.png">

- ZepetoPlayerSpawnType : This property determines at what point the ZEPETO character will be created. Runtime changes are not allowed. 
   - NoneSpawn : No character creation. 
   - SinglePlayerSpawnOnStart : Spawn single player out of sync. Same as existing CreatePlayerWithUserId(). 
   - **MultiplayerSpawnOnJoinRoom** : Spawn multiplayer on server entry with position and animation state synchronized. 
   - MultiplayerSpawnLater : Use multiplayer characters, but sync from the moment specified by the creator, not from the moment you log into the room. See the CreateAllPlayers() function in ZepetoPlayersManager.ts. 
- Position related properties are the same as TransformSync.
   - The default Interpolation option is MoveToward because ZEPETO players sync speed by default. 
   - Use Estimate only when the character frequently moves due to physical external collisions. 
   - For worlds that require real-time extrapolation, set extrapolation to fixedspeed. The default option is Disable.
- Gesture sync 
   - Get Animation Clip From Resources : Synchronize gestures using files in the /Asset/Resources/ folder. 
   - Use Zepeto Gesture API : Synchronizes gestures downloaded through the World.Gesture API.
- TIP! 
   - The spawn position of the ZEPETO character is the object position of the ZepetoPlayersManager.ts script.
   - For examples of differences between ZepetoPlayersManager properties, refer to PlayerSync and DemoRunningGame by changing the properties of ZepetoPlayersManager. 
   
### DOTWeenSyncHelper
<img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/215652633-c77d3343-a901-491e-870e-fa6d9967048d.png">

- DOTween synchronization is used for objects moving on a certain path if only the starting position is synchronized once for the first time. You can reduce the load on the server and use server delay extrapolation, which is more accurate because you know the path.
- SyncType : Synchronization settings property. Runtime changes are not allowed. 
   - Sync : Sets the multiplayer synchronization of DOtween objects.  
   - NoneSync : Synchronization is disabled.  
- TweenType : The type property how the DOTWeen will reciprocate. Runtime changes are not allowed. 
   - Circulation : It cycles in a circle. 1 -> 2 -> 3 -> 4 -> 1 -> 2 -> 3 -> 4
   - Linear : Return the way you came in a linear way. 1 -> 2 -> 3 -> 4 -> 3 -> 2 -> 1
   - TeleportFirstPoint: When you reach the end point, you teleport back to the first point and cycle again. 1 -> 2 -> 3 -> 4 -> 1(teleport)
- LoopType : This is the type property of how many times to cycle through. Runtime changes are not allowed. 
   - Repeat : Keep repeating. 
   - JustOneWay : One way works only once. 
   - JustOneRoundTrip : It works only once round trip. 
- SyncExtrapolation : The location is additionally calculated taking into account the time of the server delay.  Runtime change is not allowed. 
   - default : true
- TweenPosition[] : Enter the localPositon coordinates to cycle through in an array. (The size of the array must be greater than or equal to 2.) Runtime cannot be changed. 
- Move Speed : The object's movement speed. 
- ForceReRequest : Receive new coordinates every ForceReRequestBySeconds time. Runtime changes are not allowed. 
   - DOTween is used for efficient server management compared to TransformSync for repeated movements. 
   - If unchecked, synchronization is performed only once for the first connection, and subsequent calculations are made by each client. 
- For an example of the difference between each DOtweenSyncHelper property, see the DOTweenSync sample. 
