import { Canvas, GameObject, LayerMask, Quaternion, RenderMode, Sprite, Transform, Vector3 } from 'UnityEngine';
import { CanvasScaler, GraphicRaycaster } from 'UnityEngine.UI';
import { BlockingObjects } from 'UnityEngine.UI.GraphicRaycaster';
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import IconController from './IconController';

export default class InteractionManager extends ZepetoScriptBehaviour {
    public static instance: InteractionManager;
    
    private canvas: Canvas;
    private character: ZepetoCharacter;
    public Awake()
    {
        InteractionManager.instance = this;

        this.canvas = this.gameObject.AddComponent<Canvas>();
        this.canvas.renderMode = RenderMode.WorldSpace;
        

        let scalar = this.gameObject.AddComponent<CanvasScaler>();
        scalar.dynamicPixelsPerUnit = 1;
        scalar.referencePixelsPerUnit = 100;

        let raycaster = this.gameObject.AddComponent<GraphicRaycaster>();
        raycaster.ignoreReversedGraphics = false;
        raycaster.blockingObjects = BlockingObjects.None;
    }

    public GetCharacter(): ZepetoCharacter
    {
        return this.character;
    }

    public Start()
    {
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
            this.canvas.worldCamera = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera;
        });
    }

    public CreateIcon(prefab: GameObject, icon: Sprite, target: Transform, offset: Vector3) : IconController
    {
        let g: GameObject = GameObject.Instantiate<GameObject>(prefab, Vector3.op_Addition(target.position, offset), Quaternion.LookRotation(target.forward), this.transform);
        let iconController: IconController = g.AddComponent<IconController>();
        iconController.iconSprite = icon;
        return iconController;
    }
}