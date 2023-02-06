import { HumanBodyBones, Transform, WaitForEndOfFrame, Animator, Vector3, Collider, GameObject, Quaternion } from 'UnityEngine';
import { UnityEvent } from 'UnityEngine.Events';
import { Button } from 'UnityEngine.UI';
import { CharacterState, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptableObject, ZepetoScriptBehaviour } from 'ZEPETO.Script'
import IconController from './IconController';
import InteractionActionAsset from './InteractionActionAsset';
import InteractionManager from './InteractionManager';

export default class InteractionTrigger extends ZepetoScriptBehaviour {
    public interactionAsset: ZepetoScriptableObject<InteractionActionAsset>;
    public targetTransform: Transform;
    public iconOffset: Vector3;
    
    public iconPrefab: GameObject;

    private dockPoints: Array<Transform> = [];
    private exitPoints: Array<Transform> = [];

    private icons: Array<IconController> = [];

    public onActionStart: UnityEvent;
    public onActionEnd: UnityEvent;

    private currentInteractionIndex: number;
    private exitArea: bool;
    public Start()
    {
        this.currentInteractionIndex = -1;
        
        let index = 0;
        for (let i = 0; i < this.targetTransform.childCount; i++) {
            const enter = this.targetTransform.GetChild(i); 
            if (!enter.name.includes("DockPoint")) { continue; }
            
            const exit = enter.transform.Find("ExitPoint");
            this.dockPoints.push(enter);
            this.exitPoints.push(exit);

            const icon: IconController = InteractionManager.instance.CreateIcon(this.iconPrefab, this.interactionAsset["icon"], enter.transform, this.iconOffset);
            console.log(icon.gameObject.name);
            icon.ShowAndHideIcon(false);
            this.icons.push(icon);

            let tmp = index;
            icon.GetComponent<Button>().onClick.AddListener(() => { this.Interact(tmp); });
            index++;
        }

        this.onActionStart = new UnityEvent();
        this.onActionEnd = new UnityEvent();
    }

    public Interact(index: number) {
        if (this.currentInteractionIndex != -1)
        {
            this.icons[this.currentInteractionIndex].ShowAndHideIcon(true);
        }
        
        this.currentInteractionIndex = index;
        this.icons[index].ShowAndHideIcon(false);
        
        if (this.interactionAsset["animationClip"] != null && this.targetTransform != null) {
            const character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
            character.SetGesture(this.interactionAsset["animationClip"]);
            if (this.interactionAsset["useBoneTransform"])
            {
                this.SnapToBodyBone(this.interactionAsset["bodyBone"], this.dockPoints[index]);
                this.StartCoroutine(this.WaitForExit());
            }
            
            this.onActionStart.Invoke();
        }
    }

    public CancelInteraction()
    {
        this.ActivateIcons(true);
        const exit = this.exitPoints[this.currentInteractionIndex];
        
        let targetCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        targetCharacter.transform.position = exit.position;
        targetCharacter.transform.rotation = exit.rotation;

        this.onActionEnd.Invoke();
        this.currentInteractionIndex = -1;
    }

    public OnTriggerEnter(other: Collider)
    {
        if (other.gameObject == InteractionManager.instance.GetCharacter().gameObject)
        {
            this.ActivateIcons(true);
            this.exitArea = false;
        }
    }

    public OnTriggerExit(other: Collider)
    {
        if (other.gameObject == InteractionManager.instance.GetCharacter().gameObject)
        {
            this.ActivateIcons(false);
            this.exitArea = true;
        }
    }

    public ActivateIcons(b : bool)
    {
        for (let i = 0; i < this.icons.length; i++)
        {
            this.icons[i].ShowAndHideIcon(b);
        }
    }

    //Position relative to the body bone. 
    public SnapToBodyBone(targetBodyBone: HumanBodyBones, target: Transform) {
        this.StartCoroutine(this.CoSnapToBodyBone(targetBodyBone, target));
    }
    
    private *CoSnapToBodyBone(targetBodyBone: HumanBodyBones, target: Transform) {
        let wait: WaitForEndOfFrame = new WaitForEndOfFrame();
        yield wait;
        yield wait;

        let targetCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;

        let animator: Animator = targetCharacter.ZepetoAnimator;
        let bone: Transform = animator.GetBoneTransform(targetBodyBone);
        let distance = Vector3.op_Subtraction(bone.position, targetCharacter.Context.transform.position);
        let newPos: Vector3 = Vector3.op_Subtraction(target.position, distance);
        targetCharacter.transform.position = newPos;
        targetCharacter.transform.rotation = target.rotation;
    }
    
    private *WaitForExit()
    {
        let targetCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        if (targetCharacter) {
            while (true) {
                if (targetCharacter.tryJump || targetCharacter.tryMove || this.exitArea)
                {
                    if (targetCharacter.CurrentState === CharacterState.Gesture) {
                        targetCharacter.CancelGesture();
                        this.CancelInteraction();
                    }
                }
                yield;
            }
        }
    }
}