import { _decorator, Component, EventTouch, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Food')
export class Food extends Component {

    foodval:number = 0;
    start() {
        //this.openClickEvent();
    }

    /*//点击事件
    openClickEvent(){
        this.node.on(Node.EventType.TOUCH_START, this.onClick, this);
    }

    onClick(event: EventTouch)
    {
       this.node.destroy();
    }
    */
    update(deltaTime: number) {
        
    }
}


