import {
    AnimationClip,
    Animator,
    HumanBodyBones,
    Object,
    Physics,
    RaycastHit,
    Transform,
    Vector3,
    WaitForEndOfFrame
} from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import InteractionIcon from './InteractionIcon'
import {CharacterState, ZepetoPlayers, ZepetoScreenTouchpad, ZepetoCharacter} from "ZEPETO.Character.Controller";

export default class GestureInteraction extends ZepetoScriptBehaviour {
    @SerializeField() private animationClip :AnimationClip;
    @SerializeField() private isSnapBone :boolean = true;
    @SerializeField() private bodyBone: HumanBodyBones;
    @SerializeField() private maxGesturePlayer :number = 1;
    
    private _interactionIcon :InteractionIcon;
    private _isFirst : boolean = true;
    private _localCharacter : ZepetoCharacter;
    private _outPosition : Vector3;
    
    
    private Start() {
        this._interactionIcon = this.transform.GetComponent<InteractionIcon>();
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(()=>{
           this._localCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });
        
        this._interactionIcon.OnClickEvent.AddListener(()=> {
            this._interactionIcon.HideIcon();
            this.SetGestrue();
            this.StartCoroutine(this.WaitForExit());
        });
    }

    private SetGestrue(){
        if(this.isSnapBone) {        
            if(this.FindOtherPlayerNum() < this.maxGesturePlayer) {
                this.StartCoroutine(this.SnapBone());
                this._localCharacter.SetGesture(this.animationClip);
            }
            else{
                // The seats are full.
            }
        }
        else{
            this._localCharacter.SetGesture(this.animationClip);
        }
    }
    private * SnapBone(){
        const animator: Animator = this._localCharacter.ZepetoAnimator;
        const bone: Transform = animator.GetBoneTransform(this.bodyBone);
        
        let idx =0;
        while(true) {
            this._outPosition = this.transform.position;

            const distance = Vector3.op_Subtraction(bone.position, this._localCharacter.transform.position);
            const newPos: Vector3 = Vector3.op_Subtraction(this.transform.position, distance);

            this._localCharacter.transform.position = newPos;
            this._localCharacter.transform.rotation = this.transform.rotation;
            yield new WaitForEndOfFrame();
            idx ++;
            if(idx>5)
                return;
        }
    }
    
    private FindOtherPlayerNum(){
        const hitInfos: RaycastHit[] = Physics.RaycastAll(this.transform.position, this.transform.TransformDirection(Vector3.up), 0.1);
        let playerNum = 0;
        if (hitInfos.length > 0)
        {
            hitInfos.forEach((hitInfo)=>{
                console.log(hitInfo.distance);
               if(hitInfo.transform.GetComponent<ZepetoCharacter>()){
                   playerNum ++;
                   console.log(hitInfo.transform.name);
               } 
            });
        }
        return playerNum;
    }

    private StopGesture(){
        this._localCharacter.CancelGesture();
    }

    private *WaitForExit()
    {
        if (this._localCharacter) {
            while (true) {
                if (this._localCharacter.tryJump || this._localCharacter.tryMove)
                {
                    this.StopGesture();
                    this.transform.position = this._outPosition;
                    this._interactionIcon.ShowIcon();
                    break;
                }
                yield;
            }
        }
    }
}