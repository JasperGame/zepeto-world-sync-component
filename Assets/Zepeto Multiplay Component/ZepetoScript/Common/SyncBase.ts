import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {ZepetoWorldMultiplay} from "ZEPETO.World";
import {Room} from "ZEPETO.Multiplay";
import {Object} from "UnityEngine";
import SyncIndexManager from './SyncIndexManager';
import MultiplayManager from './MultiplayManager';

export default class SyncBase extends ZepetoScriptBehaviour {

    /** multiplay **/
    protected _multiplay: ZepetoWorldMultiplay;
    protected _room: Room;
    protected _Id: string;
    get Id() {
        return this._Id;
    }

    private Start(){
        if(!this._Id) {
            SyncIndexManager.SyncIndex++;
            this._Id = SyncIndexManager.SyncIndex.toString();
        }
        this._room = MultiplayManager.instance?.room;

        if (this._room != null) {
            //this._room.OnStateChange += this.OnStateChange;
        } else {
            this._multiplay.RoomJoined += room => {
                this._room = room;
                //this._room.OnStateChange += this.OnStateChange;
            };
        }
        this._multiplay = Object.FindObjectOfType<ZepetoWorldMultiplay>();
        this._multiplay.RoomJoined += (room: Room) => {
            this._room = room;
        };
    }
}