import { _decorator, Component, Node ,Event} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Customer')
export class Customer extends Component {
    leftnum: number = 20; // 剩下的喂饱需要的次数
    eventTriggered: boolean = false; // 标记事件是否已经触发过

    onLoad() {
        // 添加监听器
        this.node.on('event', this.onEvent, this);
    }

    start() {

    }

    // 监听触发的事件
    onEvent() {
        //初始化新顾客位置
        this.node.setPosition(this.node.position.x + 100, this.node.position.y);
    }

    Eventtrigger() {
            this.node.dispatchEvent(new Event('event',true));
    }

    update(deltaTime: number) {
        if (this.leftnum == 0) {
            this.Eventtrigger();
            this.leftnum = 20;
        }
    }
}


