import { _decorator, Component, EventTouch, Node } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('Food')
export class Food extends Component {
    foodval: number = 0;
    start() {
        //this.openClickEvent();
    }
    update(deltaTime: number) {
    }
}
