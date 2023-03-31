import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Animator, AnimatorStateInfo, GameObject, Object, Vector3, WaitUntil, WaitForSeconds} from "UnityEngine";
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
    private _isMasterClient: boolean;
    private _sendCoroutine: any;
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

    public ChangeOwner(ownerSessionId:string){
        if(null == this._room)
            this._room = MultiplayManager.instance.room;
        if(this._room.SessionId == ownerSessionId){
            if(!this._isMasterClient) {
                this._isMasterClient = true;
                this._sendCoroutine = this.StartCoroutine(this.SendAnimatorCoroutine());
            }
            this.SendAnimator();
        }
        else if(this._room.SessionId != ownerSessionId && this._isMasterClient) {
            this._isMasterClient = false;
            if(null != this._sendCoroutine)
                this.StopCoroutine(this._sendCoroutine);
        }
    }

    private *SendAnimatorCoroutine(){
        while(true){
            yield new WaitForSeconds(10);
            this.SendAnimator();
        }
    }

    private SendAnimator() {
        console.log("send");
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

    private SyncMessageHandler() {
        const ResponseId: string = "AnimatorSync" + this._Id;
        this._room.AddMessageHandler(ResponseId, (message: syncAnimator) => {
            this.GetSyncPosition(message);
        });
    }

    private GetSyncPosition(message:syncAnimator){
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