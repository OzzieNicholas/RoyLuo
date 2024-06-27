import { _decorator, Component, director, EventTouch, Node, Scene } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Startbutton')
export class Startbutton extends Component {
    // 需要切换到的目标场景节点
    
    protected onLoad(): void {
        //点击切换
        this.node.on(Node.EventType.TOUCH_START, this.onClick, this);
    }

    onClick(event:EventTouch)
    {
        director.loadScene('game_scene');
    }

    start() {
        
    }

    update(deltaTime: number) {
        
    }
}


