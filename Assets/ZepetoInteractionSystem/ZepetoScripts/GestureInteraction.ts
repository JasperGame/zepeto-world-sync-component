import {AnimationClip, Object} from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import InteractionIcon from './InteractionIcon'
import {CharacterState, ZepetoPlayers, ZepetoScreenTouchpad, ZepetoCharacter} from "ZEPETO.Character.Controller";

export default class GestureInteraction extends ZepetoScriptBehaviour {
    @SerializeField() private animationClip :AnimationClip;
    
    private _interactionIcon :InteractionIcon;
    private _isFirst : boolean = true;
    private _localCharacter : ZepetoCharacter;
    
    private Start() {
        this._interactionIcon = this.transform.GetComponent<InteractionIcon>();
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(()=>{
           this._localCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });
        
        this._interactionIcon.OnClickEvent.AddListener(()=> {
            this._interactionIcon.HideIcon();
            this.SeatChair();
            this.StartCoroutine(this.WaitForExit());
        });
    }
    
    private SeatChair(){
        console.log("ASDA");
        this._localCharacter.transform.position = this.transform.position;
        this._localCharacter.transform.rotation = this.transform.rotation;

        this._localCharacter.SetGesture(this.animationClip);
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
                    this._localCharacter.CancelGesture();
                    this._interactionIcon.ShowIcon();
                    break;
                }
                yield;
            }
        }
    }
}