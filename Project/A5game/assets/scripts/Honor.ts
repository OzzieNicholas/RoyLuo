import { _decorator, Button, Component, director, EventTouch, JsonAsset, Label, Node, resources, Sprite, SpriteFrame, sys } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('Honor')
export class Honor extends Component {
    @property(Node)
    public layer_1: Node;
    @property(Node)
    public layer_2: Node;
    config: Record<string, any>;
    @property([Button])
    achievebuttons: Button[] = []; // 按成就顺序排列的按钮
    //解锁后图片
    @property([SpriteFrame])
    unlockImg: SpriteFrame[] = [];
    @property([SpriteFrame]) zipaiImg: SpriteFrame[] = [];//成就解锁后的字牌图片
    @property([Sprite]) zipaiNode: Sprite[] = []; // 字牌节点
    @property(Sprite)
    achievejiangbei: Sprite = null;
    //弹出分享面板
    @property(Node)
    fenxiangmianban: Node;
    //面板上显示的成就文字
    @property(Label)
    chengjiuLabels: Label = null;
    //蒙版
    @property(Node)
    public maskLayer: Node = null;
    imgtitles: string;
    wx: any;
    tt: any;
    isWX: boolean;
    isTT: boolean;
    protected async onLoad(): Promise<void> {
        this.config = await this.loadConfig();
        this.wx = window['wx']
        this.tt = window['tt']
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            this.isWX = true;
            this.isTT = false;
        } else if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            this.isTT = true;
            this.isWX = false;
        }
        // 初始化广告逻辑
        if (this.isWX) {
            const titles = this.config.sharetitles;
            // 随机选择一个标题
            const title = titles[Math.floor(Math.random() * titles.length)];
            // 创建包含所有图片URLs的数组
            const imageUrls = this.config.shareimageUrls;
            //随机选择一个图片URL
            const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
            this.wx.onShareAppMessage(() => {
                return {
                    title: title,
                    imageUrl: imageUrl // 图片 URL
                }
            })
            this.wx.showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage', 'shareTimeline']
            })
        }
        this.config = await this.loadConfig();
        this.checkAndUnlockAchievements();
    }
    start() {
    }
    update(deltaTime: number) {
    }
    /********************按钮逻辑**************** */
    on_backhome_btn_click() {
        director.loadScene('main_scene');
    }
    on_previous_btn_click() {
        this.layer_1.active = true;
        this.layer_2.active = false;
    }
    on_next_btn_click() {
        this.layer_1.active = false;
        this.layer_2.active = true;
    }
    checkAndUnlockAchievements() {
        if (!this.config || !this.config.achievements) {
            console.error('Config or achievements data is not loaded or undefined.');
            return;
        }
        this.config.achievements.forEach(achievement => {
            let dayCountKey = `dayCount_${achievement.id}`;
            let count = parseInt(sys.localStorage.getItem(dayCountKey) || "0");
            // 遍历阈值，检查是否达到解锁条件
            achievement.thresholds.forEach((threshold, index) => {
                //当前遍历的奖杯
                let button = this.achievebuttons[achievement.id * 4 + index];
                let zipai = this.zipaiNode[achievement.id * 4 + index]
                if (count >= threshold) {
                    button.interactable = true;
                    //更换图片
                    button.getComponent(Sprite).spriteFrame = this.unlockImg[achievement.id * 4 + index];
                    zipai.spriteFrame = this.zipaiImg[achievement.id * 4 + index]
                } else {
                    button.interactable = false;
                }
                if (button.interactable) { // 如果按钮可交互
                    button.node.on('click', () => {
                        this.achievejiangbei.spriteFrame = this.unlockImg[achievement.id * 4 + index];
                        this.chengjiuLabels.string = `${achievement.showmessages[index]}`.replace(/[，！]/g, "$&\n");
                        this.fenxiangmianban.active = true
                        this.showMask(this.maskLayer);
                        //this.imgUrls = this.achieveUrls[index];
                        this.imgtitles = `${achievement.showmessages[index]}`;
                    });
                }
            });
        });
    }
    //背景蒙版，防止弹出面板时点击其他按钮
    showMask(maskLayer: Node) {
        maskLayer.active = true;
        maskLayer.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
            event.propagationStopped = true
        }, this);
        maskLayer.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
            event.propagationStopped = true
        }, this);
        maskLayer.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            event.propagationStopped = true
        }, this);
        maskLayer.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
            event.propagationStopped = true
        }, this);
    }
    closechengjiu() {
        this.fenxiangmianban.active = false;
        this.maskLayer.active = false;
    }
    sharechengjiu() {
        this.sharefriend(() => {
            // 分享完成的回调
            this.closechengjiu()
        });
    }
    //增加抖音和微信
    sharefriend(call) {
        // 微信环境的分享
        if (typeof (this.wx) !== "undefined" && this.isWX) {
            this.wx.shareAppMessage({
                title: this.imgtitles, // 分享内容的标题
            });
            // 确保call是一个函数再调用它
            if (typeof call === "function") {
                call();
            }
        }
        // 抖音环境的分享
        if (typeof (this.tt) !== "undefined" && this.isTT) {
            window['tt'].shareAppMessage({
                title: this.imgtitles, // 分享内容的标题
                success() {
                    console.log("抖音分享成功");
                    if (typeof call === "function") {
                        call();
                    }
                },
                fail(e) {
                    console.log("分享失败", e);
                }
            });
        }
    }
    //读取配置文件
    async loadConfig(): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load("json/config", JsonAsset, (err, asset: JsonAsset) => {
                if (err) {
                    console.error("Failed to load config:", err);
                    reject(err);
                } else {
                    resolve(asset.json);
                }
            });
        });
    }
}
