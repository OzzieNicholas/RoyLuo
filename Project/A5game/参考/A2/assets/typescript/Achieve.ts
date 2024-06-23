import { _decorator, Button, Component, director, EventTouch, JsonAsset, Label, Node, ProgressBar, resources, Sprite, SpriteFrame, sys } from 'cc';
import UserSettings, { Achievement } from './UserSettings';
const { ccclass, property } = _decorator;


@ccclass('Achieve')
export class Achieve extends Component {

    //绿色进度条
    @property([Sprite])
    progressBars: Sprite[] = []; // 假设你已经按照成就的顺序排列了进度条

    //进度条的背景
    @property([Sprite])
    bgBars: Sprite[] = [];

    @property([Button])
    buttons: Button[] = []; // 按成就顺序排列的按钮

    @property([Label])
    buttonLabels: Label[] = []; // 按钮上的文本，用于更新状态

    //成就的条件
    @property([Label])
    achieveLabels: Label[] = [];

    @property(SpriteFrame)
    unlockSpriteFrame: SpriteFrame = null; // 已解锁状态的图片资源

    @property(SpriteFrame)
    lockSpriteFrame: SpriteFrame = null; // 未解锁状态的图片资源

    //动物头像
    @property([Sprite])
    avatars: Sprite[] = [];
    
    //动物名字
    @property([Label])
    animalname: Label[] = [];

    //成就面板
    @property(Node)
    achievemianban: Node = null;
    @property({type: Label})
    achievetimu: Label = null; 
    @property({type: Label})
    achievemiaoshu: Label = null; 
    @property(Node)
    achievetouxiang: Node = null; 

    @property(Node)
    public maskLayer: Node = null;


    // gameConfig: Record<string, any>;
    achievementsConfig: Achievement[];
    
    avatarImages = {}; // 用于存储预加载的图片资源
    wx: any;
    isWX: boolean;
    achieveUrls: string[];
    imgUrls: string;
    imgtitles: string;
    tt: any;
    isTT: boolean;

    async onLoad() {

        this.wx=window['wx']
        this.tt=window['tt']

        if (sys.platform == sys.Platform.WECHAT_GAME) {
            this.isWX = true;
            this.isTT = false;

        } else if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            this.isTT = true;
            this.isWX = false;
        }

        // 初始化广告逻辑
        if (this.isWX) {

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



        try {
            // const configAsset = await new Promise<JsonAsset>((resolve, reject) => {
            //     resources.load("json/config", JsonAsset, (err, asset: JsonAsset) => {
            //         if (err) reject(err);
            //         else resolve(asset);
            //     });
            // });
    
            // this.gameConfig = configAsset.json;
            // this.achievementsConfig = this.gameConfig.achievements;
            // this.achievementsConfig =  UserSettings.getInstance().getAchievements();

            // 我加调用重置成就的方法
            //UserSettings.getInstance().resetAchievements();

            UserSettings.getInstance().loadAchievements(async () => {

                this.achievementsConfig =  UserSettings.getInstance().getAchievements();

                console.log(this.achievementsConfig)

                const loadImage = async (path) => new Promise<SpriteFrame>((resolve, reject) => {
                    resources.load(path, SpriteFrame, (err, spriteFrame: SpriteFrame) => {
                        if (err) reject(err);
                        else resolve(spriteFrame);
                    });
                });
        
                const loadTasks = [];
                for (let i = 1; i <= this.achievementsConfig.length; i++) {
                    //loadTasks.push(loadImage(`achieve/zoo${i}_1/spriteFrame`).then(spriteFrame => this.avatarImages[`zoo${i}_1`] = spriteFrame));
                    loadTasks.push(loadImage(`achieve/zoo${i}_0/spriteFrame`).then(spriteFrame => this.avatarImages[`zoo${i}_0`] = spriteFrame));
                    loadTasks.push(loadImage(`achieve/zoolock/spriteFrame`).then(spriteFrame => this.avatarImages[`zoo${i}_1`] = spriteFrame));
                }
        
                // 将进度条图片加载任务添加到任务列表
                const progressBarSpriteFrame = await loadImage("achieve/greenbar/spriteFrame");
    
                const bgBarSpriteFrame = await loadImage("achieve/whitebar/spriteFrame");
    
                // 等待除进度条图片外的所有其他图片资源加载完成
                await Promise.all(loadTasks);
    
                // 设置绿色进度条图片
                this.progressBars.forEach(sprite => {
                    sprite.spriteFrame = progressBarSpriteFrame;
                });
    
                // 设置进度条背景图片
                this.bgBars.forEach(sprite => {
                    sprite.spriteFrame = bgBarSpriteFrame;
                });


                this.achieveUrls = [
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (17).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (18).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (1).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (2).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (3).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (4).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (5).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (6).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (7).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (8).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (9).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (10).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (11).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (12).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (13).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (14).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (15).png",
                    "https://perimage.giiso.com/minigame2_fenxiang/dongwu/ (16).png"
                ];             
                

                // 所有资源加载完毕后，更新UI
                this.updateAchievementUI();
            });
    
            // const loadImage = async (path) => new Promise<SpriteFrame>((resolve, reject) => {
            //     resources.load(path, SpriteFrame, (err, spriteFrame: SpriteFrame) => {
            //         if (err) reject(err);
            //         else resolve(spriteFrame);
            //     });
            // });
    
            // const loadTasks = [];
            // for (let i = 1; i <= this.achievementsConfig.length; i++) {
            //     loadTasks.push(loadImage(`achieve/zoo${i}_1/spriteFrame`).then(spriteFrame => this.avatarImages[`zoo${i}_1`] = spriteFrame));
            //     loadTasks.push(loadImage(`achieve/zoo${i}_0/spriteFrame`).then(spriteFrame => this.avatarImages[`zoo${i}_0`] = spriteFrame));
            // }
    
            // // 将进度条图片加载任务添加到任务列表
            // const progressBarSpriteFrame = await loadImage("achieve/greenbar/spriteFrame");

            // const bgBarSpriteFrame = await loadImage("achieve/whitebar/spriteFrame");

            // // 等待除进度条图片外的所有其他图片资源加载完成
            // await Promise.all(loadTasks);

            // // 设置绿色进度条图片
            // this.progressBars.forEach(sprite => {
            //     sprite.spriteFrame = progressBarSpriteFrame;
            // });

            // // 设置进度条背景图片
            // this.bgBars.forEach(sprite => {
            //     sprite.spriteFrame = bgBarSpriteFrame;
            // });

    
            // // 所有资源加载完毕后，更新UI
            // this.updateAchievementUI();
        } catch (error) {
            console.error("Failed to load resources:", error);
        }
    }
    
    
    start() {

        if (this.wx){

        }

    }

    updateAchievementUI() {
        if (!this.achievementsConfig) {
            console.warn("Achievements config is not loaded or is undefined.");
            return;
        }

        //总共有多少个成就
        console.log(this.achievementsConfig)

        this.achievementsConfig.forEach((achievement, index) => {
            // let achievementProgress = parseInt(sys.localStorage.getItem(achievement.id) || '0', 10);
            let achievementProgress = achievement.progress;
            let progressRatio = achievementProgress / achievement.requiredSuccesses;
            //this.progressBars[index].progress = Math.min(progressRatio, 1); // 确保不超过100%
            this.progressBars[index].fillRange = Math.min(progressRatio, 1);

            
            let button = this.buttons[index];

            // // 按钮点击事件
            // button.node.on('click', () => {
            //     if (button.interactable) {
            //         // 检查是否在微信小程序环境中
            //         if (typeof wx !== 'undefined') {
            //             wx.shareAppMessage({
            //                 title: '来看看我在游戏中解锁的成就吧！',
            //                 imageUrl: '', // 分享图片的URL
            //                 query: '', // 如果需要在链接中添加查询字符串
            //             });
            //         } else {
            //             console.warn('微信分享API在当前环境中不可用。');
            //         }
            //     }
            // });




            this.animalname[index].string = achievement.name;
            let sprite = button.getComponent(Sprite);
            this.achieveLabels[index].string = achievement.description;
            let avatarSprite = this.avatars[index];
        
            if (achievementProgress >= achievement.requiredSuccesses) {
                button.interactable = true;
                this.buttonLabels[index].string = "分享";
                //this.animalname[index].string = achievement.name;
                //动物头像
                avatarSprite.spriteFrame = this.avatarImages[`zoo${index+1}_0`];

                if (sprite) {
                    sprite.spriteFrame = this.unlockSpriteFrame; // 更换为已解锁状态的图片
                }
            } else {
                button.interactable = false;

                this.buttonLabels[index].string = "未解锁";
                //this.animalname[index].string = `???`
                if (sprite) {
                    sprite.spriteFrame = this.lockSpriteFrame; // 更换为未解锁状态的图片
                }

                //动物头像
                let imgspriteFrame = this.avatarImages[`zoo${index+1}_1`];
                if (!imgspriteFrame) {
                    console.warn(`SpriteFrame with key zoo${index+1}_1 not found.`);
                } else {
                    avatarSprite.spriteFrame = imgspriteFrame;
                }

            }

            if (button.interactable) { // 如果按钮可交互
                button.node.on('click', () => {

                    this.achievetimu.string = achievement.name;
                    //this.achievemiaoshu.string = achievement.description;
                    //this.achievemiaoshu.string =  `恭喜您完成了${achievement.threshold}%, 获得了${achievement.name}的称号`
                    this.achievemiaoshu.string = `恭喜您完成了${achievement.threshold}%, 获得了${achievement.name}的称号`.replace(/,/, ',\n');
                    this.achievetouxiang.getComponent(Sprite).spriteFrame = this.avatarImages[`zoo${index+1}_0`];
                    this.achievemianban.active=true
                    this.showMask(this.maskLayer);
                    this.imgUrls = this.achieveUrls[index];
                    this.imgtitles = `我完成了${achievement.threshold}%, 荣获${achievement.name}称号, 你也来试试? `;

                    // // 在微信环境中并且按钮是可交互的，尝试分享
                    // if (this.isWX) { // 假设 this.isWX 能正确判断是否在微信环境中
                    //     this.sharefriend(() => {
                    //         console.log("分享成功");
                    //     });
                    // }
                });
            }


        });
    }

    //返回按钮
    back(){
        director.loadScene("mainscene");
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

    closechengjiu(){
        //this.node.getChildByName('achievemianban').active = false;
        this.achievemianban.active =false;
        this.maskLayer.active =false;
    }

    sharechengjiu(){
        this.sharefriend(() => {
            // 分享完成的回调
            this.closechengjiu()
        });
    }

    // sharefriend(call) {
    //     if (typeof (this.wx) == "undefined") return;
    
    //     this.wx.shareAppMessage({
    //         title: this.imgtitles,  // 分享内容的标题
    //         imageUrl: this.imgUrls
    //     });
    
    //     // 确保call是一个函数再调用它
    //     if (typeof call === "function") {
    //         call();
    //     }
    // }

    //增加抖音和微信
    sharefriend(call) {
        // 微信环境的分享
        if (typeof (this.wx) !== "undefined" && this.isWX) {
            this.wx.shareAppMessage({
                title: this.imgtitles, // 分享内容的标题
                imageUrl: this.imgUrls // 分享的图片URL
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
                imageUrl: this.imgUrls, // 分享的图片URL
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
    
    
}


