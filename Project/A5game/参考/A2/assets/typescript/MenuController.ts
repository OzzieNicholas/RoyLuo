import { _decorator, Component, director, Sprite, SpriteFrame, Node, find, assetManager, EventTouch, ImageAsset, Texture2D, Button, sys, macro, ProgressBar, CCObject, TerrainLayer } from 'cc';
import { AudioController } from './AudioController';
import { sheepgame } from './sheepgame';
import { VibrationManager } from './VibrationManager';
import UserSettings from './UserSettings';
import { GameManager } from './GameManager';
import { gameEvents } from './gameEvents';
//import { AudioController } from './gamescene/AudioController';
//import { GlobalState } from './GlobalStateManager';
const { ccclass, property } = _decorator;

declare var tt: any;

@ccclass('MenuController')
export class MenuController extends Component {
    @property(Node)
    public musicButton: Node = null;
    @property(Node)
    public soundButton: Node = null;

    @property(SpriteFrame)
    public musicOnSprite: SpriteFrame = null;

    @property(SpriteFrame)
    public musicOffSprite: SpriteFrame = null;

    @property(SpriteFrame)
    public soundOnSprite: SpriteFrame = null;

    @property(SpriteFrame)
    public soundOffSprite: SpriteFrame = null;

    @property(Sprite)
    vibrationButtonSprite: Sprite = null; // 震动按钮的Sprite组件引用

    @property(SpriteFrame)
    vibrationOnSprite: SpriteFrame = null; // 震动开启时的图片

    @property(SpriteFrame)
    vibrationOffSprite: SpriteFrame = null; // 震动关闭时的图片

    //游戏中声音设置
    @property(Node)
    soundSetting: Node = null;

    //开始按钮
    @property(Button)
    beginbutton: Button = null;

    //展示按钮
    @property(Button)
    zhanshibutton: Button = null;

    @property(Node)
    jiangli: Node = null;

    @property(Node)
    public maskLayer: Node = null;

    @property(Node)
    sidebarButton: Node = null;

    // //遮挡，背景变灰
    // @property({type:Node})
    // beijinghui = null; //加载成就页面

    // @property(ProgressBar)
    // pproBar: ProgressBar;

    musicFlag: boolean;

    soundFlag: boolean;
    vibrationFlag: boolean = true; // 震动功能是否开启的标志位，默认开启

    private audioController: AudioController;
    wx: any;
    res: any;
    tt: any;
    isWX: boolean;
    isTT: boolean;

    onLoad() {
        UserSettings.getInstance().login(() => {});
        //清除领取每日奖励数据
        //sys.localStorage.removeItem('lastRewardDate');

        this.tt = window['tt']
        this.wx=window['wx']

        if (sys.platform == sys.Platform.WECHAT_GAME) {
            this.isWX = true;
            this.isTT = false;

        } else if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            this.isTT = true;
            this.isWX = false;
        }

        if (this.isTT){

            //this.sidebarButton.active = true;
            const today = new Date().toISOString().slice(0, 10);
            const lastRewardDate = sys.localStorage.getItem('lastRewardDate');

            while (tt.onShowData == null) {
            }
            if (GameManager.instance.isReceiving || lastRewardDate === today || GameManager.instance.lingqu==false) {
                console.log("已领取每日奖励");
                this.sidebarButton.active = false;
            }
            else {
                console.log("未领取每日奖励");
                console.log(tt.onShowData)
                this.sidebarButton.active = true;
            }

            console.log("进入主场景");
            if (!GameManager.instance.isReceiving || lastRewardDate != today) {
                // 如果还没领取就执行以下函数
                this.sidebarFollow();
            }

        }

        this.jiangli.active = false;

        // 初始化广告逻辑
        if (this.isWX) {

            //this.wx.getSavedFileList({
            this.wx.getFileSystemManager().getSavedFileList({
                //获取文件列表
                success : function(res){
                    console.log("文件缓存信息：")
                    res.fileList.forEach(function(val,key){
                        this.wx.removeSavedFile({
                            filePath: val.filePath
                        })
                    })
                }
            })

            const titles = [
                "动物园发生越狱事件？！看看咋回事...",
                "差一点点就能成功！帮帮我，一起玩！",
                "这款AI游戏居然能这么上头...想试试吗？",
                "居然有99%的人都无法通关？你能玩到哪？",
                "这款游戏居然让我室友玩到凌晨三点！你也来看看",
                "来帮助小动物们逃离铁笼吧！"
            ];
        
            // 随机选择一个标题
            const title = titles[Math.floor(Math.random() * titles.length)];

            // 创建包含所有图片URLs的数组
            const imageUrls = [
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (1).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (2).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (3).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (4).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (5).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (6).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (7).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (8).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (9).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (10).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (11).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (12).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (13).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (14).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (15).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (16).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (17).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (18).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (19).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (21).png",
                "https://perimage.giiso.com/minigame2_fenxiang/03/ (22).png"
            ];
        
            // 随机选择一个图片URL
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

        if (this.isWX){
            this.wx.onHide(() => {
                // 假设你已经在某个地方实例化了 GameEvents，或者它是全局可访问的
                gameEvents.instance.logout();
              });
        }
    }


    protected start(): void {
        this.musicButton.getComponent(Sprite).spriteFrame = this.musicOnSprite;
        this.soundButton.getComponent(Sprite).spriteFrame = this.soundOnSprite;

        const bgmNode = find('BGMNode');
        if (bgmNode) {
            this.audioController = bgmNode.getComponent(AudioController);

            // 从 AudioController 初始化状态
            this.musicFlag = this.audioController.musicIsOn;
            this.soundFlag = this.audioController.soundEffectsIsOn;

            if (this.soundFlag) {
                this.soundButton.getComponent(Sprite).spriteFrame = this.soundOnSprite;
                //关闭声音
            } else {
                this.soundButton.getComponent(Sprite).spriteFrame = this.soundOffSprite;
                //打开声音
            }

            if (this.musicFlag) {
                this.musicButton.getComponent(Sprite).spriteFrame = this.musicOnSprite;
                //关闭音乐
            } else {
                this.musicButton.getComponent(Sprite).spriteFrame = this.musicOffSprite;
                //打开音乐
            }
        }

        // 初始化震动设置的状态
        if (VibrationManager.instance) {
            this.vibrationFlag = VibrationManager.instance.vibrationEnabled;

            if (this.vibrationFlag) {
                this.vibrationButtonSprite.spriteFrame = this.vibrationOnSprite;
            } else {
                this.vibrationButtonSprite.spriteFrame = this.vibrationOffSprite;
            }

        } else {
            console.error("VibrationManager not found");
        }



        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);


    }

    onTouchStart(event: EventTouch) {
        this.audioController.playclick();
    }

    // “开始游戏”按钮点击时调用
    onStartGameClicked(event) {
        // 切换到关卡选择场景
        director.loadScene('loadingGame');
        //ldx,记录开始游戏时间
        gameEvents.instance. startGame();
    }

    // 处理声音和音乐设置的变化
    onSoundToggleChanged() {
        if (this.soundFlag) {
            this.soundButton.getComponent(Sprite).spriteFrame = this.soundOffSprite;
            //关闭声音
        } else {
            this.soundButton.getComponent(Sprite).spriteFrame = this.soundOnSprite;
            //打开声音
        }
        this.soundFlag = !this.soundFlag;
        if (this.audioController) {
            this.audioController.toggleSoundEffects(this.soundFlag);
        }
    }

    onMusicToggleChanged() {
        if (this.musicFlag) {
            this.musicButton.getComponent(Sprite).spriteFrame = this.musicOffSprite;
            //关闭音乐
        } else {
            this.musicButton.getComponent(Sprite).spriteFrame = this.musicOnSprite;
            //打开音乐
        }
        this.musicFlag = !this.musicFlag;
        if (this.audioController) {
            this.audioController.toggleBGM(this.musicFlag);
        }
    }

    //成就展示
    chengjiu() {
        // this.pproBar.progress = 0; // 开始时设置进度为0
        // this.beijinghui.active = true; 
        // this.pproBar.node.active = true; // 确保进度条是可见的

        // // 使用一个计时器来更新进度条
        // let duration = 0.5; // 总持续时间为3秒
        // let elapsed = 0; // 已过时间
        // this.schedule(function(dt) {
        //     elapsed += dt; // 增加已过时间
        //     let progress = elapsed / duration; // 计算当前进度
        //     this.pproBar.progress = progress; // 更新进度条

        //     // 当进度完成时
        //     if (progress >= 1) {
        //         this.unscheduleAllCallbacks(); // 停止所有计时器

        //         this.pproBar.node.active = false;

        //         // 延迟执行原有逻辑
        //         this.scheduleOnce(function() {
        //             this.beijinghui.active =false
        //             director.loadScene('achievement');

        //         }, 0.2); // 这里的1秒是进度条完成后延迟的时间
        //     }
        // }, 0.1, macro.REPEAT_FOREVER); // 每0.1秒更新一次进度
        director.loadScene('loadingGame2');
    }



    //音乐设置
    //音乐设置的总按钮
    toggleSoundSetting() {
        this.soundSetting.active = true
        this.showMask(this.maskLayer);
        this.beginbutton.interactable = false;
        this.zhanshibutton.interactable = false;
    }


    //关闭设置
    close() {
        // 音乐设置节点的可见性
        this.soundSetting.active = false;
        this.maskLayer.active =false;
        this.beginbutton.interactable = true;
        this.zhanshibutton.interactable = true;

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
                this.vibrationButtonSprite.spriteFrame = this.vibrationOnSprite;
            } else {
                this.vibrationButtonSprite.spriteFrame = this.vibrationOffSprite;
            }

        }
    }

    showMask(maskLayer: Node) {
        console.log(maskLayer)
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

    //显示侧边栏
    xianshicebian(){
        this.jiangli.active = true;
        this.showMask(this.maskLayer);
    }

    closecebian(){
        this.jiangli.active = false;
        this.maskLayer.active =false;
    }

    goToSidebar() {
        //GameManager.instance.isReceiving = true;
        // this.saveUserInfo(GlobalState.instance.userData, GlobalState.instance.userToken);
        window['tt'].navigateToScene({
            scene: "sidebar",
            success: (res) => {
                console.log("navigate to scene success");
                // 跳转成功回调逻辑
            },
            fail: (res) => {
                console.log("navigate to scene fail: ", res);
                // 跳转失败回调逻辑
            },
        });
    }

    rewardComplete() {
        this.jiangli.active = false;
        GameManager.instance.getRandomItem();
        if (GameManager.instance.isReceiving) {
            // 如果成功领取了奖励
            console.log("奖励已领取，将于明天重置");
            this.sidebarButton.active = false; // 领取后隐藏按钮
        }
    }

     // 奖励展示
     showRewardPopup() {
        // 用户点击奖励入口时，判断当前用户是否从侧边栏启动
        console.log("ddddddddddd")
        console.log(this.res.launch_from)
        console.log(this.res.location)
        if (this.res.launch_from === 'homepage' && this.res.location === 'sidebar_card') {
            // 如果从侧边栏启动，奖励按钮显示「领取奖励」
            console.log("侧边栏访问");
            this.jiangli.active = true;
            this.jiangli.getChildByName("领取奖励").active = true;
            this.jiangli.getChildByName("进入侧边栏").active = false;
        } else {
            // 如果不是从侧边栏启动，展示跳转侧边栏的按钮
            console.log("非侧边栏访问");
            this.jiangli.active = true;
            this.jiangli.getChildByName("领取奖励").active = false;
            this.jiangli.getChildByName("进入侧边栏").active = true;
        }

        // console.log("非侧边栏访问");
        // this.jiangli.active = true;
        // this.jiangli.getChildByName("领取奖励").active = true;
        // this.jiangli.getChildByName("进入侧边栏").active = false;
    }

    sidebarFollow() {
        const self = this;
        this.res = tt.onShowData;
        console.log("res", this.res);
        console.log("sidebarFollow");
        // 通过tt.checkScene判断当前宿主是否支持跳转侧边栏
        window['tt'].checkScene({
            scene: "sidebar",
            success: function (sceneRes) {
                console.log('checkScene成功', sceneRes);
                console.log(sceneRes.isExist)
                if (sceneRes.isExist) {
                    // 如果支持跳转侧边栏，展示奖励入口，进入步骤二
                    console.log('支持跳转侧边栏，展示奖励入口');
                    self.sidebarButton.active = true;
                } else {
                    // 如果不支持跳转侧边栏，不展示奖励入口
                    console.log('不支持跳转侧边栏，隐藏奖励入口');
                    self.sidebarButton.active = false;
                    //self.sidebarButton.active = true;
                }
            },
            fail: function (err) {
                console.error('checkScene失败', err);
            }
        });
    }



}