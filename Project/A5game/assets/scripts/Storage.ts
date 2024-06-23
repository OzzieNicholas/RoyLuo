import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('Storage')
export class Storage extends Component {
    protected onLoad(): void {
        //sys.localStorage.setItem(key, value)
    }
    start() {
    }
    update(deltaTime: number) {
    }
}