import { _decorator, Component, Label, Node, Rect, resources, Sprite, SpriteFrame, tween, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('block')
export class block extends Component {

    @property({type:Node})
    nodeYinYing = null;
    @property({type:Node})
    spYuanSu = null;

    @property({type:[SpriteFrame]})
    spfYuanSu = [];


    canTouch: boolean;
    blockType: any;
    is_di: boolean;
    numDi: number;
    isXiaoChu: boolean;
    isMoving: boolean;
    v3BlockOld: Vec3;
    public damageConfig: any = null;
    coveredBy: any;
    covers: any;


    init(type){

        // 确保coveredBy和covers在使用前被初始化为数组
        this.coveredBy = this.coveredBy || [];
        this.covers = this.covers || [];

        this.blockType = type;
        this.canTouch = true;
        this.is_di=false;
        const yuansuNode = this.node.getChildByName('yuansu');
        if (yuansuNode) {
            const sprite = yuansuNode.getComponent(Sprite);
            if (sprite&&type >= 0 && type < this.spfYuanSu.length) {
                sprite.spriteFrame = this.spfYuanSu[this.blockType];
            } else {
                console.error("Sprite component not found on 'yuansu' node.");
            }
        } else {
            console.error("'yuansu' node not found.");
        }
        const labelNode = this.node.getChildByName("DamageLabel");
            if (labelNode) {
                const label = labelNode.getComponent(Label);
                if (label) {
                    //let damageValue = this.damageConfig.damageValues[this.blockType+1];
                    let damageValue = this.damageConfig.damageValues[this.blockType];
                    // label.string = `${this.spfYuanSu[this.blockType].name},${this.spYuanSu.getComponent(Sprite).spriteFrame.name},${this.node.getChildByName('yuansu').getComponent(Sprite).spriteFrame.name}`;
                    //label.string = `Damage: ${damageValue}`; // 设置伤害值文本

                    //改伤害
                    label.string = ``;
                }
            }
    }

    initDi(type){
        this.v3BlockOld = new Vec3(0,0,0)
        this.isMoving = true
        this.isXiaoChu = false
        this.numDi=-1
        this.blockType = type
        this.canTouch = false;
        this.is_di=true
        //this.nodeYinYing.active=false
        this.spYuanSu.getComponent(Sprite).spriteFrame = this.spfYuanSu[this.blockType];
        this.node.setScale(0.7,0.7,1);
    }
    

    shuaXinBlockSPF(type) {
        //this.loadElementSprites();
        this.blockType = type;
        tween(this.node)
            .to(0.1, { scale: Vec3.ZERO }) // 0.1秒先缩小到0，使用 Vec3.ZERO
            .call(() => {
                // 安全地获取并更新 SpriteFrame
                const yuansuSprite = this.node.getChildByName('yuansu')?.getComponent(Sprite);
                yuansuSprite.spriteFrame = this.spfYuanSu[this.blockType];
                // if (yuansuSprite && this.spfYuanSu[this.blockType]) {
                //     yuansuSprite.spriteFrame = this.spfYuanSu[this.blockType]; // 换图片
                // }
    
                // 安全地获取并更新 Label 文本
                const damageLabel = this.node.getChildByName('DamageLabel')?.getComponent(Label);
                
                //改
                //let damageValue = this.damageConfig.damageValues[this.blockType+1];
                let damageValue = this.damageConfig.damageValues[this.blockType];
                //damageLabel.string = `Damage: ${damageValue}`; // 设置伤害值文本
                //改伤害
                damageLabel.string = ``;


                // if (damageLabel && this.damageConfig && this.damageConfig.damageValues[this.blockType + 1]) {
                //     damageLabel.string = this.damageConfig.damageValues[this.blockType + 1];
                // }
            })
            .to(0.1, { scale: Vec3.ONE }) // 放大到1，使用 Vec3.ONE
            .start();
    }

    setTouch(can_touch){
        this.canTouch = can_touch;
        if (this.canTouch) {
            //this.nodeYinYing.active = false;
        }else{
            //this.nodeYinYing.active = true;
        }
    }

    // getBoundingBox_pz(){
    //     //let num_pz = 15;
    //     let num_pz = 10.5;
    //     let node_UITransform_1 = this.node.getComponent(UITransform);
    //     let rect_1 = node_UITransform_1.getBoundingBox();
    //     let rect_3 = new Rect(rect_1.x + num_pz,rect_1.y + num_pz,rect_1.width-num_pz*2,rect_1.height-num_pz*2);
    //     return rect_3;
    // }

    //圆形
    getBoundingBox_pz(){
        //let num_pz = 8; // 用于调整圆的半径
        let num_pz = 17;
        let node_UITransform = this.node.getComponent(UITransform);
        let rect = node_UITransform.getBoundingBox();
        
        // 计算圆心，这里假设节点的锚点在中心
        let centerX = rect.x + rect.width / 2;
        let centerY = rect.y + rect.height / 2;
        
        // 估算圆的半径，取宽和高的最小值减去padding，然后除以2
        let radius = Math.min(rect.width, rect.height) / 2 - num_pz;
        
        // 返回圆形区域的信息
        return { centerX, centerY, radius };
    }
    

    update(deltaTime: number) {
        
    }
}


