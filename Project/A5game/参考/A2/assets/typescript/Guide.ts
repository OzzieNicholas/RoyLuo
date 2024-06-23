import { _decorator, Component, Input, Node, tween, UITransform, v2, Vec2, Vec3 } from 'cc';
import { sheepgame } from './sheepgame';
const { ccclass, property } = _decorator;

@ccclass('Guide')
export class Guide extends Component {

    @property({type:Node})
    hand = null;
    guideStep: number;
    lastCardCount: number;

    initializeAfterSheepGame(){
        this.guideStep = 1;
        this.hand.active = true;
        this.lastCardCount = this.node.getParent().getChildByName('parentBlocks').children.length;

        // 触摸监听
        //this.node.on('touchstart', this.onTouchStart, this);
        // 在 onLoad 或 start 中添加事件监听器
        //this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        //this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        //sheepgame.eventTarget.on('sheepgame-ready', this.onTouchStart, this);
        //this.onTouchStart()

        // 显示引导
        this.guide();

    }

    onDestroy () {
        // 取消监听
        this.node.off('touchstart', this.onTouchStart, this);
    }

    // onDestroy() {
    //     // 清理事件监听器
    //     this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
    //     //sheepgame.eventTarget.off('sheepgame-ready', this.onTouchStart, this);
    // }

    guide() {
        if (this.guideStep == 1) {
            let b1 = this.node.getParent().getChildByName('parentBlocks').children[5];
            //let b1 = this.node.getChildByName('parentBlocks').children[5];
            console.log(b1.position)
            // 将frame节点移到第一个按钮
            //this.frame.setPosition(btn1.position);
            // 引导文本
            //this.showInfo('请点击第一个按钮~');
            // 手指动作
            this.setHand(b1.position);
        }
        else if (this.guideStep == 2) {
            let btn2 = this.node.getParent().getChildByName('parentBlocks').children[10];
            // 将frame节点移到第二个按钮
            //this.frame.setPosition(btn2.position);
            // 引导文本
            //this.showInfo('请点击第二个按钮~');
            // 手指动作
            this.setHand(btn2.position);
        }
        else if (this.guideStep == 3) {
            let b3 = this.node.getParent().getChildByName('parentBlocks').children[15];
            // 将frame节点移到第三个按钮
            //this.frame.setPosition(btn3.position);
            // 引导文本
            //this.showInfo('请点击第三个按钮~');
            // 手指动作
            this.setHand(b3.position);
        }
    }

    // setHand(pos) {
    //     // 设置引导手位置
    //     this.hand.setPosition(new Vec3(pos.x, pos.y - 80, 0));
    
    //     // 创建动作
    //     const moveForward = tween().by(0.8, { position: new Vec3(0, 50, 0) });
    //     const moveBack = tween().by(0.8, { position: new Vec3(0, -50, 0) });
    //     const repeatAction = tween(this.hand).sequence(moveForward, moveBack).repeatForever();
    
    //     // 停止之前的所有动作
    //     this.hand.stopAllActions();
    
    //     // 运行动作
    //     repeatAction.start();
    // }

    setHand(pos) {
        // 设置引导手位置
        this.hand.setPosition(new Vec3(pos.x+30, pos.y - 60, 0));

        // 如果存在旧的tween，首先停止它
        if (this.hand['_tween']) {
            this.hand['_tween'].stop();
        }

        // 创建动作
        const moveForward = tween().by(0.8, { position: new Vec3(0, 20, 0) });
        const moveBack = tween().by(0.8, { position: new Vec3(0, -20, 0) });
        const repeatAction = tween(this.hand).sequence(moveForward, moveBack).repeatForever();

        // 将tween保存在节点上以便将来访问
        this.hand['_tween'] = repeatAction;

        // 运行动作
        repeatAction.start();
    }

    // onTouchStart(event) {
    //     if(this.guideStep) {
    //     // 获取触摸点，转为节点坐标
    //     const touchPoint = event.getUILocation(); // 获取UI坐标点
    //     const pos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(touchPoint.x, touchPoint.y, 0));
    //     console.log(pos)
        
    //     // 获取相应按钮的大小范围
    //     let btn;
    //     if (this.guideStep == 1) {
    //         console.log()
    //         btn = this.node.getParent().getChildByName('parentBlocks').children[5];
    //     } else if (this.guideStep == 2) {
    //         btn = this.node.getParent().getChildByName('parentBlocks').children[11];
    //     } else if (this.guideStep == 3) {
    //         btn = this.node.getParent().getChildByName('parentBlocks').children[13];
    //     }
    
    //     // 确保按钮已经找到
    //     if (!btn) {
    //         console.warn("not found for guideStep:", this.guideStep);
    //         return;
    //     }
    
    //     const rect = btn.getComponent(UITransform).getBoundingBox();
    //     console.log(rect)
    
    //     // 判断触摸点是否在按钮上
    //     if (rect.contains(new Vec2(pos.x, pos.y))) {
    //         // 允许触摸事件传递给按钮(允许冒泡)
    //         event.propagationStopped = false;  // 修改了冒泡的处理方式
    //         this.guideStep++;
            
    //         // 如果三个按钮都点击了，则将guideStep设置为0，并隐藏所有相关节点
    //         if (this.guideStep > 3) {
    //             this.guideStep = 0;
    //             //this.frame.active = false;
    //             //this.guideLabel.active = false;
    //             this.hand.active = false;
    //         } else {
    //             this.guide(); // 假设这是一个更新指引界面的函数
    //         }
    //     } else {
    //         // 吞噬触摸，禁止触摸事件传递给按钮(禁止冒泡)
    //         event.propagationStopped = true;
    //     }
    //     }
    // }

    checkCardChanges() {
        if (this.guideStep>3){
            return;
        }
        const currentCardCount = this.node.getParent().getChildByName('parentBlocks').children.length;
        if (currentCardCount < this.lastCardCount) {
            // 假设卡牌数量减少是由于被点击移除
            this.onTouchStart(); // 卡牌数量变化，调用 onTouchStart
            this.lastCardCount = currentCardCount; // 更新卡牌计数
        }
    }

    onTouchStart() {
        // 移动 hand 到下一个位置
        this.guideStep++;
        if (this.guideStep > 3) {
            this.guideStep = 4;
            this.hand.active = false; // 可能需要隐藏手指
        } else {
            this.guide(); // 更新手指的位置
        }
    }

    update(deltaTime: number) {
        this.checkCardChanges();
        
    }
}


