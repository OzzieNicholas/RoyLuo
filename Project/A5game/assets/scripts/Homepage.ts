import { _decorator, Component, director, EventTouch, find, JsonAsset, Label, Node, resources, Sprite, SpriteFrame, sys } from 'cc';
import { AudioController } from './AudioController';
import { VibrationManager } from './VibrationManager';
const { ccclass, property } = _decorator;

declare var tt: any;

@ccclass('homepage')
export class homepage extends Component {

    //星星节点
    @property(Node) star: Node;

    @property(Node) public musicButton: Node = null;
    @property(Node) public soundButton: Node = null;
    @property(Sprite) vibrationButtonSprite: Sprite = null; // 震动按钮的Sprite组件引用
    @property(SpriteFrame) public OnSprite: SpriteFrame = null; //设置中开启时的图片
    @property(SpriteFrame) public OffSprite: SpriteFrame = null; //设置中关闭时的图片
    @property(Node) soundSetting: Node = null; //游戏中声音设置
    @property(Node) public maskLayer: Node = null; //遮罩
    @property([SpriteFrame]) animalImg: SpriteFrame[] = [];//动物的图片
    @property(Sprite) animalSprite: Sprite = null; //动物的组件

    
    //存储总的营业额
    revenue:number = 0;
    tt: any;
    wx: any;
    isWX: boolean;
    isTT: boolean;
    musicFlag: boolean;
    soundFlag: boolean;
    vibrationFlag: boolean = true; // 震动功能是否开启的标志位，默认开启
    audioController: AudioController;
    config: any;

    protected async onLoad(): Promise<void> {
        this.config = await this.loadConfig();
        //第一次进入主页
        if(!sys.localStorage.getItem('revenue'))
        {
            sys.localStorage.setItem('revenue', 0);
        }
        this.revenue = parseInt(sys.localStorage.getItem('revenue'));
        //设置星星数目
        let comp = this.star.getComponent(Label);
        comp.string = this.revenue + '';

        // //随机出现动物的图片
        // let randomIndex = Math.floor(Math.random() * this.animalImg.length);
        // this.animalSprite.spriteFrame = this.animalImg[randomIndex];

        //ldx
        this.tt = window['tt']
        this.wx=window['wx']

        if (sys.platform == sys.Platform.WECHAT_GAME) {
            this.isWX = true;
            this.isTT = false;

        } else if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            this.isTT = true;
            this.isWX = false;
        }

        //需完善
        // if (this.isTT){
        //     const today = new Date().toISOString().slice(0, 10);
        //     const lastRewardDate = sys.localStorage.getItem('lastRewardDate');

        //     while (tt.onShowData == null) {
        //     }
        //     if (GameManager.instance.isReceiving || lastRewardDate === today || GameManager.instance.lingqu==false) {
        //         console.log("已领取每日奖励");
        //         this.sidebarButton.active = false;
        //     }
        //     else {
        //         console.log("未领取每日奖励");
        //         console.log(tt.onShowData)
        //         this.sidebarButton.active = true;
        //     }

        //     console.log("进入主场景");
        //     if (!GameManager.instance.isReceiving || lastRewardDate != today) {
        //         // 如果还没领取就执行以下函数
        //         this.sidebarFollow();
        //     }

        // }

        //this.jiangli.active = false;

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

    }


    start() {
        this.musicButton.getComponent(Sprite).spriteFrame = this.OnSprite;
        this.soundButton.getComponent(Sprite).spriteFrame = this.OnSprite;

        const bgmNode = find('BGMNode');
        if (bgmNode) {
            this.audioController = bgmNode.getComponent(AudioController);

            // 从 AudioController 初始化状态
            this.musicFlag = this.audioController.musicIsOn;
            this.soundFlag = this.audioController.soundEffectsIsOn;

            if (this.soundFlag) {
                this.soundButton.getComponent(Sprite).spriteFrame = this.OnSprite;
                //关闭声音
            } else {
                this.soundButton.getComponent(Sprite).spriteFrame = this.OffSprite;
                //打开声音
            }

            if (this.musicFlag) {
                this.musicButton.getComponent(Sprite).spriteFrame = this.OnSprite;
                //关闭音乐
            } else {
                this.musicButton.getComponent(Sprite).spriteFrame = this.OffSprite;
                //打开音乐
            }
        }

        // 初始化震动设置的状态
        if (VibrationManager.instance) {
            this.vibrationFlag = VibrationManager.instance.vibrationEnabled;

            if (this.vibrationFlag) {
                this.vibrationButtonSprite.spriteFrame = this.OnSprite;
            } else {
                this.vibrationButtonSprite.spriteFrame = this.OffSprite;
            }

        } else {
            console.error("VibrationManager not found");
        }

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);

        //随机出现动物的图片
        let randomIndex = Math.floor(Math.random() * this.animalImg.length);
        this.animalSprite.spriteFrame = this.animalImg[randomIndex];
    }

    onTouchStart(event: EventTouch) {
        //this.audioController.playclick();
        this.audioController.playClick();
    }

    // 处理声音和音乐设置的变化
    onSoundToggleChanged() {
        if (this.soundFlag) {
            this.soundButton.getComponent(Sprite).spriteFrame = this.OffSprite;
            //关闭声音
        } else {
            this.soundButton.getComponent(Sprite).spriteFrame = this.OnSprite;
            //打开声音
        }
        this.soundFlag = !this.soundFlag;
        if (this.audioController) {
            this.audioController.toggleSoundEffects(this.soundFlag);
        }
    }

    onMusicToggleChanged() {
        if (this.musicFlag) {
            this.musicButton.getComponent(Sprite).spriteFrame = this.OffSprite;
            //关闭音乐
        } else {
            this.musicButton.getComponent(Sprite).spriteFrame = this.OnSprite;
            //打开音乐
        }
        this.musicFlag = !this.musicFlag;
        if (this.audioController) {
            this.audioController.toggleBGM(this.musicFlag);
        }
    }

     //音乐设置
    //音乐设置的总按钮
    toggleSoundSetting() {
        this.soundSetting.active = true
        this.showMask(this.maskLayer);
    }


    //关闭设置
    close() {
        // 音乐设置节点的可见性
        this.soundSetting.active = false;
        this.maskLayer.active =false;
    }

    //震动按钮
    onVibrationButtonClicked() {
        if (VibrationManager.instance) {
            // 切换震动设置
            VibrationManager.instance.toggleVibration();

            // 获取更新后的震动设置
            this.vibrationFlag = VibrationManager.instance.vibrationEnabled;

            // 更新震动按钮的视觉状态
            if (this.vibrationFlag) {
                this.vibrationButtonSprite.spriteFrame = this.OnSprite;
            } else {
                this.vibrationButtonSprite.spriteFrame = this.OffSprite;
            }

        }
    }

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

    //读取配置文件
    async loadConfig(): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load("json/config", JsonAsset, (err, asset:JsonAsset) => {
                if (err) {
                    console.error("Failed to load config:", err);
                    reject(err);
                } else {
                    resolve(asset.json);
                }
            });
        });
    }

    onstart_btn(event: Event, str: string)
    {
        this.audioController.playClick();
        director.loadScene('game_scene');
        this.audioController.switchBackgroundMusic(this.audioController.gameBGM);
    }

    on_honor_btn_click(event: Event, str: string)
    {   this.audioController.playClick();
        director.loadScene('honor_scene');
        //this.audioController.switchBackgroundMusic(this.audioController.bgmClip);
    }

    update(deltaTime: number) {
        
    }

}


