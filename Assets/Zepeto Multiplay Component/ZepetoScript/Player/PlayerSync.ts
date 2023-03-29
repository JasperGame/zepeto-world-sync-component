import {ZepetoScriptBehaviour} from 'ZEPETO.Script'
import {RoomBase, RoomData} from 'ZEPETO.Multiplay';
import {ZepetoWorldMultiplay} from "ZEPETO.World";
import {CharacterJumpState, CharacterMoveState, CharacterState, ZepetoPlayer} from 'ZEPETO.Character.Controller';
import { RuntimeAnimatorController, Object, Animator, AnimatorClipInfo, Resources,CharacterController, AnimationClip, WaitForSeconds, AnimatorOverrideController, Mathf} from 'UnityEngine';
import {Player} from 'ZEPETO.Multiplay.Schema';
import MultiplayManager from '../Common/MultiplayManager';
import TransformSyncHelper from '../Transform/TransformSyncHelper';
import ZepetoPlayersManager from './ZepetoPlayersManager';

export default class PlayerSync extends ZepetoScriptBehaviour {
    @HideInInspector() public isLocal: boolean = false;
    @HideInInspector() public player: Player;
    @HideInInspector() public zepetoPlayer: ZepetoPlayer;
    @HideInInspector() public tfHelper: TransformSyncHelper;
    @HideInInspector() public isUseInjectSpeed: boolean = false;
    @HideInInspector() public GetAnimationClipFromResources : boolean = true;
    @HideInInspector() public UseZepetoGestureAPI: boolean = false;

    private readonly _tick: number = 0.04;
    private _animator: Animator;
    private _multiplay: ZepetoWorldMultiplay;
    private _room: RoomBase;

    private Start() {
        this._animator = this.transform.GetComponentInChildren<Animator>();
        this._multiplay = Object.FindObjectOfType<ZepetoWorldMultiplay>();
        this._room = this._multiplay.Room;
        if (this.isLocal) {
            this.StartCoroutine(this.SendLocalPlayer(this._tick));
        } else{
            this.player.OnChange += (ChangeValue) => this.OnChangedPlayer();

            //If this is not a local character, do not use State Machine.
            this.zepetoPlayer.character.StateMachine.Stop();
        } 
    }

    // !isLocal(other player)
    private OnChangedPlayer() {
        if (this.isLocal) return
        const animationParam = this.player.animationParam;
        
        this._animator.SetInteger("State", animationParam.State);
        this._animator.SetInteger("MoveState", animationParam.MoveState);
        this._animator.SetInteger("JumpState", animationParam.JumpState);
        this._animator.SetInteger("LandingState", animationParam.LandingState);
        this._animator.SetFloat("MotionSpeed", animationParam.MotionSpeed);
        this._animator.SetFloat("FallSpeed", animationParam.FallSpeed);
        this._animator.SetFloat("Acceleration", animationParam.Acceleration);
        this._animator.SetFloat("MoveProgress", animationParam.MoveProgress);
        
        //sync gesture
        if (animationParam.State == CharacterState.Gesture && ( this.UseZepetoGestureAPI || this.GetAnimationClipFromResources )) { 
            const clipInfo: AnimatorClipInfo[] = this._animator.GetCurrentAnimatorClipInfo(0);
            const gestureName = this.player.gestureName;
            if (gestureName == null) return;
            if (clipInfo[0].clip.name == gestureName) return;

            let animClip:AnimationClip;
            if ( this.UseZepetoGestureAPI && ZepetoPlayersManager.instance.GestureAPIContents.has(this.player.gestureName)){
                const content = ZepetoPlayersManager.instance.GestureAPIContents.get(this.player.gestureName);
                if (!content.IsDownloadedAnimation) {
                    // If the animation has not been downloaded, download it.
                    content.DownloadAnimation(() => {
                        // play animation clip
                        this.zepetoPlayer.character.SetGesture(content.AnimationClip);
                    });                       
                    return;
                } else {
                    animClip = content.AnimationClip;
                }
            }
            else if(this.GetAnimationClipFromResources)//resources anim
                animClip = Resources.Load<AnimationClip>(this.player.gestureName);
            
            if (null == animClip) // When the animation is not in the /Asset/Resources file pass
                console.warn(`${this.player.gestureName} is null, Add animation in the Resources folder.`);
            else {
                this.zepetoPlayer.character.SetGesture(animClip);
            }
        }
        
        if(animationParam.State == CharacterState.Teleport){
            this.tfHelper.ForceTarget();
        }

        const playerAdditionalValue = this.player.playerAdditionalValue;
        this.zepetoPlayer.character.additionalWalkSpeed = playerAdditionalValue.additionalWalkSpeed;
        this.zepetoPlayer.character.additionalRunSpeed = playerAdditionalValue.additionalRunSpeed;
        this.zepetoPlayer.character.additionalJumpPower = playerAdditionalValue.additionalJumpPower;

        //sync interpolation speed
        if(this.isUseInjectSpeed){
            const ySpeed = Mathf.Abs(animationParam.FallSpeed);
            let xzSpeed : number = 0;
            if(animationParam.State == CharacterState.Jump && animationParam.JumpState == CharacterJumpState.JumpIdle){
                xzSpeed = 0;
            }
            else if (animationParam.MoveState == CharacterMoveState.MoveRun) {
                //1.5 : Run Weight between actual Zepeto character and Unity.
                xzSpeed = this.zepetoPlayer.character.RunSpeed * 1.5 * animationParam.Acceleration;
            } else if (animationParam.MoveState == CharacterMoveState.MoveWalk) {
                //1.25 : Walk Weight between actual Zepeto character and Unity.
                xzSpeed = this.zepetoPlayer.character.WalkSpeed * 1.25 * animationParam.Acceleration;
            } 
            else
                return;
            
            this.tfHelper.moveSpeed = xzSpeed+ySpeed;
        }
    }

    //isLocal(When it's my character)
    private* SendLocalPlayer(tick: number) {
        const pastIdleCountMax:number = 10;
        let pastIdleCount:number = 0;
        
        while (true) {
            const state = this._animator.GetInteger("State");
            // Idle status is sent only once.
            if(state != CharacterState.Idle || pastIdleCount < pastIdleCountMax) {
                const data = new RoomData();
                const animationParam = new RoomData();
                animationParam.Add("State", state);
                animationParam.Add("MoveState", this._animator.GetInteger("MoveState"));
                animationParam.Add("JumpState", this._animator.GetInteger("JumpState"));
                animationParam.Add("LandingState", this._animator.GetInteger("LandingState"));
                animationParam.Add("MotionSpeed", this._animator.GetFloat("MotionSpeed"));
                animationParam.Add("FallSpeed", this._animator.GetFloat("FallSpeed"));
                animationParam.Add("Acceleration", this._animator.GetFloat("Acceleration"));
                animationParam.Add("MoveProgress", this._animator.GetFloat("MoveProgress"));
                data.Add("animationParam", animationParam.GetObject());

                if (state === CharacterState.Gesture && (this.GetAnimationClipFromResources || this.UseZepetoGestureAPI)) {
                    //this.runtimeAnimator.animationClips[1] is always means gesture's clip
                    data.Add("gestureName", this._animator.runtimeAnimatorController.animationClips[1].name);
                }

                const playerAdditionalValue = new RoomData();
                playerAdditionalValue.Add("additionalWalkSpeed", this.zepetoPlayer.character.additionalWalkSpeed);
                playerAdditionalValue.Add("additionalRunSpeed", this.zepetoPlayer.character.additionalRunSpeed);
                playerAdditionalValue.Add("additionalJumpPower", this.zepetoPlayer.character.additionalJumpPower);
                data.Add("playerAdditionalValue", playerAdditionalValue.GetObject());

                this._room?.Send("SyncPlayer", data.GetObject());
            }
            if(state == CharacterState.Idle)             //Send 10 more frames even if stopped
                pastIdleCount++;
            else
                pastIdleCount = 0;
            
            yield new WaitForSeconds(tick);
        }
    }
}
