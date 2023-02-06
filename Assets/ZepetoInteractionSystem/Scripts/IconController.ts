import { Camera, Color, Coroutine, Mathf, Quaternion, Sprite, Time, WaitForEndOfFrame } from 'UnityEngine';
import { Button, Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export default class IconController extends ZepetoScriptBehaviour {

    public iconSprite: Sprite;
    private _initialRotation: Quaternion;
    private _showIconCoroutine: Coroutine;
    private _hideIconCoroutine: Coroutine;

    Start() {
        //Apply the sprite icon to the button. 
        if(this.gameObject.GetComponent<Image>() != null){
            this.gameObject.GetComponent<Image>().sprite = this.iconSprite;
        }else{
            console.error("Icon Prefab has no Image Component. Adding Image and Button will fix this error");
        }

        this._initialRotation = this.transform.rotation;
    }

    Update() {
        if (!Camera.main) return;
        this.transform.rotation = Quaternion.op_Multiply(Camera.main.transform.rotation, this._initialRotation);
    }
    
    ShowAndHideIcon(isShow: bool){
        if(isShow){
            //Fade the icon in after enabling the input. 
            this.gameObject.GetComponent<Image>().raycastTarget = true;

            if(this._hideIconCoroutine != null || this._hideIconCoroutine != undefined)
                this.StopCoroutine(this._hideIconCoroutine);
            
            this._showIconCoroutine = this.StartCoroutine(this.CoShowIcon());
        }else{
            //Fade the icon out after disabling the input. 
            this.gameObject.GetComponent<Image>().raycastTarget = false;
            if(this._showIconCoroutine != null || this._showIconCoroutine != undefined)
                this.StopCoroutine(this._showIconCoroutine);
            this._hideIconCoroutine = this.StartCoroutine(this.CoHideIcon());
        }
    }

    ShowAndHideIconImmediately(isShow: bool){
        if(isShow){
            //Set the alpha to 1 immediately, and allow input detection.
            this.gameObject.GetComponent<Image>().raycastTarget = true;
            this.gameObject.GetComponent<Image>().color = new Color(1,1,1,1);
        }else{
            //Set the alpha to 0 immediately, and disable input detection.
            this.gameObject.GetComponent<Image>().raycastTarget = false;
            this.gameObject.GetComponent<Image>().color = new Color(1,1,1,0);
        }
    }

    //Coroutine to fade the icon in. 
    *CoShowIcon(){
        let timeElapsed = 0;
        let timeMax = 0.2;
        while(true){
            timeElapsed += Time.deltaTime;
            let alpha = Mathf.Lerp(0,1,timeElapsed/timeMax);
            this.gameObject.GetComponent<Image>().color = new Color(1,1,1,alpha);
            if(alpha == 1){
                break;
            }
            yield WaitForEndOfFrame;
        }
    }

    //Coroutine to fade the icon out
    *CoHideIcon(){
        let timeElapsed = 0;
        let timeMax = 0.3;
        while(true){
            timeElapsed += Time.deltaTime;
            let alpha = Mathf.Lerp(1,0,timeElapsed/timeMax);
            this.gameObject.GetComponent<Image>().color = new Color(1,1,1,alpha);
            if(alpha == 0){
                break;
            }
            yield WaitForEndOfFrame;
        }
    }

}