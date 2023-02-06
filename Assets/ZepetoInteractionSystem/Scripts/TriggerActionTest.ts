import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class TriggerActionTest extends ZepetoScriptBehaviour {

    Start() {    

    }

    OnActivatedTest() {
        console.warn("ACTIVATED");
    }

}