import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Animator, AnimatorStateInfo, GameObject, Object, Vector3, WaitUntil} from "UnityEngine";
import {Room, RoomData} from "ZEPETO.Multiplay";
import MultiplayManager from '../Common/MultiplayManager';
import {ZepetoWorldMultiplay} from "ZEPETO.World";
import SyncIndexManager from '../Common/SyncIndexManager';

export default class AnimatorSyncHelper extends ZepetoScriptBehaviour {

    private _animator :Animator;
    private stateInfo : AnimatorStateInfo;

    /** multiplay **/
    private _multiplay: ZepetoWorldMultiplay;
    private _room: Room;
    private _Id: string;
    get Id() {
        return this._Id;
    }
    
    
    private Start() {    
        this._animator = this.GetComponentInChildren<Animator>();

        SyncIndexManager.SyncIndex++;
        this._Id = SyncIndexManager.SyncIndex.toString();
        this._multiplay = Object.FindObjectOfType<ZepetoWorldMultiplay>();
        this._multiplay.RoomJoined += (room: Room) => {
            this._room = room;
            this.SyncMessageHandler();
        };
    }
    private Update(){
        
    }

    private SyncMessageHandler() {
        const ResponseId: string = "AnimatorSync" + this._Id;
        this._room.AddMessageHandler(ResponseId, (message: syncAnimator) => {
            this.StartCoroutine(this.GetSyncPosition(message));
        });
    }
    
    private SendAnimator() {
        this.stateInfo = this._animator.GetCurrentAnimatorStateInfo(0);
        const clipName = this.stateInfo.shortNameHash;
        const clipTime = this.stateInfo.normalizedTime * this.stateInfo.length;
        
        const data = new RoomData();
        data.Add("Id", this._Id);
        data.Add("clipName", clipName);
        data.Add("clipTime", clipTime);
        data.Add("sendTime", MultiplayManager.instance.GetServerTime());

        this._room?.Send("AnimatorSync", data.GetObject());
    }

    private *GetSyncPosition(message:syncAnimator){
        const latency = (MultiplayManager.instance.GetServerTime() - Number(message.sendTime)) / 1000;
        this._animator.Play(message.clipName, 0, message.clipTime+latency);
        
    }
}

interface syncAnimator {
    Id: string,
    clipName: number,
    clipTime: number,
    sendTime: number,
}