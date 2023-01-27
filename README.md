# zepeto-world-sync-component

## Intro
- 제페토 플랫폼의 유니티 게임 오브젝트에 부착해 멀티 플레이 유저들과 트랜스폼의 위치 및 형태를 쉽게 동기화 할 수 있게 도와주는 컴포넌트입니다.
- 자주 사용되는 제페토 기본 샘플코드가 포함되어있습니다.

## Preview
![intro](https://user-images.githubusercontent.com/123578202/214825228-f59ff437-1186-40ed-b32c-0c0c8cce74b9.gif)

- 멀티플레이의 환경에서 동기화 오브젝트를 동적 생성하고, 파괴할 수 있습니다.   
- 캐릭터의 제스쳐를 동기화 하며 보다 부드럽고 정확한 위치를 계산합니다.   
- 제페토 월드 콘텐츠로 자주 사용되는 무빙 블럭과 세이브 포인트 등을 포함한 여러 샘플 코드가 포함되어 있습니다.   
- 컴포넌트 형태로 동기화 할 오브젝트에 부착해서 사용하며, **코딩 없이 멀티플레이를 구현**할 수 있습니다.
- 네트워크 딜레이를 계산하여 실시간성 게임을 제작할 수 있습니다.
#### 네트워크 지연을 계산하지 않은 샘플 (네트워크 딜레이로 인해 각기 다른 플레이어가 먼저 들어온 것 처럼 보입니다.)
![ezgif com-gif-maker (26)](https://user-images.githubusercontent.com/123578202/214829726-80b13631-2b6d-4c2a-91dc-499b46ee3e2d.gif)

#### 네트워크 지연을 계산한 샘플 (네트워크 딜레이를 계산해 두 플레이어가 실시간으로 움직이는것처럼 보여집니다.)
![ezgif com-gif-maker (27)](https://user-images.githubusercontent.com/123578202/214829782-9f3f3a5a-f493-4eba-b659-ad166f687bef.gif)

## Included
- **Component Script** (Assets/ZepetoScripts/Multiplay/)
   - MultiplayManager.ts
   - SyncIndexManager.ts
   - TransformSyncHelper.ts
   - ZepetoPlayersManager.ts
   - PlayerSync.ts
   - DOTWeenSyncHelper.ts

- **Sample Script** ( Assets/ZepetoScripts/Multiplay/SampleCode )
   - BlockPacking.ts (움직이는 블럭과 캐릭터를 함께 이동)
   - SavePoint.ts (캐릭터 리스폰 위치 지정)   
   - FallChecking.ts (떨어지면 리스폰포인트로 텔레포트)   
   - AdditionalSpeed.ts (바닥 트리거 이동속도 증감)
   - SoccerBall.ts (멀티플레이 축구공)
   - CoinAcquire.ts (트리거 코인 획득)
   - GestureTrigger.ts (바닥 트리거 제스쳐 플레이)
   - ChickenMove.ts (랜덤하게 움직이는 AI NPC )   
   - InstantiateChicken.ts (트리거 새로운 치킨 생성)   
   - ScaleUpBalloon (트리거 풍선 크기 증감)
   
- **Sample Scenes** ( Assets/Scene )
   - **Demo** (위 모든 샘플 스크립트를 포함한 예제 )
   - **DemoRunningGame** ( 제페토캐릭터 러닝 게임 예제(외삽 적용))
   - DOTween
   - PlayerSync
   - TransformSync   
      
* 참고) File - BuildSettings에서 테스트 플레이 하려는 씬이 최상단에 있어야 QR빌드 후 바로 확인할 수 있습니다.   
 <img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/214825259-6e6e6ace-f9b1-4ed7-948b-bb39ae9b3d3d.png">
   
## Function Description
### MultiplayManager
- Instantiate(prefabName : string, ownerSessionId? : string, position?: Vector3, rotation?: Quaternion)
- Destroy(DestroyObject : GameObject)

### TransformSyncHelper
- ChangeOwner(ownerSessionId :string) :void
- ForceTarget() :void
- isOwner :boolean
- Id :string

### DOTWeenSyncHelper
- isMasterClient : boolean
- Id :string

### ZepetoPlayersManager   
- CreateAllPlayers() :void

### PlayerSync
- isLocal :boolean
- zepetoPlayer :ZepetoPlayer


## Properties Description
### TransformSyncHelper
 <img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/214825279-b9de45ab-c6b7-4ddf-90ba-2ee020664952.png">

- **UpdateOwner**[Master, **Undefine**]는 해당 오브젝트를 누가 업데이트 할 지 정하는 type 프로퍼티입니다. (런타임 변경이 불가합니다.)  
   - Master는 처음 입장한 플레이어가 업데이트 합니다.   
      - AI NPC, 랜덤하게 움직이는 지형지물 등이 이에 해당됩니다. 해당 플레이어가 나가면 그 다음으로 입장한 플레이어가 Master를 이어받습니다.
   -  **Undefine은** 처음 오너는 따로 없고, ChangeOwner(OwnerSessionId) 메소드로 업데이트 해줄 사람을 정합니다.    
      - 축구공과 같이 찬 사람이 오너가 되며 바뀌거나, 펫 같이 특정 플레이어가 업데이트 할 경우에 해당됩니다.   
- **Use Hard Snap**은 새로 받은 포지션이 내 위치보다 **Hard Snap If Distance Greater Than** 만큼 멀어졌을 때 순간이동으로 처리하는 프로퍼티입니다.
- **PositionInterpolationType**[None, Lerp, **MoveToWard**, **Estimatet**]은 이전 받은 위치와 새로 받은 위치까지를 부드럽게 보간 type 프로퍼티입니다.
   - None은 새로 받은 포지션으로 매 틱마다 계속해서 순간이동 시킵니다. 보간 없이 순간이동 하는 오브젝트에 사용합니다.
   - lerp는 주어진 속도를 기반으로 Vector3.Lerp로 보간합니다. 
   - **MoveToWard**는 주어진 속도를 기반으로 Vector3.MoveToWards로 보간합니다. 정확한 속도가 주어진다면 가장 좋은 계산법입니다.
   - **Estimate**는 현재 포지션부터 새로 받은 포지션까지 걸린 시간의 속도로 보간합니다. 계속 변하는 속도에서 가장 좋은 계산법입니다.
- **PositionExtrapolationType**[**Disable**, FixedSpeed, Estimate]은 네트워크 지연에 대한 외삽입니다. 외삽은 과거 받은 위치와 현재 받은 위치를 기반으로 방향과 속도를 구하고 다음 목적지에 offset값으로 더해주는 방식입니다. 실시간성 달리기 게임, 물리작용 오브젝트 등 위치 값이 중요 할 때 사용합니다.
   - FixedSpeed는 주어진 속도를 기반으로 예측합니다. 정확한 속도가 주어진다면 가장 좋은 계산법입니다.
   - Estimate는 주어진 속도가 없을 때 받아온 위치값을 기반으로 속도를 예측해 거리를 구합니다.
- **ExtraMultipler**는 외삽값의 배율 입니다. (Default : 1) 외삽을 사용하지 않을경우 입력하지 않아도 됩니다.
- **MoveSpeed**는 오브젝트의 이동속도를 정의합니다. PositionInterpolationType에서 **Estimate**또는 **None**를 선택한 경우 입력하지 않아도 됩니다.
- TransformSyncHelper의 프로퍼티 별 차이에 대한 예제는 TransformSync 샘플을 참조하세요.

### ZepetoPlayersManager
<img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/214825296-5f6b6245-f37e-4ab0-b9a1-ddf6ab2a61aa.png">

- **ZepetoPlayerSpawnType**[NoneSpawn, SinglePlayerSpawnOnStart, **MultiplayerSpawnOnJoinRoom**, MultiplayerSpawnLater]은 어느 시점에 제페토 캐릭터를 생성할지 결정하는 프로퍼티입니다. 런타임 변경이 불가합니다.   
   - NoneSpawn은 캐릭터를 생성하지 않습니다. 
   - SinglePlayerSpawnOnStart은 동기화 되지 않는 싱글 플레이어를 스폰합니다. 기존 CreatePlayerWithUserId() 와 같습니다.
   - **MultiplayerSpawnOnJoinRoom**은 위치와 애니메이션 상태가 동기화되는 멀티 플레이어를 서버 입장때 스폰합니다.
   - MultiplayerSpawnLater는 멀티플레이 캐릭터를 사용하지만 방 접속 시점이 아닌 크리에이터가 지정한 순간부터 동기화합니다. ZepetoPlayersManager.ts의 CreateAllPlayers() 함수를 참고하세요.
- **position** 관련 프로퍼티는 **TransformSync**와 같습니다. 
   - 제페토 플레이어는 속도를 기본으로 동기화 하기 때문에 기본 Interpolation 옵션은 **MoveToWard**입니다. 물리적인 외부 영향을 받아 캐릭터가 움직이는 경우가 잦은경우에만 Estimate를 사용하세요. 
   - 실시간성 외삽이 필요한 러닝게임의 경우 extrapolation을 fixedspeed로 설정합니다. 기본 옵션은 **Disable**입니다. 
- **SyncGesture**는 **Asset/Resources/** 파일 내부에 들어있는 제스쳐 애니메이션을 동기화합니다. 
   - ZepetoCharacter.SetGesture()으로 호출된 다른 플레이어의 제스쳐를 동기화합니다.
- 참고) 최초 생성 되는 캐릭터의 위치는 ZepetoPlayersManager.ts 스크립트가 오브젝트 포지션입니다.
- ZepetoPlayersManager 프로퍼티 별 차이에 대한 예제는 PlayerSync와 DemoRunningGame에서 ZepetoPlayersManager의 프로퍼티를 변경해가며 참조하세요.

### DOTWeenSyncHelper
<img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/214825322-865e6bd9-0419-4076-aa34-2f3579a52fb4.png">

- DOTWeen동기화는 처음 한번, 시작 위치만 동기화 한다면 일정한 경로를 움직이는 오브젝트에 활용됩니다. 서버의 부하를 줄이고 경로를 알고 있기에 더 정확한 서버 지연 외삽을 사용할 수 있습니다.
- **SyncType**[**Sync**, NoneSync]은 동기화 설정 프로퍼티입니다. 런타임 변경이 불가합니다.   
- **TweenType**[**Circulation**, Linear, TeleportFirstPosition]은 DOTWeen이 어떻게 왕복 운동 할 것인지 type 프로퍼티입니다. 런타임 변경이 불가합니다.   
   - **Circulation은** 원형으로 순환합니다. 1 -> 2 -> 3 -> 4 -> 1 -> 2 -> 3 -> 4
   - Linear은 선형으로 왔던 길을 되돌아갑니다. 1 -> 2 -> 3 -> 4 -> 3 -> 2 -> 1
   - TeleportFirstPoint은 끝 지점에 도달 시 첫 지점으로 순간이동 해서 다시 순환합니다. 1 -> 2 -> 3 -> 4 -> 1(teleport)
- **LoopType**[**Repeat**, JustOneWay, JustOneRoundTrip]은 몇번 순환할 것인지에 대한 type 프로퍼티입니다. 런타임 변경이 불가합니다.   
- **SyncExtrapolation**은 서버 지연의 시간만큼을 고려해서 위치를 추가로 계산합니다. **(default : true)** 런타임 변경이 불가합니다.   
- **TweenPosition[]** 배열에 순환할 localPositon 좌표를 입력합니다. **(배열의 크기는 2보다 같거나 커야합니다.)** 런타임 변경이 불가합니다.   
- **ForceReRequest**는 **ForceReRequestBySeconds** 시간마다 새로 좌표를 받아옵니다. 런타임 변경이 불가합니다.    
   - (DOTWeen은 반복되는 움직임에 대해 TransformSync대비 효율적인 서버 관리를 위해 사용합니다. 체크를 해제 할 경우 처음 접속 한번만 동기화 하고 이후는 각자 클라이언트에서 계산합니다.)
- DOTWeenSyncHelper 프로퍼티 별 차이에 대한 예제는 DOTWeenSync 샘플을 참조하세요.

## Easy Start Guide
0. 시작 전 데모 씬 환경이 제대로 동작되는지 확인하세요.   
1. Setting   
   1-1. 빈 Scene에서 CreateEmpty 게임오브젝트를 만들고 이름은 Multiplay로 명명합니다.   
   1-2. AddComponent -> Zepeto World Multiplay를 추가합니다.   
   1-3. 아래에 /Assets/Script/Common/**MultiplayManager.ts** 스크립트를 추가합니다.    
   <img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/214825349-affd46e3-7038-4825-95ec-9d94db5a9d95.png">
   
2. 캐릭터 동기화   
   2-1. 하이어라키상 ZEPETO -> ZepetoPlayers를 추가합니다. (제페토 캐릭터의 처음 스폰 위치는 ZepetoPlayers 게임오브젝트의 위치입니다.)   
   2-2. ZepetoPlayers 컴포넌트에 /Assets/Script/Player/**ZepetoPlayersManager.ts** 스크립트를 추가합니다.   
   2-3. Hireachy -> 3D Object -> Plane을 추가하고 위치를 0,0,0 크기를 10,1,10으로 변경해서 땅을 만듭니다.   
   2-4. QR빌드 후 플레이를 눌러 각 캐릭터가 동기화 되는지 확인합니다.   
   <img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/214825381-6551bd7b-a41a-41a6-bbdf-0f8c4bfb2cbb.png">
   

3. 오브젝트 동기화   
   3-1. 동기화 할 게임 오브젝트에 /Assets/Script/Transform/**TransformSyncHelper.ts**를 추가합니다.   
   3-2. UpdateOwner 타입을 master로 변경하고 빌드 후 에디터와 휴대폰으로 접속합니다.   
   3-3. 에디터의 씬 창에서 오브젝트를 움직여보고 휴대폰에도 동일하게 움직여지는지 확인합니다.   
   3-4. 오브젝트에 직접 정의한 이동 스크립트를 부착하거나 샘플 코드를 사용하세요.   
   <img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/214827049-f3f7f617-cc3d-4cb1-99d3-b1d41d38285c.png">

4. DOTWeen 동기화   
   4-1 왕복 이동을 동기화 할 블럭에 /Assets/Script/DOTWeen/**DOTWeenSyncHelper.ts**를 추가합니다.   
   4-2 왕복 이동 할 localPosition 좌표를 2개 이상 입력합니다.   
   4-3 블럭이 이동할 때 블럭 위에 있는 제페토 캐릭터도 함께 이동하게 하려면 샘플코드의 BlockPacking.ts 코드를 추가합니다.   
   4-4 빌드 후 확인합니다.   
   <img width="500" alt="image" src="https://user-images.githubusercontent.com/123578202/214827072-41f62033-c8d0-4164-a4d9-a7cd2a6ab789.png">


### 오브젝트 동기화 (Transform Sync)
- Sync Transform - 오브젝트 동기화 컴포넌트   
  ![TFDEMO](https://user-images.githubusercontent.com/123578202/214827104-1d92a3d5-a213-46ab-9e85-f411bf4590df.gif)

   - Interpolation : 계산  / Extrapolation : 사용하지 않음   
   - Interpolation : 계산  / Extrapolation : 계산   
   - Interpolation : MoveToWard  / Extrapolation : 고정 속도   
   - Interpolation : Lerp  / Extrapolation : 고정 속도   
   - Interpolation : MoveToWard  / Extrapolation : 사용하지 않음   
   - Interpolation : Lerp  / Extrapolation : 사용하지 않음   
   - Interpolation : 없음  / Extrapolation : 사용하지 않음     
   - TransformSyncHelper는 움직임을 하는 주체가 어떤 스크립트적인 움직임을 일으키는지에 대한 생각이 필요합니다. 이것에 대한 항상 정답인 옵션은 없습니다. 알려진 속도로 등속 이동하는 물체는 속도를 지정해 주는것이 더 정확한 보간법이고, 속도가 빠르며, 그것이 네트워크 지연을 보간해야 할 정도로 중요한 오브젝트인 경우엔 Extrapolation 옵션을 채택하는것이 좋습니다. 자세한 활용방안은 Demo 샘플에서 각 오브젝트 별 프로퍼티를 어떻게 세팅했는지 확인하세요.

### 주어진 경로 동기화 (DOTween Sync)
#### 결과 (노란색 - 받아온 포지션, 파란색 - 보간된 위치)   
1. 일반적인 상황 (서버 지연 < 100ms)   
![DTDEMO1](https://user-images.githubusercontent.com/123578202/214827123-935d698c-411e-4d70-aca1-e27c833be737.gif)

2. 네트워크가 1초간 지연 된 상황을 가정 (response → setTimeout(1000))
![DTDemo2](https://user-images.githubusercontent.com/123578202/214827271-ef03867d-6b6f-4fb6-be21-fa46f1c251b1.gif)

1초 늦게 받은 정보이지만 보간된 위치(파란색)가 마스터(에디터) 클라이언트와 동일하게 움직이는것을 확인할 수 있습니다.

## Dependency
- Unity 2020.3.9f1
- Zepeto.World 1.10.0
- 캐릭터 컨트롤러 V2를 사용합니다.
- 기존 사용하던 프로젝트와 병합시 주의를 요합니다.
