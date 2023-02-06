import { AnimationClip, HumanBodyBones, Sprite, Vector2 } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export default class InteractionActionAsset extends ZepetoScriptBehaviour {

    public animationClip: AnimationClip;
    public icon: Sprite;
    public useBoneTransform: boolean = false;
    public bodyBone: HumanBodyBones; 
    public useViewChange: boolean = false;
    public cameraZoom: number = 1;
    public cameraAngle: Vector2 = new Vector2(0, 45);
}