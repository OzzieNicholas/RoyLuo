import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('VibrationManager')
export class VibrationManager extends Component {
    static instance: VibrationManager = null;
    // 默认开启震动
    vibrationEnabled: boolean = true;
    onLoad() {
        if (VibrationManager.instance == null) {
            VibrationManager.instance = this;
            director.addPersistRootNode(this.node);
        } else {
            this.node.destroy();
        }
    }
    start() {
    }
    update(deltaTime: number) {
    }
    toggleVibration() {
        this.vibrationEnabled = !this.vibrationEnabled;
    }
}
