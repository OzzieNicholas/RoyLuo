import { _decorator, Component, Node, Prefab, instantiate, resources, Sprite, SpriteFrame, Color, EventTouch, input, Input, UITransform, Size, color, Vec3, Vec2, tween, Label, JsonAsset, log, director, find, AudioClip, AudioSource, BlockInputEvents, ProgressBar, macro, PolygonCollider2D, LabelOutline, sys, Button } from 'cc';
import { block } from './block';
import { gameData } from './gameData';
import { AudioController } from './AudioController';
import { VibrationManager } from './VibrationManager';
import UserSettings from './UserSettings';
import { ResourceManager } from './ResourceManager';
import { GameManager } from './GameManager';
import { gameEvents } from './gameEvents';
import { Guide } from './Guide';
const { ccclass, property } = _decorator;

declare var ks: any;

@ccclass('sheepgame')
export class sheepgame extends Component {
    @property({type:Prefab})
    preBlock = null;

    @property({type:Node})
    parentBlocks = null;

    @property({type:Node})
    parentBlocksDi = null;

    @property({type:Node})
    GameOver = null;

    @property({type:Node})
    GameWin = null; //游戏胜利页面

    //遮挡，背景变灰
    @property({type:Node})
    zhedang = null; //游戏胜利页面

    @property({type:Node})
    layerOver = null;

    @property({type:Label})
    labelLevel = null;   

    @property({type: Label})
    labelTimer: Label = null; // 倒计时显示标签

    @property(Label)
    labelBossHealth: Label = null;

    @property(Label)
    nextLevelLabel: Label = null; // 通过编辑器关联Label节点

    @property(Sprite)
    spriteBossHealthBar: Sprite = null;

    @property(Sprite)
    spriteBossHealthBarDecrease: Sprite = null

    @property(Sprite)
    bossSprite: Sprite = null;

    @property({type:Node})
    image1 = null;
    @property({type:Node})
    image2 = null;

    @property({type: AudioSource})
    touchaudio = null

    @property({type: AudioSource})
    combine = null

    // //加
    // @property({type: AudioClip})
    // audioClip = null;

    @property({type: AudioSource})
    toboss = null

    @property({type:[Label]})
    arrLabelDJ = [];

    @property(ProgressBar)
    proBar: ProgressBar | null = null;

    @property(ProgressBar)
    progressBar: ProgressBar | null = null;
    @property(Label)
    loadingLabel: Label | null = null;
    loadingOver=false;
    @property({type:Node})
    loading = null;

    //道具激活页面
    @property({type:Node})
    b1 = null;

    @property({type:Node})
    b2 = null;

    @property({type:Node})
    b3 = null;

    @property({type:Node})
    b4 = null;

    @property({type:Node})
    b5 = null;

    @property(Node)
    btn5 = null; 

    @property(Node)
    public maskLayer: Node = null;

    //透明mask,用于boss打败，场景移动时
    @property(Node)
    public toumingmask: Node = null;

    //更深颜色，用于加载第二关
    @property(Node)
    public deepmaskLayer: Node = null;

    @property({type:[Label]})
    bLabelDJ = [];

    @property({type: Label})
    jiesuan: Label = null; // 倒计时显示标签

    timeLeft: number; // 倒计时时间，这里假设是60秒

    arrPosLevel:any[];
    numLevel: number=0;
    numTouchStart: number;
    numTouchEnd: number;
    xxStartDi: number;
    gameData: gameData;
    gameType: number;

    //新增
    gameConfig: any = null; // 存储游戏配置
    bossHealth: number;
    bossMaxHealth: number;
    isPaused: boolean;
    bossHealths: { health: any; image: any; }[];
    totalBosses: any;
    currentBossIndex: number;
    initialImage1Y: any;
    initialImage2Y: any;
    totalSlideDistance: any;
    cageSpriteFrames: any;
    longziImage: SpriteFrame;
    pileCardCounts: {};
    arrNumDJ: number[];
    bossspriteFrame: any[];
    bossProcessSprites: {};
    previousBossState: string;
    bossDefeated: boolean;
    //调试模式
    isDebugMode: boolean = false;


    private audioController: AudioController;
    //private audioController: AudioController | null = null;
    private musicFlag: boolean = true;
    private soundFlag: boolean = true;
    vibrationFlag: boolean = true; // 震动功能是否开启的标志位，默认开启

    // 声明背景音乐和声音效果的按钮Sprite，确保已经将这些属性与编辑器中的相应组件关联
    @property(Sprite)
    musicButtonSprite: Sprite = null;

    @property(Sprite)
    soundButtonSprite: Sprite = null;

    @property(SpriteFrame)
    musicOnSprite: SpriteFrame = null;

    @property(SpriteFrame)
    musicOffSprite: SpriteFrame = null;

    @property(SpriteFrame)
    soundOnSprite: SpriteFrame = null;

    @property(SpriteFrame)
    soundOffSprite: SpriteFrame = null;

    @property(Sprite)
    vibrationButtonSprite: Sprite = null; // 震动按钮的Sprite组件引用

    @property(SpriteFrame)
    vibrationOnSprite: SpriteFrame = null; // 震动开启时的图片

    @property(SpriteFrame)
    vibrationOffSprite: SpriteFrame = null; // 震动关闭时的图片

    //游戏中声音设置
    @property(Node)
    soundSetting: Node = null;

     //成就面板
     @property(Node)
     achievemianban: Node = null;
     @property({type: Label})
     achievetimu: Label = null; 
     @property({type: Label})
     achievemiaoshu: Label = null; 
     @property(Node)
     achievetouxiang: Node = null; 


    alldamage: number;
    allBossHealth: any;
    achievementsConfig: any;
    globalCardId: number;
    buttonsEnabled: boolean;
    wx: any;
    isWX: boolean;
    videoAd: any;
    numDJ: number;
    lastActionType: string;
    actionRequired: boolean;
    videoAdCallback: any;
    adLoaded: boolean;
    isAdWatchedCompletely: boolean;
    currentPhaseIndex: any;
    attacksInCurrentPhase: number;
    achievementImages: any[];
    currentAchievement: any;
    imageNode: Node;
    achieveUrls: any;
    lastCheckedDamageRatio: number=0;
    nextAchievementIndex: number=0;
    AchievementThresholds: number[];
    rm: ResourceManager;
    isLoaded: boolean=false;tt: any;
    isTT: boolean;
    cardCounts: any;
    currentLayerIndex: number;
    addcardlevel: number;
    isKS: boolean;
    static eventTarget: any;

    
    async onLoad() {
        console.log('开始加载所有资源和初始化');
        // 等待所有需要的资源加载完成
        await this.initializeBasicData();
        await this.loadAndInitGameConfig();
        // 初始化游戏逻辑
        await this.initGame();
        // 刷新关卡信息
        //this.shuaXinLevelInfo();

        await this.createBlock();
        //console.log(this.node.getChildByName('parentBlocks').children[6])
        // let guidComponent = this.node.getComponent(Guide);
        // if (guidComponent) {
        //     guidComponent.initializeAfterSheepGame();
        // }
        
        // 初始化音乐和震动设置
        this.initAudioAndVibration();


        if (this.isTT){
            // 初始化douyin激励视频广告
            this.initdouyinJiLiShiPin();
            console.log("初始化抖音广告")
        }else if (this.isKS){
            this.initKuaiShouJiLiShiPin()
            console.log("初始化快手广告")
        }

          // 初始化广告逻辑
        if (this.isWX) {
            this.initJiLiShiPin();
            console.log("初始化微信广告")

            const titles = [
                "动物园发生越狱事件？！看看咋回事...",
                "差一点点就能成功！帮帮我，一起玩！",
                "这款AI游戏居然能这么上头...想试试吗？",
                "居然有99%的人都无法通关？你能玩到哪？",
                "这款游戏居然让我室友玩到凌晨三点！你也来看看",
                "来帮助小动物们逃离铁笼吧！"
            ];

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
        
            // 随机选择一个标题
            const title = titles[Math.floor(Math.random() * titles.length)];
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
    
        // 挂载事件监听器
        this.attachEventListeners();

        //onload执行完的标志
        this.isLoaded = true;

        // 检查本地存储中的状态，新手引导
        let hasExecuted = sys.localStorage.getItem("hasExecutedAfterSheepGame");
        if (!hasExecuted) {
            let guidComponent = this.node.getChildByName('maskNode').getComponent(Guide);
            if (guidComponent) {
                guidComponent.initializeAfterSheepGame();
                sys.localStorage.setItem("hasExecutedAfterSheepGame", "true"); // 记录已执行
            }

        }


        // let guidComponent = this.node.getChildByName('maskNode').getComponent(Guide);
        // if (guidComponent) {
        //     guidComponent.initializeAfterSheepGame();
        // }

        if ( this.numLevel==0){
            this.imageNode = this.node.getChildByName('xiaochuNode');
            // 确保图片节点在开始时是可见的
            this.imageNode.active = true;

            // 安排在两秒后执行关闭图片节点的操作
            this.scheduleOnce(() => {
                this.imageNode.active = false;
            }, 2);
        }

        if (GameManager.instance.lingqu){
            this.numDJ = Math.floor(Math.random() * 3); // 假设有4种道具，随机选择一个

            // 根据选择的道具增加数量
            if (this.numDJ === 0) {
                // 道具1的逻辑
                this.incrementItem(0);
            } else if (this.numDJ === 1) {
                // 道具2的逻辑
                this.incrementItem(1);
            } else if (this.numDJ === 2) {
                // 道具3的逻辑
                this.incrementItem(2);
            }
            this.shuaXinDJ(); // 更新道具的显示
            GameManager.instance.lingqu = false;
        }

        if (this.isWX){
            this.wx.onHide(() => {
                // 假设你已经在某个地方实例化了 GameEvents，或者它是全局可访问的
                gameEvents.instance.logout();
              });
        }

    }

    async initializeBasicData(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.xxStartDi = -280;
            this.gameData = this.node.getComponent(gameData);
            this.gameType = 0;
            this.numTouchStart = -1;
            this.numTouchEnd = -1;
            this.layerOver.active = false;
            this.isPaused = false;
            this.previousBossState = "none";
            this.bossDefeated = false;
            this.soundSetting.active = false;
            this.alldamage = 0;
            this.globalCardId = 0;
            this.loading.active = false;
            this.buttonsEnabled = true;
            this.maskLayer.active = false;
            this.toumingmask.active = false;
            this.attacksInCurrentPhase = 0;
            this.currentPhaseIndex = 0;
            this.numDJ = -1;
            this.wx = window['wx'];

            this.tt = window['tt'];

            if (sys.platform == sys.Platform.WECHAT_GAME) {
                this.isWX = true;
                this.isTT = false;
                this.isKS = false;
    
            } else if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
                this.isTT = true;
                this.isWX = false;
                this.isKS = false;
            } else if (this.isKS){
                //快手还没有上线平台
                this.isTT = false;
                this.isWX = false;
                this.isKS = true;
            }

            this.videoAd = null;
            this.lastActionType = 'ad';
            this.adLoaded = false;
            this.actionRequired = true;
            this.isAdWatchedCompletely = null;
            this.nextLevelLabel.node.active = false;
            // 初始化当前成就状态
            this.currentAchievement = null;
            this.achievemianban.active =false;

            // 游戏开始时，同步nextAchievementIndex
            this.AchievementThresholds=[20,30,35,40,45,50,55,60,65,70,75,80,85,90,93,96,98,100]
           
            this.rm = ResourceManager.instance;
            this.bossspriteFrame = this.rm.bossspriteFrame; 
            this.achievementImages=this.rm.achievementImages;
            this.bossProcessSprites = this.rm.bossProcessSprites;

            this.longziImage = this.rm.longziImage;
            this.allBossHealth =this.rm.allBossHealth;
            this.achievementsConfig = this.rm.achievementsConfig;
            this.addcardlevel=124;

            //ldx,记录消除次数
            gameEvents.instance.resetElimination();

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
            resolve();
        });
    }

    async loadAndInitGameConfig(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                resources.load("json/config", JsonAsset, (err, asset) => {
                    if (err) {
                        reject(err);
                    } else {
                        // 显式地告诉TypeScript asset是一个JsonAsset，这样我们就可以访问其.json属性了。
                        let assetjson=JSON.parse(JSON.stringify(asset.json));
                        this.gameConfig = assetjson;
                        this.timeLeft = this.gameConfig.time;
                        
                        let minutes = Math.floor(this.timeLeft / 60);
                        let seconds = Math.ceil(this.timeLeft % 60);
                        if (seconds === 60) {
                            minutes += 1;
                            seconds = 0;
                        }
                
                        // 格式化字符串，确保秒数为两位数
                        let formattedTime = `倒 计 时: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
                        this.labelTimer.string = formattedTime;

                        if(this.numLevel==0){
                            this.arrNumDJ = this.gameConfig.arrNumDJ; 
                            for (let i=0;i<4;i++){
                                this.bLabelDJ[i].string=`(3/3)`
                            }
                
                            for (let j=0;j<4;j++){
                                this.arrLabelDJ[j].string = '+'
                            }
                        }
                        resolve();
                    }
                });
                // 这里使用类型断言，告诉TypeScript我们确信这里得到的是JsonAsset类型
            } catch (error) {
                console.error("Failed to load config.json", error);
            }
        });
    }

    initAudioAndVibration() {
        let bgmNode = find('BGMNode');
        if (bgmNode) {
            this.audioController = bgmNode.getComponent(AudioController);
            this.musicFlag = this.audioController.musicIsOn;
            this.soundFlag = this.audioController.soundEffectsIsOn;
        } else {
            console.error("BGMNode not found");
        }
    
        if (VibrationManager.instance) {
            this.vibrationFlag = VibrationManager.instance.vibrationEnabled;
        } else {
            console.error("VibrationManager not found");
        }
    
        this.updateButtonVisuals();
    }

    //用
    async loadAllRequiredResources(): Promise<void> {
        if (!this.gameConfig) {
            await this.loadAndInitGameConfig();
        }
    
        // 首先处理所有boss的图片加载
        const levelTwoConfig = this.gameConfig.boss.level_two;
        this.allBossHealth = levelTwoConfig.bosses.reduce((total, boss) => total + boss.health, 0) + 100;
        this.achievementsConfig = this.gameConfig.achievements;
    
        // 准备加载boss图片资源的Promises数组
        let bossImagePromises = levelTwoConfig.bosses.map(boss => new Promise((resolve, reject) => {
            resources.load(boss.image, SpriteFrame, (err, spriteFrame) => {
                if (!err) {
                    resolve(spriteFrame);
                } else {
                    reject("Failed to load boss image: " + err);
                }
            });
        }));
    
        // 加载成就图片的Promises数组
        let achievementImagePromises = [];
        for (let i = 1; i <= 18; i++) {
            const imagePath = `achieve/zoo${i}_0/spriteFrame`;
            achievementImagePromises.push(new Promise((resolve, reject) => {
                resources.load(imagePath, SpriteFrame, (err, spriteFrame) => {
                    if (!err) {
                        resolve({ index: i, spriteFrame });
                    } else {
                        reject("Failed to load achievement image: " + err);
                    }
                });
            }));
        }

        // 开始处理bossProcessSprites的加载
        this.bossProcessSprites = {}; // 用于存储预加载的spriteFrame资源
        const totalImageSets = 3; // 可用的不同图片资源总数
        const repeatsPerSet = 2; // 每组图片的重复次数
        let bossProcessSpritePromises = [];

        for (let set = 0; set < totalImageSets; set++) {
            for (let repeat = 0; repeat < repeatsPerSet; repeat++) {
                for (let j = 1; j <= 2; j++) {
                    let bossImage = `img/boss${set}_${j}/spriteFrame`;

                    // 创建一个新的Promise并添加到数组中
                    bossProcessSpritePromises.push(new Promise((resolve, reject) => {
                        resources.load(bossImage, SpriteFrame, (err, spriteFrame) => {
                            if (!err) {
                                resolve({ key: `boss${set * repeatsPerSet + repeat}_${j}`, spriteFrame });
                            } else {
                                reject("Failed to load boss process sprite image: " + err);
                            }
                        });
                    }));
                }
            }
        }
        // 示例：加载笼子图片
        let cageImagePromise = new Promise<SpriteFrame>((resolve, reject) => {
            resources.load(this.gameConfig.cages[0].image, SpriteFrame, (err, spriteFrame) => {
                if (!err) {
                    resolve(spriteFrame as SpriteFrame); // 使用类型断言确保spriteFrame为SpriteFrame类型
                } else {
                    reject(`Failed to load cage image from ${this.gameConfig.cages[0].image}: ` + err);
                }
            });
        });
    
        // 等待所有图片资源加载完成
        try {
            this.bossspriteFrame = await Promise.all(bossImagePromises);
            let achievementImagesResults = await Promise.all(achievementImagePromises);
            this.achievementImages = [];
            achievementImagesResults.forEach(result => {
                this.achievementImages[result.index] = result.spriteFrame;
            });

            let loadedSprites = await Promise.all(bossProcessSpritePromises);

            // 遍历加载结果并赋值
            loadedSprites.forEach(item => {
                this.bossProcessSprites[item.key] = item.spriteFrame;
            });

            this.longziImage = await cageImagePromise;
        } catch (error) {
            console.error(error);
        }
    }
    

    attachEventListeners() {
        input.on(Input.EventType.TOUCH_START,this.onTouchStart,this);
        input.on(Input.EventType.TOUCH_MOVE,this.onTouchMove,this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }


    //初始化微信激励视频广告
    initJiLiShiPin() {
        if (!this.videoAd) {
            this.videoAd = this.wx.createRewardedVideoAd({
                adUnitId: 'adunit-9e15362a54c58d64'
            });

            this.videoAd.onLoad(() => {
                console.log('激励视频广告加载成功');
            });

            this.videoAd.onError(err => {
                console.log(err);
            });

            // 移动 onClose 监听器绑定到这里，确保只绑定一次
            this.videoAd.onClose(res => {
               
                // 判断是否正常播放结束
                if (res && res.isEnded || res === undefined) {
                    console.log('激励视频观看完毕');
                    // 如果有设置回调函数，则调用之，并传递 true 表示正常结束

                    this.isAdWatchedCompletely=true
                    this.videoAdCallback && this.videoAdCallback(true);
                } else {
                    console.log('激励视频未观看完毕');
                    // 如果有设置回调函数，则调用之，并传递 false 表示未正常结束
                    this.isAdWatchedCompletely=false
                    this.videoAdCallback && this.videoAdCallback(false);
                }
                // 在广告关闭后清除回调函数引用
                this.videoAdCallback = null;

                if (this.audioController && this.musicFlag) {
                    this.audioController.toggleBGM(true); // 根据用户设置恢复音乐
                }
            });
        }
    }

    //初始化抖音激励视频
    initdouyinJiLiShiPin() {
        this.videoAd = window['tt'].createRewardedVideoAd({
          adUnitId:"2js1vsbb4lp55sasu3" // 替换为你的广告单元 ID
        });
    
        // 监听广告加载错误
        this.videoAd.onError((err) => {
          console.log('抖音激励视频广告加载失败', err);
        });
    
        // 监听视频播放完成
        this.videoAd.onClose((res) => {
          window['tt'].hideLoading(); // 隐藏加载指示器
    
          if (res.isEnded) {
            console.log('抖音激励视频观看完毕');
            this.isAdWatchedCompletely = true;
            this.videoAdCallback && this.videoAdCallback(true);
          } else {
            console.log('抖音激励视频未观看完毕');
            this.isAdWatchedCompletely = false;
            this.videoAdCallback && this.videoAdCallback(false);
          }
    
          // 在广告关闭后清除回调函数引用
          this.videoAdCallback = null;
    
          if (this.audioController && this.musicFlag) {
            this.audioController.toggleBGM(true); // 根据用户设置恢复音乐
          }
        });
    
        // 预加载视频资源
        this.videoAd.load();
      }

    // 快手激励视频广告初始化和展示函数
    initKuaiShouJiLiShiPin() {
        let param = {
            adUnitId: "从平台获取的广告id",  // 替换为从快手广告平台获取的实际广告ID
            multiton: false,                 // 启用多实例
            //multitonRewardMsg: ['更多奖励1'],
            //multitonRewardTimes: 1,
            progressTip: false
        };

        let rewardedVideoAd = ks.createRewardedVideoAd(param);
        this.videoAd = ks.createRewardedVideoAd(param);

        if (rewardedVideoAd) {
            // 绑定广告关闭事件
            rewardedVideoAd.onClose(res => {
                if (res && res.isEnded) {
                    console.log('快手激励视频观看完毕');
                    // 正常播放结束，可以下发游戏奖励
                    this.isAdWatchedCompletely = true;
                    this.videoAdCallback && this.videoAdCallback(true);
                } else {
                    console.log('快手激励视频未观看完毕');
                    // 播放中途退出，不下发游戏奖励
                    this.isAdWatchedCompletely = false;
                    this.videoAdCallback && this.videoAdCallback(false);
                }
                // 在广告关闭后清除回调函数引用
                this.videoAdCallback = null;

                if (this.audioController && this.musicFlag) {
                    this.audioController.toggleBGM(true); // 根据用户设置恢复音乐
                }
            });

            // 绑定错误事件
            rewardedVideoAd.onError(res => {
                console.error('激励视频广告Error事件:', res);
            });

            //预加载
            this.videoAd.load();

            // 尝试展示激励视频
            let p = rewardedVideoAd.show();
            p.then(result => {
                console.log(`show rewarded video ad success, result is ${result}`);
            }).catch(error => {
                console.log(`show rewarded video ad failed, error is ${error}`);
            });
        } else {
            console.log("创建激励视频组件失败");
        }
    }


    // 播放douyin激励视频广告
    showdouyinJiLiShiPin(callback) {
        this.videoAdCallback = callback;

        if (this.audioController && this.musicFlag) {
        this.audioController.toggleBGM(false);
        }

        window['tt'].showLoading({
        title: '加载中'
        });

        this.videoAd.show().catch((err) => {
        console.error('激励视频广告显示失败', err);
        window['tt'].hideLoading();

        this.videoAd.load().then(() => {
            this.videoAd.show().catch((err) => {
            console.error('激励视频广告再次显示失败', err);
            callback && callback(false);
            });
        });
        });
    }

    //播放激励视频广告
    showJiLiShiPin(callback) {
        // 存储回调函数以便 onClose 事件处理器使用
        this.videoAdCallback = callback;

        if (!this.videoAd) {
            console.log("激励视频未加载成功");
            callback && callback(false);
            return;
        }

          // 暂停背景音乐
          if (this.audioController && this.musicFlag) {
            this.audioController.toggleBGM(false); // 暂时关闭音乐
        }

        // 显示激励视频广告
        this.videoAd.show().catch(err => {
            console.error('激励视频广告显示失败', err);
            // 失败重试，先尝试重新加载广告
            this.videoAd.load().then(() => this.videoAd.show())
            .catch(err => {
                console.error('激励视频广告再次显示失败', err);
                callback && callback(false);
            });
        });
    }

    // 快手激励视频广告展示函数
    showkuaishouJiLiShiPin(callback: (isCompleted: boolean) => void) {
        // 存储回调函数以便 onClose 事件处理器使用
        this.videoAdCallback = callback;

        if (!this.videoAd) {
            console.log("激励视频未加载成功");
            callback && callback(false);
            return;
        }

        // 暂停背景音乐
        if (this.audioController && this.musicFlag) {
            this.audioController.toggleBGM(false); // 暂时关闭音乐
        }

        // 尝试展示激励视频广告
        this.videoAd.show().then(() => {
            console.log('激励视频广告显示成功');
        }).catch(err => {
            console.error('激励视频广告显示失败', err);
            // 失败重试，先尝试重新加载广告
            this.videoAd.load().then(() => {
                return this.videoAd.show();
            }).catch(err => {
                console.error('激励视频广告再次显示失败', err);
                callback && callback(false);
                // 恢复背景音乐
                if (this.audioController && this.musicFlag) {
                    this.audioController.toggleBGM(true);
                }
            });
        });
    }

    
    //暂时不用
    // shuaXinLevelInfo(){
    //     let num_level = this.numLevel +1
    //     this.labelLevel.string = '第' + num_level +'关'
    // }

    //刷新道具
    shuaXinDJ(){
        for (let i = 0;i< this.arrLabelDJ.length;i++)
        {
           
            if (i< this.arrLabelDJ.length){
                this.bLabelDJ[i].string = `(${this.arrNumDJ[i]}/${3})`
            }

            if (this.arrNumDJ[0] == 0 && this.arrLabelDJ[0].string==`+`){
                let b1=this.node.getChildByName("btn_1").getComponent(Sprite)
                b1.color = new Color (128, 128, 128)
                let b1_sprite = this.node.getChildByName("btn_1").getChildByName("Sprite").getComponent(Sprite);
                b1_sprite.color = new Color (128, 128, 128)
                let btnComponent = this.node.getChildByName("btn_1").getComponent(Button);
                // 设置按钮为不可点击
                btnComponent.interactable = false;
            }
            if (this.arrNumDJ[1] == 0 && this.arrLabelDJ[1].string==`+`){
                let b2=this.node.getChildByName("btn_2").getComponent(Sprite)
                b2.color = new Color (128, 128, 128)
                let b2_sprite = this.node.getChildByName("btn_2").getChildByName("Sprite").getComponent(Sprite);
                b2_sprite.color = new Color (128, 128, 128)
                let btnComponent = this.node.getChildByName("btn_2").getComponent(Button);
                // 设置按钮为不可点击
                btnComponent.interactable = false;
            }
            if (this.arrNumDJ[2] == 0 && this.arrLabelDJ[2].string==`+`){
                let b3=this.node.getChildByName("btn_3").getComponent(Sprite)
                b3.color = new Color (128, 128, 128)
                let b3_sprite = this.node.getChildByName("btn_3").getChildByName("Sprite").getComponent(Sprite);
                b3_sprite.color = new Color (128, 128, 128)

                let btnComponent = this.node.getChildByName("btn_3").getComponent(Button);
                // 设置按钮为不可点击
                btnComponent.interactable = false;
            }
            if (this.arrNumDJ[3] == 0 && this.arrLabelDJ[3].string==`+`){
                let b4=this.node.getChildByName("layerOver").getChildByName("btn_fh").getComponent(Sprite)
                b4.color = new Color (128, 128, 128)
                let b4_sprite = this.node.getChildByName("layerOver").getChildByName("btn_fh").getChildByName("Sprite").getComponent(Sprite);
                b4_sprite.color = new Color (128, 128, 128)

                let btnComponent = this.node.getChildByName("layerOver").getChildByName("btn_fh").getComponent(Button);
                // 设置按钮为不可点击
                btnComponent.interactable = false;
            }
        }
    }

    update(deltaTime: number) {
        //onload还没执行完也不走秒
        if (this.gameType === -1 || this.gameType === 1 || this.isPaused || !this.isLoaded) {
            // 游戏失败或暂停时不继续计时
            return;
        }
    
        if (this.timeLeft > 0) {
            this.timeLeft -= deltaTime;
    
            // 计算剩余的分钟和秒数
            let minutes = Math.floor(this.timeLeft / 60);
            let seconds = Math.floor(this.timeLeft % 60);
    
            // 当秒数为60时，应调整分钟和秒数以避免显示成 x:60
            if (seconds === 60) {
                minutes += 1;
                seconds = 0;
            }
    
            // 格式化字符串，确保秒数为两位数
            let formattedTime = `倒 计 时: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    
            this.labelTimer.string = formattedTime;
        } else if (this.timeLeft <= 0) {
            // 倒计时结束，执行游戏结束逻辑
            this.labelTimer.string = `倒 计 时: 0:00`;
            this.timeLeft = 0;
            console.log('Time Up! Game Over.');
    
            this.gameType = -1;

            this.isPaused = true;
            console.log('游戏失败');
            this.scheduleOnce(() => {
                //const damageRatio = Math.round((this.alldamage / this.allBossHealth) * 100);
                const damageRatio = parseFloat((this.alldamage / this.allBossHealth * 100).toFixed(2));
                this.jiesuan.string =  `你已完成${damageRatio}%的进度`
                this.layerOver.active = true; // 确保这里的this指向的是组件实例
                this.showMask(this.toumingmask)
                //ldx,失败消除次数
                gameEvents.instance.dieEliminations()
            }, 0.5);
        }
    }
    

    onTouchStart(event:EventTouch){

        if (this.gameType !=0){
            return
        }
        if (this.pdBlockDiMoving()){
            return
        }
        this.numTouchStart=-1;
        let v2_touchStart=event.getUILocation();
        let v3_touchStart = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchStart.x,v2_touchStart.y,0))

        let children = this.parentBlocks.children
        

        for (let i=children.length-1;i>=0;i--){
            let ts_block = children[i].getComponent(block)
            //增
            if (!ts_block) {
                continue;
            }    

            if (ts_block.can_touch==false){
                continue
            }

            let node_UITransform = children[i].getComponent(UITransform)
            if (node_UITransform.getBoundingBox().contains(new Vec2(v3_touchStart.x,v3_touchStart.y))){
                this.numTouchStart=i
                
                if (this.soundFlag) {
                    // 播放选中卡牌的音效
                    this.touchaudio.play();

                }

                //动画放大
                tween(children[i])
                    .to(0.1,{scale:new Vec3(1.2,1.2,1.2)})
                    .start()
                break;
                    
            }
            
        }
    }

    onTouchMove(event:EventTouch){
        console.log('onTouchMove')
    }

    onTouchEnd(event:EventTouch){
        if (this.gameType !=0){
            return
        }
        if (this.pdBlockDiMoving()){
            return
        }
        
        let v2_touchStart = event.getUILocation()
        let v3_touchStart = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchStart.x,v2_touchStart.y,0))

        let children = this.parentBlocks.children
        for (let i = children.length-1; i >= 0; i--) {
            let ts_block = children[i].getComponent(block)

            //增
            if (!ts_block) {
                continue;
            }    


            if (ts_block.canTouch == false) {
                continue
            }

            let node_UITransform = children[i].getComponent(UITransform)
            if (node_UITransform.getBoundingBox().contains(new Vec2(v3_touchStart.x,v3_touchStart.y))) {
                this.numTouchEnd = i
    
                if (this.numTouchStart == this.numTouchEnd) {
                    let ts_block_1 = children[i].getComponent(block)
                    let block_type = ts_block_1.blockType

                    // // 检查是否点击的卡牌有pileId
                    if (ts_block.pileId) {
                        this.handleCardSlideOut(ts_block.pileId);
                        this.addcardlevel--;
                    }
                    
                    this.createBlockToBi(block_type,children[i].getPosition())
                    children[i].removeFromParent()
                    console.log(i)

                    //this.updateOverlapOnRemoval(ts_block_1)

                    if (this.numLevel === 1){
                         //增
                        //产生一个卡牌
                        if (this.currentLayerIndex >=0){
                            this.generateCardInRandomArea(this.currentLayerIndex);
                            // 如果当前层生成的卡牌数已达或超过该层允许的最大数，应更新到下一层
                            if (this.cardCounts[this.currentLayerIndex].count >= this.cardCounts[this.currentLayerIndex].max) {
                                this.currentLayerIndex--;
                                console.log(this.currentLayerIndex)
                            }
                        }

                        this.updateOverlapOnRemoval(ts_block_1)
                        
                        // 如果当前层生成的卡牌数已达或超过该层允许的最大数，应更新到下一层
                        // if (this.cardCounts[this.currentLayerIndex].count >= this.cardCounts[this.currentLayerIndex].max) {
                        //     this.currentLayerIndex--;
                        //     // if (this.currentLayerIndex < 0) {
                        //     //     this.currentLayerIndex = 0; // 确保不会出现越界
                        //     // }
                        // }
                    }else{
                        this.updateOverlapOnRemoval(ts_block_1)
                    }

                    //this.overlap()
                    break
                }
           }
        }

        if (this.numTouchStart != -1) {
            tween(children[this.numTouchStart])
                .to(0.1,{scale:new Vec3(1,1,1)})
                .start()
        }

        let children_1 = this.parentBlocks.children

        if (children_1.length ==0){
            this.gameType =1
            console.log('游戏通关');
            this.numLevel++
            // 显示并开始飘字动画
            this.GameOver.active=true;

        }  
        
    }


    //生成一个卡牌
    generateCardInRandomArea(layerIndex) {
        const layerConfig = this.gameConfig.layers[layerIndex];
        const type = this.getRandomTypeExcluding(layerConfig.aList);

        const halfSideLength = layerConfig.sideLength / 2;
        const randomArea = {
            minX: -halfSideLength,
            maxX: halfSideLength,
            minY: -halfSideLength,
            maxY: halfSideLength
        };

        let x = Math.random() * (randomArea.maxX - randomArea.minX + 1) + randomArea.minX;
        let y = Math.random() * (randomArea.maxY - randomArea.minY + 1) + randomArea.minY;

        const node_block = instantiate(this.preBlock);
        node_block.setPosition(x, y, 0); // 设置卡牌位置

        const ts_block = node_block.getComponent('block'); // 获取卡牌组件
    
        ts_block.id = this.globalCardId++; // 分配ID并自增计数器

        ts_block.damageConfig = this.gameConfig; // 设置卡牌配置
        ts_block.blockType = type; // 设置卡牌类型
        ts_block.init(ts_block.blockType); // 初始化卡牌
    
        // 更新当前层的卡牌生成计数
        this.cardCounts[layerIndex].count++;
        this.parentBlocks.insertChild(node_block, this.addcardlevel); // 插入到子节点列表的最前面
        //this.parentBlocks.insertChild(node_block, 0);
        this.updateAddition(node_block.getComponent(block));
    }

    handleCardSlideOut(pileId) {
        // 遍历gameConfig.fixedCardPiles来找到对应的堆
        const targetPile = this.gameConfig.fixedCardPiles.find(pile => pile.pileId === pileId);
    
        if (!targetPile) {
            console.warn('No pile found with the given pileId:', pileId);
            return;
        }
    
        // 筛选属于该堆的卡牌
        const pileCards = this.parentBlocks.children.filter(child => {
            const blockComponent = child.getComponent('block');
            return blockComponent && blockComponent.pileId === pileId;
        });
    
        // 获取当前堆的卡牌数量并找到顶层卡牌
        const currentCount = pileCards.length;
    
        if (currentCount-2 > 0) {

            let topCard = pileCards[currentCount - 2];
            let block = topCard.getComponent('block');
            
            // 确保block组件存在，并检查是否可以点击
            if (block) {
        
                block.coveredBy=[];
                block.canTouch=true;
                block.setTouch(true);
                block.node.getChildByName('yuansu').getComponent(Sprite).color = new Color(255, 255, 255); // 白色，可点击
    
                // 使顶部卡牌滑出
                tween(topCard)
                    .to(0.3, { position: new Vec3(topCard.position.x, topCard.position.y - 40, topCard.position.z) })
                    .start();
            }
        }
    }

    //改算法
    async createBlock() {
        if(!this.gameData.arrTypeLevel){
            this.gameData=this.node.getComponent(gameData);
        }
        // 首先清除上一关的所有卡牌
        this.parentBlocks.removeAllChildren();
        this.parentBlocksDi.removeAllChildren();
        const numbers = Array.from({length: 20}, (_, i) => i);
        let sampledNumbers = this.sample(numbers, this.gameData.arrTypeLevel[this.numLevel]); // 随机抽取数字
    
        if (this.numLevel === 1) {

            if (!this.pileCardCounts) {
                this.pileCardCounts = {};
            }

            this.gameConfig.fixedCardPiles.forEach(pile => {
                let pileKey = `${pile.position.x}_${pile.position.y}`;
                this.pileCardCounts[pileKey] = pile.cards-1;
            });

            //新卡牌滑动
            this.gameConfig.fixedCardPiles.forEach(pile => {
                for (let i = 0; i < pile.cards; i++) {
                    this.generateCardAtFixedPosition(pile.position, i, pile.cards, pile.pileId);
                }
            });
            
            // 生成笼子
            this.loadAndCreateCages();

            //用
            const { layers } = this.gameConfig;
           
            //增
            const initialLayers = layers.slice(-10); // 只取最后四层
            this.cardCounts = layers.map(layer => ({count: 0, max: layer.fi + layer.pi}));
            this.currentLayerIndex = layers.length - 10;
            
            initialLayers.forEach((config, i) => {
                // 计算原始 layers 数组中的索引
                const layerIndex = layers.length - 10 + i;

                // 下面是调用 generateCard 函数时使用的正确索引
                let totalFixedCards = config.fi;
                let fixedTypes = this.sample(config.aList, config.fi_types);

                fixedTypes.forEach(type => {
                    this.generateCard(type, layerIndex, totalFixedCards / fixedTypes.length);
                });

                let totalRandomCards = config.pi;
                for (let j = 0; j < totalRandomCards; j++) {
                    let randomType = this.getRandomTypeExcluding(config.aList);
                    this.generateCard(randomType, layerIndex, 1);
                }
            });
            

            // layers.forEach((config, layerIndex) => {
            //     // 总共需要生成的指定种类卡牌数量
            //     let totalFixedCards = config.fi;
            //     // 随机选取固定种类
            //     let fixedTypes = this.sample(config.aList, config.fi_types);

            //     // 为这一层生成固定种类的卡牌
            //     fixedTypes.forEach(type => {
            //         this.generateCard(type, layerIndex, totalFixedCards / fixedTypes.length);
            //     });

            //     // 为这一层生成随机种类的卡牌
            //     let totalRandomCards = config.pi;
            //     for (let i = 0; i < totalRandomCards; i++) {
            //         let randomType = this.getRandomTypeExcluding(config.aList);
            //         this.generateCard(randomType, layerIndex, 1); // 每次调用只生成1张随机种类的卡牌
            //     }
            // });

        } else if (this.numLevel === 0) {
            for (let i = 0; i < this.gameData.arrPosLevel[this.numLevel].length; i++) {
                const node_block = instantiate(this.preBlock);
                let xx = this.gameData.arrPosLevel[this.numLevel][i].x;
                let yy = this.gameData.arrPosLevel[this.numLevel][i].y;
                node_block.setPosition(xx, yy, 0);
                this.parentBlocks.addChild(node_block);
                const ts_block = node_block.getComponent(block);

                ts_block.id = this.globalCardId++; // 分配ID并自增计数器

                ts_block.damageConfig = this.gameConfig;

                ts_block.blockType = sampledNumbers[i % 3];

                ts_block.init(ts_block.blockType);
            }
        }
        this.overlap();
    }

    selectFixedIndices() {
        if (this.gameConfig.layers.length > 0) {
            let a=this.gameConfig.LevelNum
            // 获取最顶层的固定卡牌种类数量
            const fi_typesTopLayer = this.gameConfig.layers[a-1].fi_types;
    
            // 从最顶层的可选卡牌种类数组中随机选取指定数量的索引
            const aListTopLayer = this.gameConfig.layers[a-1].aList;
            
            const indices = Array.from({length: aListTopLayer.length}, (_, i) => i);
    
            // 随机选取
            let selectedIndices = [];
            for (let i = 0; i < fi_typesTopLayer && i < indices.length; i++) {
                const randomIndex = Math.floor(Math.random() * indices.length);
                selectedIndices.push(indices[randomIndex]);
                indices.splice(randomIndex, 1); // 移除已选的索引
            }
    
            return selectedIndices;
        }
    
        // 如果没有配置或者配置不正确，返回一个空数组
        return [];
    }
    
    sample(array, n) {
        let result = [];
        let shuffled = array.slice();
        let count = Math.min(n, array.length);
    
        for (let i = 0; i < count; i++) {
            let randomIndex = Math.floor(Math.random() * shuffled.length);
            result.push(shuffled[randomIndex]);
            shuffled.splice(randomIndex, 1); // 从数组中移除已选元素，防止重复
        }
    
        return result;
    }

    getRandomTypeExcluding(excludeArray) {
        // 假设TypeNum是全局可访问的，表示总种类数
        let availableTypes = [];
        for (let i = 0; i < this.gameConfig.TypeNum; i++) {
            if (excludeArray.indexOf(i) === -1) {
                availableTypes.push(i);
            }
        }
    
        if (availableTypes.length === 0) {
            return null; // 如果没有可用类型，返回null或适当处理
        }
    
        let randomIndex = Math.floor(Math.random() * availableTypes.length);
        return availableTypes[randomIndex];
    }

    generateCard(type, layerIndex, cardsCount) {
        // 从配置读取层配置
        const layerConfig = this.gameConfig.layers[layerIndex];
        if (!layerConfig) {
            console.error('Layer configuration not found for index:', layerIndex);
            return; // 如果没有找到对应层的配置，则终止函数执行
        }
        // 使用该层配置的正方形边长
        const squareSideLength = layerConfig.sideLength;
        const halfSideLength = squareSideLength / 2;
    
        // 中心固定，计算正方形区域的边界
        const randomArea = {
            minX: -halfSideLength,
            maxX: halfSideLength,
            minY: -halfSideLength,
            maxY: halfSideLength
        };
       
        for (let i = 0; i < cardsCount; i++) {
            // 在配置的正方形区域内随机生成x和y坐标
            let x = Math.random() * (randomArea.maxX - randomArea.minX) + randomArea.minX;
            let y = Math.random() * (randomArea.maxY - randomArea.minY) + randomArea.minY;
    
            const node_block = instantiate(this.preBlock);
            node_block.setPosition(x, y, 0); // 设置卡牌位置
            this.parentBlocks.addChild(node_block); // 将卡牌添加到场景中
    
            const ts_block = node_block.getComponent('block'); // 获取卡牌组件
    
            ts_block.id = this.globalCardId++; // 分配ID并自增计数器
    
            ts_block.damageConfig = this.gameConfig; // 设置卡牌配置
            ts_block.blockType = type; // 设置卡牌类型
            ts_block.init(ts_block.blockType); // 初始化卡牌
        }

        // for (let i = 0; i < cardsCount; i++) {
        //     // 在配置的正方形区域内随机生成x和y坐标
        //     let x = Math.random() * (randomArea.maxX - randomArea.minX + 1) + randomArea.minX;
        //     let y = Math.random() * (randomArea.maxY - randomArea.minY + 1) + randomArea.minY;
        
        //     const node_block = instantiate(this.preBlock);
        //     node_block.setPosition(x, y, 0); // 设置卡牌位置
        //     this.parentBlocks.addChild(node_block); // 将卡牌添加到场景中
        
        //     const ts_block = node_block.getComponent('block'); // 获取卡牌组件
        
        //     ts_block.id = this.globalCardId++; // 分配ID并自增计数器
        
        //     ts_block.damageConfig = this.gameConfig; // 设置卡牌配置
        //     ts_block.blockType = type; // 设置卡牌类型
        //     ts_block.init(ts_block.blockType); // 初始化卡牌
        // }
    }
    

    loadAndCreateCages() {
        const cagesInfo = this.gameConfig.cages; // 从配置获取笼子信息
        cagesInfo.forEach(cageInfo => {

                // 创建新的笼子节点
                let node_cage = new Node('Cage');
                let sprite = node_cage.addComponent(Sprite);
                sprite.spriteFrame = this.longziImage;

                // 设置笼子位置
                node_cage.setPosition(cageInfo.position.x, cageInfo.position.y);

                // 设置笼子大小，例如设置为100x100
                let uiTransform = node_cage.getComponent(UITransform);
                uiTransform.width = 120; // 设置宽度为100
                uiTransform.height = 120; // 设置高度为100
                this.parentBlocks.addChild(node_cage);
            //});
        });
    }

    //新笼子滑卡牌
    generateCardAtFixedPosition(position, index, totalCards, pileId) {
        const type = Math.floor(Math.random() * this.gameConfig.TypeNum); // 从20个种类中随机选择
        const node_card = instantiate(this.preBlock); // 使用卡牌预制体
        const yOffset = (index === totalCards - 1) ? 40 : 0;
        node_card.setPosition(position.x, position.y - yOffset, 0);
        this.parentBlocks.addChild(node_card);
        
        const ts_card = node_card.getComponent('block'); // 获取卡牌组件
    
        ts_card.id = this.globalCardId++; // 分配ID并自增计数器
        ts_card.setTouch(true);
        ts_card.damageConfig = this.gameConfig;
        ts_card.blockType = type; // 设置卡牌类型
        ts_card.init(ts_card.blockType); // 初始化卡牌
        ts_card.pileId = pileId; // 新增：设置卡牌所属的堆的ID

    }
    

    //笼子中卡牌滑出
    handleCardClick() {
        this.gameConfig.fixedCardPiles.forEach(pile => {

            // 假设每个pile都有一个唯一标识符pileId
            let pileId = pile.pileId;

            let pileCards = this.parentBlocks.children.filter(child => {
                let childPos = child.getPosition();
                let block = child.getComponent('block');
                return childPos.x === pile.position.x && childPos.y === pile.position.y && block && block.pileId === pileId;
            });
    
            // 获取当前堆的卡牌数量并与之前的数量比较
            let currentCount = pileCards.length;
    
            // 如果堆非空，检查顶部卡牌是否可点击
            if (currentCount > 0) {
                let topCard = pileCards[currentCount - 1];
                let block = topCard.getComponent('block');
                
                if (block) {
                    // 使顶部卡牌滑出
                    tween(topCard)
                        .to(0.3, { position: new Vec3(topCard.position.x, topCard.position.y - 80, topCard.position.z) })
                        .start();
                }
            }
        });
    }
    
    updateSpriteAndLabel(blockComponent, blockType) {
        // 更新SpriteFrame
        if (blockComponent.spfYuanSu && blockComponent.spfYuanSu[blockType]) {
            const yuansuSprite = blockComponent.node.getChildByName('yuansu')?.getComponent(Sprite);
            if (yuansuSprite) {
                yuansuSprite.spriteFrame = blockComponent.spfYuanSu[blockType];
            }
        }
    
        // 更新伤害值文本
        if (blockComponent.damageConfig && blockComponent.damageConfig.damageValues[blockType] !== undefined) {
            const damageValue = blockComponent.damageConfig.damageValues[blockType];
            const damageLabel = blockComponent.node.getChildByName('DamageLabel')?.getComponent(Label);
            if (damageLabel) {
                //damageLabel.string = `Damage: ${damageValue}`;
                //改伤害
                damageLabel.string = ``;
            }
        }
    }

    // 实现一个shuffle方法来打乱数组
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // 交换元素
        }
        return array;
    }

    //在底部生成元素块
    createBlockToBi(b_type,v3_block_start){
        let node_block = instantiate(this.preBlock);
        node_block.parent = this.parentBlocksDi;
        let ts_block = node_block.getComponent(block);
        ts_block.damageConfig=this.gameConfig;
        ts_block.initDi(b_type);

        let num_di =this.getNumDi();
        this.shuaXinNumDi(node_block);

        //let xx=this.xxStartDi +130*num_di;
        let xx=this.xxStartDi +80*num_di;
        let yy=-475;

        let v3_world = this.parentBlocks.getComponent(UITransform).convertToWorldSpaceAR(v3_block_start)
        let v3_node_di = this.parentBlocksDi.getComponent(UITransform).convertToNodeSpaceAR(v3_world)
        node_block.setPosition(v3_node_di);
        ts_block.v3BlockOld = v3_node_di

        // 计算动画所需时间，以保持匀速
        let distance = Vec3.distance(v3_node_di, new Vec3(xx, yy, 0));
        let speed = 4000;
        let time = distance / speed; // 动画所需时间

        // 动物跑到底部的动画，使用计算出的时间以保持匀速
        tween(node_block)
            .to(time, { position: new Vec3(xx, yy, 0) })
            .call(() => {
                this.pdXiaoChu(node_block);
            })
            .start();
    }

    pdXiaoChu(node_block){
        let ts_block = node_block.getComponent(block)
        ts_block.isMoving = false
        let num_di_block = ts_block.numDi
        let children = this.parentBlocksDi.children
        let arr_blockType = []
        for (let i=0;i<children.length;i++){
            let ts_block_2 = children[i].getComponent(block)
            if (ts_block.blockType == ts_block_2.blockType && ts_block_2.isXiaoChu == false){
                arr_blockType.push(children[i])
            }
        }

        let is_xiaoChu = false
        if (arr_blockType.length==3){

            //新增
            is_xiaoChu = true;

            // 首先标记所有卡牌为即将消除
            arr_blockType.forEach(node => {
                node.getComponent(block).isXiaoChu = true;
            });

            // 将左右两边的卡牌移动到中间卡牌的位置，然后消失
            let middleNode = arr_blockType[1]; // 假设arr_blockType[1]为中间的卡牌
            let middleNodePosition = middleNode.getPosition(); // 获取中间卡牌的位置

            let count = 0; // 用于跟踪完成的动画次数
            // 左右卡牌移动到中间卡牌位置
            [arr_blockType[0], arr_blockType[2]].forEach(node => {
                tween(node)
                  // 移动到中间卡牌的位置
                    .to(0.05, { position: middleNodePosition })
                    .call(() => {

                        count++; // 增加完成的动画次数
                        node.removeFromParent(); // 移动结束后移除
                        middleNode.removeFromParent();

                        //生成新的撞击卡牌的动画只执行一次
                        if (count === 2) {

                        if (this.soundFlag) {
                        // 播放3个卡牌合并的音效
                        this.combine.play();
                        //this.combine.playOneShot(this.audioClip, 1.0);
                        
                        }

                        let newNode = instantiate(this.preBlock);
                        const newTsBlock = newNode.getComponent(block);
                        newTsBlock.damageConfig = this.gameConfig;
                        newTsBlock.blockType = arr_blockType[1].getComponent(block).blockType;
                        newTsBlock.init(newTsBlock.blockType);
                        newTsBlock.setTouch(false);

                        // 先将新卡牌设置在中间卡牌的当前位置
                        newNode.setPosition(new Vec3(middleNodePosition.x, middleNodePosition.y, middleNodePosition.z));
                        newNode.setScale(1.2, 1.2, 1.2); // 放大到1.2倍
                        this.node.addChild(newNode);

                        // 新卡牌执行后续动作
                        let targetPosition = new Vec3(0, 400, 0); // 指定位置，如Boss位置
                        let distance = Vec3.distance(middleNodePosition, targetPosition);
                        let speed = 2000; // 单位每秒
                        let time = distance / speed;
            
                        tween(newNode)
                            .delay(0.05)
                            .to(time, { position: targetPosition }) // 移动到指定位置
                            .call(() => {
                                newNode.removeFromParent(); // 到达后移除新卡牌
                                newNode.destroy();
                                this.attackBoss(); // Boss受到攻击效果
                            })
                            .start();
                        }

                    })
                    .start();
            });

            this.scheduleOnce(() => {
                this.calculateAndApplyDamage(arr_blockType);
                arr_blockType[0].destroy();
                arr_blockType[1].destroy();
                arr_blockType[2].destroy();

                //ldx,记录消除次数
                gameEvents.instance.reportElimination()
                // 计算当前的伤害比例
                //const currentDamageRatio = (this.alldamage / this.allBossHealth) * 100;
                //const currentDamageRatio = Math.round((this.alldamage / (this.allBossHealth)) * 100)
                const currentDamageRatio = parseFloat((this.alldamage / this.allBossHealth * 100).toFixed(2));
                // 检查当前伤害比例是否达到了下一个成就的阈值
                if (this.nextAchievementIndex < this.AchievementThresholds.length && currentDamageRatio >= this.AchievementThresholds[this.nextAchievementIndex]) {
                    // 调用checkAndShowAchievement，因为玩家达到了新的成就阈值
                    this.checkAndShowAchievement();

                    // 移动到下一个成就阈值
                    this.nextAchievementIndex++;
                }

            },0.5)
        }
        if (is_xiaoChu){

            //不变
            let children_2 = this.parentBlocksDi.children

            //卡牌消除后，底部卡牌向前移动
            for (let i=0;i<children_2.length;i++){
                let ts_block_2=children_2[i].getComponent(block)
                if (ts_block_2.numDi > num_di_block){
                    ts_block_2.numDi = ts_block_2.numDi -3
                    let xx=this.xxStartDi +80*ts_block_2.numDi;
                    let yy=-475;
                    tween(children_2[i])
                        //.delay(0.05)
                        .delay(0.1)
                        .to(0.08,{position: new Vec3(xx, yy, 0)})
                        .start()

                }
            }
        }

        let num_xiaoChu_geShu = 0;
        let children_2 = this.parentBlocksDi.children
        for (let i=0;i < children_2.length;i++){
            let ts_block = children_2[i].getComponent(block)
            if (ts_block.isXiaoChu){
                num_xiaoChu_geShu++
            }
        }
        if (children_2.length -num_xiaoChu_geShu >=8){
            this.gameType = -1

            console.log('游戏失败')
            this.scheduleOnce(function(){
                //const damageRatio = Math.round((this.alldamage / (this.allBossHealth)) * 100);
                const damageRatio = parseFloat((this.alldamage / this.allBossHealth * 100).toFixed(2));
                this.jiesuan.string =  `你已完成${damageRatio}%的进度`
                this.layerOver.active=true
                this.showMask(this.toumingmask)
            },0.5)
        }
    }

    //得到在底部的位置
    getNumDi(){
        let children = this.parentBlocksDi.children
        let block_end = children[children.length-1]
        let ts_block_end = block_end.getComponent(block)
        let num_xiaoChu=0

        for (let i=0;i<children.length;i++){
            let ts_block = children[i].getComponent(block)
            if (ts_block.isXiaoChu){
                num_xiaoChu++
            }
        }

        if (children.length - num_xiaoChu==1){
            ts_block_end.numDi=0
        }

        for (let i = children.length-2;i>=0;i--){
            let ts_block_2 = children[i].getComponent(block)
            if (ts_block_end.blockType == ts_block_2.blockType && ts_block_2.isXiaoChu == false){
                ts_block_end.numDi = ts_block_2.numDi+1
                return ts_block_end.numDi
            }
        }
        ts_block_end.numDi = children.length-1-num_xiaoChu
        return ts_block_end.numDi
    }

    shuaXinNumDi(node_block){
        let num_di = node_block.getComponent(block).numDi
        let children = this.parentBlocksDi.children
        for (let i = 0;i< children.length;i++){
            let ts_block = children[i].getComponent(block)

            //添加伤害值
            const damageLabel = children[i].getChildByName('DamageLabel')?.getComponent(Label);
            let damageValue = ts_block.damageConfig.damageValues[ts_block.blockType + 1];
            damageLabel.string = `Damage: ${damageValue}`; // 更新伤害值文本
            //改伤害
            damageLabel.string = ``;

            //所有节点的uuid是不同的
            if (node_block.uuid == children[i].uuid || ts_block.isXiaoChu){
                continue
            }
            if (ts_block.numDi >= num_di){
                ts_block.numDi++
                let xx=this.xxStartDi +80*ts_block.numDi;
                let yy=-475;
                tween(children[i])
                    .to(0.1,{position:new Vec3(xx, yy, 0)})
                    .start()

            }
        }
    }
    
    overlap() {
        let children = this.parentBlocks.children;
        for (let i = 0; i < children.length; i++) {
            let block = children[i].getComponent('block');
            if (block) {
                block.coveredBy = []; // 清空遮挡数组
                block.covers = [];    // 清空覆盖数组
            }
        }
    
        // 简单遮挡检测
        for (let i = 0; i < children.length; i++) {
            let block1 = children[i].getComponent('block');
            if (!block1) continue;
    
            let rect1 = block1.getBoundingBox_pz();
            for (let j = i + 1; j < children.length; j++) {
                if (i === j) continue;
                let block2 = children[j].getComponent('block');
                if (!block2) continue;
    
                let rect2 = block2.getBoundingBox_pz();
                if (this.circlesIntersect(rect1, rect2)) {
                    // 使用ID来记录遮挡关系
                    block2.covers.push(block1.id);    // block2遮挡了block1
                    block1.coveredBy.push(block2.id); // block1被block2遮挡
                }
            }
        }
    
        // 更新卡牌状态
        for (let i = 0; i < children.length; i++) {
            let block = children[i].getComponent('block');
            if (!block) continue;
    
            this.evaluateCardClickability(block)
        }
    }
    

    circlesIntersect(circle1, circle2) {
        let dx = circle1.centerX - circle2.centerX;
        let dy = circle1.centerY - circle2.centerY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance <= (circle1.radius + circle2.radius);
    }
    
    // 通过ID查找block的辅助函数
    findBlockById(id) {
        let children = this.parentBlocks.children;
        for (let child of children) {
            let block = child.getComponent('block');
            if (block && block.id === id) {
                return block;
            }
        }
        return null; // 如果没找到，返回null
    }    

    updateOverlapOnRemoval(removedBlock) {
        // 先处理直接被removedBlock遮挡的卡牌
        removedBlock.covers.forEach((coveredBlockId) => {
            let coveredBlock = this.findBlockById(coveredBlockId);
            if (!coveredBlock) return; // 如果找不到，跳过
    
            // 从被遮挡卡牌的coveredBy数组中移除被删除的卡牌ID
            let index = coveredBlock.coveredBy.indexOf(removedBlock.id);
            if (index > -1) {
                coveredBlock.coveredBy.splice(index, 1);
            }
    
            // 重新评估coveredBlock的点击状态
            this.evaluateCardClickability(coveredBlock);
    
            // 然后，对于每个coveredBlock，我们需要检查它遮挡的其他卡牌
            coveredBlock.covers.forEach(coveredByCoveredBlockId => {
                let furtherCoveredBlock = this.findBlockById(coveredByCoveredBlockId);
                if (!furtherCoveredBlock) return; // 如果找不到，跳过
                this.evaluateCardClickability(furtherCoveredBlock);
            });
        });
    }
    
    
    // 重新评估卡牌的点击状态
    evaluateCardClickability(block) {
        let yuansuSprite = block.node.getChildByName('yuansu').getComponent(Sprite);

        // 如果没有被遮挡
        if (block.coveredBy.length === 0) {
            block.setTouch(true);
            yuansuSprite.color = new Color(255, 255, 255); // 白色，可点击
          
        // } else if (block.coveredBy.length === 1) { // 仅被一个卡牌遮挡
        //     // 获取这个遮挡卡牌
        //     let coveringBlock = this.findBlockById(block.coveredBy[0]);
            
        //     // 检查这个遮挡卡牌是否是可点击的，并且这个遮挡的卡牌没有被其他卡牌遮挡
        //     if (coveringBlock && coveringBlock.setTouch && coveringBlock.coveredBy.length === 0) {
        //         // 如果仅被一个可点击的卡牌遮挡，则设置为即将可点击的状态
        //         block.setTouch(false);
        //         yuansuSprite.color = new Color(167, 161, 161); // 即将可点击
        //     } else {
        //         // 如果被遮挡的卡牌不满足上述条件，则认为它不可点击
        //         block.setTouch(false);
        //         yuansuSprite.color = new Color(73, 71, 71); // 不可点击
        //     }
        } else { // 被多个卡牌遮挡
            block.setTouch(false);
            yuansuSprite.color = new Color(73, 71, 71); // 深灰色，不可点击
        }
    }

    pdBlockDiMoving(){
        let is_moving = false
        let children = this.parentBlocksDi.children
        if(children.length>0){
            let ts_block = children[children.length-1].getComponent(block)
            is_moving = ts_block.isMoving
        }
        return is_moving
    }


    callBackBtn(event: Event, str: string) {

        if (str =='btn_cw'){
            director.loadScene("loadingGame");
            return;
        }

        this.lastActionType = 'ad'
        // 修改点: 检查是否需要完成互动
        if (this.actionRequired && this.isWX  && !this.isDebugMode ) {
            this.showJiLiShiPin(() => {
                        this.actionCompleted(str); // 广告完成后执行的操作
                    });
                    return; // 等待广告完成
        }

        if (this.actionRequired && this.isTT && !this.isDebugMode) {
            this.showdouyinJiLiShiPin(() => {
                        this.actionCompleted(str); // 广告完成后执行的操作
                    });
                    return; // 等待广告完成
        } else if (this.actionRequired && this.isKS && !this.isDebugMode){
            this.showkuaishouJiLiShiPin(() => {
                this.actionCompleted(str); // 广告完成后执行的操作
            });
            return; // 等待广告完成
        }

        if ( (!this.isWX && !this.isTT) || this.isDebugMode && !this.isKS){
            this.executeButtonFunction(str);
        }
    }

    // 执行按钮对应的功能
    executeButtonFunction(str: string) {
        switch (str) {
            case 'btn_1':
                this.b1.active = false
                this.btn1();
                this.maskLayer.active =false;
                break;
            case 'btn_2':
                this.b2.active = false
                this.btn2();
                this.maskLayer.active =false;
                break;
            case 'btn_3':
                this.b3.active = false
                this.btn3();
                this.maskLayer.active =false;
                break;
            case 'btn_fh':
                // 特定的复活操作
                this.gameType = 0;
                this.layerOver.active = false;
                
                this.b4.active = false
                this.maskLayer.active =false;
                this.toumingmask.active =false;

                this.timeLeft += 300;
                this.btn1();
                break;
        }
        this.isPaused = false; // 恢复计时
        this.shuaXinDJ(); // 刷新
    }
    

    // 修改点: 广告或分享完成后执行的操作
    actionCompleted(str: string) {
        this.actionRequired = true;

        if ((this.lastActionType === 'ad' && this.isAdWatchedCompletely)) {
            this.lastActionType = 'ad';
            this.isAdWatchedCompletely = null; // 重置广告观看标志
            if (this.numDJ === 0&&this.arrNumDJ[0]>0){
                this.arrNumDJ[0]--
                
                let a = 0
                if ( this.arrLabelDJ[0].string===`+`){
                    a=0
                }else{
                    a=parseInt(this.arrLabelDJ[0].string)
                }
                a=a+1
                if (a===0){
                    this.arrLabelDJ[0].string=`+`
                }else{
                    this.arrLabelDJ[0].string=`${a}`
                }
               
                this.shuaXinDJ()
            }else if (this.numDJ ===1&&this.arrNumDJ[1]>0){
                this.arrNumDJ[1]--

                let b = 0
                if ( this.arrLabelDJ[1].string===`+`){
                    b=0
                }else{
                    b=parseInt(this.arrLabelDJ[1].string)
                }
                b=b+1
                if (b==0){
                    this.arrLabelDJ[1].string=`+`
                }else{
                    this.arrLabelDJ[1].string=`${b}`
                }
                

                this.shuaXinDJ()
            }else if (this.numDJ ===2&&this.arrNumDJ[2]>0){
                this.arrNumDJ[2]--
                
                let c = 0
                if ( this.arrLabelDJ[2].string===`+`){
                    c=0
                }else{
                    c=parseInt(this.arrLabelDJ[2].string)
                }
                c=c+1
                if (c===0){
                    this.arrLabelDJ[2].string=`+`
                }else{
                    this.arrLabelDJ[2].string=`${c}`
                }

                this.shuaXinDJ()
            }else if (this.numDJ ===3&&this.arrNumDJ[3]>0){
                this.arrNumDJ[3]--
                let d = 0
                if ( this.arrLabelDJ[3].string===`+`){
                    d=0
                }else{
                    d=parseInt(this.arrLabelDJ[3].string)
                }
                d=d+1
                if (d===0){
                    this.arrLabelDJ[3].string=`+`
                }else{
                    this.arrLabelDJ[3].string=`${d}`
                }

                this.shuaXinDJ()
            }

            this.xianshiclose();
        }else{
            this.xianshiclose();

        }
    }

    //整合抖音和微信
    sharefriend(call: Function) {
        // 定义可能的分享标题
        const titles = [
            "动物园发生越狱事件？！看看咋回事...",
            "差一点点就能成功！帮帮我，一起玩！",
            "这款AI游戏居然能这么上头...想试试吗？",
            "居然有99%的人都无法通关？你能玩到哪？",
            "这款游戏居然让我室友玩到凌晨三点！你也来看看",
            "来帮助小动物们逃离铁笼吧！"
        ];
    
        // 创建包含所有图片URLs的数组
        const imageUrls = [
            "https://perimage.giiso.com/minigame2_fenxiang/03/ (1).png",
            "https://perimage.giiso.com/minigame2_fenxiang/03/ (2).png",
            // 更多图片 URL ...
            "https://perimage.giiso.com/minigame2_fenxiang/03/ (22).png"
        ];
    
        // 随机选择一个图片URL和标题
        const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        const title = titles[Math.floor(Math.random() * titles.length)];
    
        // 微信环境的分享
        if (typeof (this.wx) !== "undefined" && this.isWX) {
            this.wx.shareAppMessage({
                title: title, // 使用随机选取的标题
                imageUrl: imageUrl
            });
            // 假设无法直接获取分享成功的回调，此处示例中直接调用 call()
            call && call();
            console.log("微信分享成功")
        }
    
        // 抖音、快手分享
        if (typeof (this.tt) !== "undefined" && this.isTT) {
            window['tt'].shareAppMessage({
                title: title, // 使用随机选取的标题
                imageUrl: imageUrl,
                success() {
                    console.log("抖音分享成功");
                    call && call();
                },
                fail(e) {
                    console.log("分享失败", e);
                }
            });
        } else if (this.isKS){
            ks.shareAppMessage({
                title: title, // 使用随机选取的标题
                imageUrl: imageUrl,
                success() {
                    console.log("抖音分享成功");
                    call && call();
                },
                fail(e) {
                    console.log("分享失败", e);
                }
            });
        }
    }

    //撤回
    btn2(){
        let children =this.parentBlocksDi.children
        let i_end = -1
        for (let i=children.length-1;i>=0;i--){
            let ts_block = children[i].getComponent(block)
           
            //增
            if (!ts_block) {
                continue;
            }    

            if (ts_block.isXiaoChu){
                continue
            }
            i_end = i
            break
        }

        let num_di_cheHui =-1

        if (i_end !=-1){
            let ts_block = children[i_end].getComponent(block)
            num_di_cheHui = ts_block.numDi
            ts_block.isXiaoChu = true

            let v3_old = ts_block.v3BlockOld
            let v3_world = this.parentBlocksDi.getComponent(UITransform).convertToWorldSpaceAR(v3_old)
            let v3_block = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(v3_world)

            tween(children[i_end])
                .to(0.1,{position:v3_old})
                .call(()=>{
                    let node_block = instantiate(this.preBlock);
                    node_block.getComponent(block).damageConfig=this.gameConfig;
                    node_block.parent = this.parentBlocks;
                    node_block.setPosition(v3_block);
                    //增
                    node_block.getComponent(block).id = this.globalCardId++; // 确保为撤回的卡牌分配唯一ID

                    node_block.getComponent(block).init(ts_block.blockType);
                    //this.overlap()
                    // 使用updateOverlapOnAddition来更新遮挡关系
                    this.updateOverlapOnAddition(node_block.getComponent(block));
                })
                .removeSelf()
                .start()
        }

        // //增，若底部没有卡牌，不能使用道具
        // if (num_di_cheHui == -1){
        //     //this.arrNumDJ[1]++
        // }

        let children_di_2 = this.parentBlocksDi.children
        for (let i=0;i<children_di_2.length;i++){

            let ts_block = children_di_2[i].getComponent(block)
            if (ts_block.isXiaoChu){
                continue
            }
            if (ts_block.numDi>num_di_cheHui &&num_di_cheHui !=-1){
                ts_block.numDi = ts_block.numDi -1
                //let xx=this.xxStartDi +130*ts_block.numDi;
                let xx=this.xxStartDi +80*ts_block.numDi;
                let yy=-475;
                tween(children_di_2[i])
                    .to(0.08,{position:new Vec3(xx, yy, 0)})
                    .start()
            }
        }

    }


    //移出3个块
    btn1(){
        let arr_block_di = []
        let children_di_1 = this.parentBlocksDi.children
        for (let i =0;i<children_di_1.length;i++){
            let ts_block = children_di_1[i].getComponent(block)   

            if (ts_block.numDi <3 && ts_block.isXiaoChu == false){
                arr_block_di.push(children_di_1[i])
            }
        }

        let num_geShu = arr_block_di.length

        // //增，若底部没有卡牌，则不能使用道具
        // if (num_geShu == 0){
        //     this.arrNumDJ[0]++
        // }
        for (let i=arr_block_di.length-1;i>=0;i--){
            let ts_block =arr_block_di[i].getComponent(block)

            //let v3_block_di = new Vec3(-80+ts_block.numDi*80,-180,0)
            //改移出块的位置
            //let v3_block_di = new Vec3(-80+ts_block.numDi*80,-360,0)
            let v3_block_di = new Vec3(-80+ts_block.numDi*120,-360,0)
            let v3_world = this.parentBlocksDi.getComponent(UITransform).convertToWorldSpaceAR(v3_block_di)
            let v3_block = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(v3_world)

            ts_block.isXiaoChu = true

            tween(arr_block_di[i])
                .to(0.1,{position:v3_block_di})
                .call(()=>{
                    let node_block = instantiate(this.preBlock);
                    node_block.getComponent(block).damageConfig=this.gameConfig;
                    node_block.parent = this.parentBlocks;
                    node_block.setPosition(v3_block);
                    //node_block.getComponent(block).init(ts_block.blockType);
                    //this.overlap();

                    let newBlockComponent = node_block.getComponent(block);

                    newBlockComponent.isMovedOut=true
                   
                    //赋值id
                    newBlockComponent.id = this.globalCardId++;
                    newBlockComponent.init(ts_block.blockType);
                    // 更新新添加卡牌的遮挡关系
                    this.updateOverlapOnAddition(newBlockComponent);
                })
                .removeSelf()
                .start()
            //arr_block_di[i].setPosition(-80+ts_block.numDi*80,-180,0)
            //arr_block_di[i].removeFromParent()
        }

        let children_di_2 = this.parentBlocksDi.children
        for( let i=0;i<children_di_2.length;i++){
            let ts_block = children_di_2[i].getComponent(block)
            if (ts_block.isXiaoChu){
                continue
            }
            ts_block.numDi = ts_block.numDi - num_geShu

            //let xx=this.xxStartDi +130*ts_block.numDi;
            let xx=this.xxStartDi +80*ts_block.numDi;
            let yy=-475;
            tween(children_di_2[i])
                .to(0.08,{position:new Vec3(xx, yy, 0)})
                .start()
            //children_di_2[i].setPosition(xx, yy, 0);

        }
    }
    


    //洗牌，并且过滤笼子节点
    btn3() {
        // let children = this.parentBlocks.children;
        // // 过滤掉没有block组件的节点，即笼子节点
        // let filteredChildren = children.filter(child => child.getComponent(block));

        let children = this.parentBlocks.children;
        // 过滤掉没有block组件的节点或者已标记为已移出的节点
        let filteredChildren = children.filter(child => {
            let blockComp = child.getComponent(block);
            return blockComp && !blockComp.isMovedOut; // 确保block组件存在且未被标记为已移出
        });
    
        // 仅对过滤后的节点创建索引数组
        let indices = Array.from(Array(filteredChildren.length).keys());
    
        // 随机打乱索引数组
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
    
        // 先完成所有的 blockType 交换
        let newBlockTypes = [];
        for (let i = 0; i < filteredChildren.length; i++) {
            let ts_block = filteredChildren[i].getComponent('block');
            newBlockTypes[i] = ts_block.blockType; // 保存原始 blockType
        }
    
        // 应用新的 blockType 并更新显示
        for (let i = 0; i < filteredChildren.length; i++) {
            let ts_block = filteredChildren[i].getComponent('block');
            let newType = newBlockTypes[indices[i]]; // 获取新的 blockType
            ts_block.blockType = newType; // 应用新的 blockType
            ts_block.shuaXinBlockSPF(newType); // 更新显示
        }
    }

    async initGame(): Promise<void> {
        if(!this.gameConfig){
            await this.loadAllRequiredResources();
        }
        
        return new Promise((resolve, reject) => {
            this.currentBossIndex = 0; // 重置当前Boss索引
        
            // 从配置文件中读取Boss信息
            if (this.numLevel === 0) {
                this.bossHealths = [{ health: this.gameConfig.boss.health, image: this.gameConfig.boss.image }];
            } else if (this.numLevel === 1) {
                const levelTwoConfig = this.gameConfig.boss.level_two;
                this.totalBosses = levelTwoConfig.totalBosses;
                this.bossHealths = levelTwoConfig.bosses;

                this.image1.getChildByName("boss").getComponent(Sprite).spriteFrame = this.bossspriteFrame[1];

            }
        
            // 设置当前Boss的最大血量和图片
            this.bossMaxHealth = this.bossHealths[this.currentBossIndex].health;
            this.bossHealth = this.bossMaxHealth;
        
            // 更新Boss血量的UI显示
            //this.labelBossHealth.string = `血量: ${this.bossHealth}`;
            this.labelBossHealth.string = `${this.bossHealth}`;
            this.spriteBossHealthBar.fillRange = 1;

            resolve();
        })
    }

    loadBossImageToNode(bossNode, bossIndex) {
        bossNode.getComponent(Sprite).spriteFrame = this.bossspriteFrame[bossIndex];
    }

    //用
    calculateAndApplyDamage(arr_blockType) {
        let totalDamage = 0;
        arr_blockType.forEach(node => {
            let blockComponent = node.getComponent(block);
            totalDamage += this.gameConfig.damageValues[blockComponent.blockType];
    
            // let blockType = blockComponent.blockType;
            // let damageValue = this.gameConfig.damageValues[blockType];
            // console.log(`方块类型: ${blockType}, 对应伤害值: ${damageValue}`);
        });
    
        // 显示飘动的伤害值
        this.showDamageText(totalDamage);

        // 如果是最后一个boss，特殊处理伤害计算
        if (this.currentBossIndex == this.totalBosses - 1) {
            this.applyMultiPhaseDamage(totalDamage);
        } else {
            this.alldamage += totalDamage
            this.updateBossHealth(totalDamage);
        }
    }

    applyMultiPhaseDamage(damage) {
        // 检查是否需要移动到下一个阶段
        if (this.attacksInCurrentPhase >= this.gameConfig.lastBossDamagePhases[this.currentPhaseIndex].attacks) {
            this.attacksInCurrentPhase = 0; // 重置攻击次数
            this.currentPhaseIndex++; // 移动到下一个阶段

            // 根据当前阶段显示不同的文本
            if (this.currentPhaseIndex === 1) { // 第一阶段结束，进入第二阶段
                this.showjiagubossText("栅栏被加固了！小动物们加油！");
            } else if (this.currentPhaseIndex === 2) { // 第二阶段结束，进入最后阶段
                this.showjiagubossText("栅栏被加固了！进入最终阶段！加油啊！");
            }

            if (this.currentPhaseIndex >= this.gameConfig.lastBossDamagePhases.length) {
                // 如果已经是最后一个阶段，处理结束游戏的逻辑
                this.alldamage += 1;
                this.updateBossHealth(1);
                console.log("Boss defeated!");
                return;
            }
        }
    
        this.attacksInCurrentPhase += 1; // 增加当前阶段的攻击次数
    
        // 计算并应用当前阶段的伤害
        let phase = this.gameConfig.lastBossDamagePhases[this.currentPhaseIndex];
        let phaseDamage = (this.bossMaxHealth * phase.healthPercentage / 100) / phase.attacks;
        this.alldamage += phaseDamage;
        this.updateBossHealth(phaseDamage);
    }

    //显示boss扣血
    showDamageText(damage) {
        // 创建一个新的Label节点显示伤害值
        let damageText = new Node();
        let label = damageText.addComponent(Label);
        label.string = `-${damage}`;
        label.fontSize = 40; // 初始字体大小
        label.color = new Color(248, 238, 5);
        damageText.setPosition(0, 410); // 设置初始位置
    
        // 添加描边组件并设置属性
        let outline = damageText.addComponent(LabelOutline);
        outline.color = new Color(63,60,2);
        outline.width = 2; // 描边宽度
    
        this.node.addChild(damageText);
    
        // 根据伤害值计算scale的变化值
        let baseScale = 1.0; // 基础缩放比例
        let scaleIncrease = damage / 100; // 根据伤害计算增加的缩放比例
        let finalScale = baseScale + scaleIncrease; // 最终缩放比例
    
        // 使用Vec3设置初始缩放，从0.5开始变化
        damageText.scale = new Vec3(1, 1, 1);
    
        // 执行飘动和scale大小变化动画
        tween(damageText)
            .to(0.3, { scale: new Vec3(finalScale, finalScale, finalScale) }) // 根据计算的scale值进行变化
            .call(() => damageText.removeFromParent())
            .start();
    }
    

    //飘撞击boss的加油
    showBossText(){
        let bossText = new Node();
        let label = bossText.addComponent(Label);
        label.string = `加油，它就快被我们撞倒了`;
        label.fontSize = 40; 
        label.color = Color.WHITE;
        bossText.setPosition(0, 480); // 设置初始位置，根据需要调整
        this.node.addChild(bossText);
    
        // 执行飘动动画
        tween(bossText)
            .by(0.8, { position: new Vec3(0, 5,0) }) // 向上移动100单位，根据需要调整
            .call(() => bossText.removeFromParent())
            .start();
    }

    //第二关的语音
    showTwoText(){
        let bossText = new Node();
        let label = bossText.addComponent(Label);
        label.string = `太棒了`;
        label.fontSize = 40; 
        label.color = Color.WHITE;
        bossText.setPosition(0, 480); // 设置初始位置，根据需要调整
        this.node.addChild(bossText);
    
        // 执行飘动动画
        tween(bossText)
            .by(0.8, { position: new Vec3(0, 5,0) }) // 向上移动100单位，根据需要调整
            .call(() => bossText.removeFromParent())
            .start();
    }

    //最后一个boss的提示
    showlastbossText(){
        let bossText = new Node();
        let label = bossText.addComponent(Label);
        label.string = `最后一道栅栏了！`;
        label.fontSize = 40; 
        label.color = Color.WHITE;
        bossText.setPosition(0, 480); // 设置初始位置，根据需要调整
        this.node.addChild(bossText);
    
        // 执行飘动动画
        tween(bossText)
            .by(0.8, { position: new Vec3(0, 5,0) }) // 向上移动100单位，根据需要调整
            .call(() => bossText.removeFromParent())
            .start();
    }
    
    updateBossHealth(damage) {
        // 假设已经有了spriteBossHealthBarDecrease表示减少的血量部分
        let previousHealthRatio = this.bossHealth / this.bossMaxHealth;
        this.bossHealth -= damage;
        this.bossHealth = Math.max(0, this.bossHealth);
        let newHealthRatio = this.bossHealth / this.bossMaxHealth;
    
        // 更新血量UI
        this.labelBossHealth.string = `${this.bossHealth}`;
        this.spriteBossHealthBar.fillRange = newHealthRatio;
    
        //更新减少的血量部分
        this.spriteBossHealthBarDecrease.fillRange = previousHealthRatio;
        tween(this.spriteBossHealthBarDecrease)
            .to(0.5, { fillRange: newHealthRatio }) // 1秒内减少至新的血量比例
            .start();

        // 根据血量比例替换Boss图片

        if (this.numLevel == 0){
            this.currentBossIndex=0
        }else{
            this.currentBossIndex = (this.currentBossIndex) % this.totalBosses;
        }

        console.log("Current Boss Index:", this.currentBossIndex);

        // 根据当前Boss索引和血量比例决定哪个图片和Boss应该显示,boss破损过程
        if (this.currentBossIndex % 2 === 0) {
            // 当前Boss索引为偶数时，使用image1
            let imageNode = this.image1.getChildByName("boss");
            this.setBossSprite(imageNode, newHealthRatio);
        } else {
            // 当前Boss索引为奇数时，使用image2
            let imageNode = this.image2.getChildByName("boss");
            this.setBossSprite(imageNode, newHealthRatio);
        }


        // 检查当前Boss是否被击败
        if (this.bossHealth <= 0 && this.bossDefeated==false ) {
            console.log('Boss defeated!');
            this.bossDefeated = true;
            this.currentBossIndex++; // 移动到下一个Boss

            this.showMask(this.toumingmask);
            // 禁用按钮
            this.buttonsEnabled = false;


            if (this.currentBossIndex < this.totalBosses) {
                // 如果还有更多Boss，初始化下一个Boss的血量和图片
                this.bossDefeated = false;
                this.bossHealth = this.bossHealths[this.currentBossIndex].health;
                this.bossMaxHealth = this.bossHealth;
                this.labelBossHealth.string = `${this.bossHealth}`;
                
                //第二关语音
                this.showTwoText()
                tween(this.node)
                    .delay(1.5)
                    .call(() => {
                        //移动背景图
                        this.updateImagesPositionByHealth()
                    })
                    .start();

                this.scheduleOnce(()=>{
                    this.spriteBossHealthBar.fillRange = 1;
                    if (this.currentBossIndex == this.totalBosses-1){
                        this.showlastbossText();
                    }
                
                },2.5);

            } else {
                //所有小动物跑出来
                for (let i = 0; i < this.parentBlocks.children.length; i++) {
                    let cardNode = this.parentBlocks.children[i];
                    // 应用上移动画
                    tween(cardNode)
                        .by(1, { position: new Vec3(0, 1500, 0) }) // 在0.5秒内上移10单位
                        .call(() => {
                            cardNode.destroy(); // 动画完成后销毁节点
                        })               
                        .start();
                };

                tween(this.node)
                    .delay(1.3)
                    .call(() => {
                         // 所有Boss都被击败
                        this.gameType = 1;

                        this.numLevel++;
                        if (this.numLevel ==1){
                            this.GameOver.active = true;
                            this.showMask(this.deepmaskLayer); 
                            //this.showMask(this.maskLayer);

                        }else if (this.numLevel ==2){
                            //背景变灰
                            this.zhedang.active = true; 
                            this.GameWin.active = true; 
                            this.alldamage = this.allBossHealth
                            this.checkAndShowAchievement();
                            //ldx,通关时消除次数
                            gameEvents.instance.reportCurrentEliminations()
                        }
                    })
                    .start();
            }
        }
    }

    setBossSprite(imageNode, healthRatio) {
        let spriteFrameKey;
        let currentState="none";
    
        if (healthRatio > 1/3 && healthRatio < 2/3) {
            spriteFrameKey = `boss${this.currentBossIndex}_1`;
            currentState = "mid"; // 中等血量状态
        } else if (healthRatio < 1/3 && healthRatio > 0) {
            spriteFrameKey = `boss${this.currentBossIndex}_2`;
            currentState = "low"; // 低血量状态
        } else if (healthRatio <= 0) {
            // 栅栏撞坏，不显示Boss图片
            imageNode.getComponent(Sprite).spriteFrame = null;
            currentState="low";
        }else if (healthRatio =1 ){
            //if (this.numLevel ==0){
            if (this.currentBossIndex ==0){
                currentState="none"
            }else{currentState="low"};
        }
    
        // 检查状态是否改变
        if (currentState !== this.previousBossState) {
            // 状态改变，调用showBossText
            this.showBossText();
            this.previousBossState = currentState; // 更新状态
        }
    
        // 如果有有效的spriteFrameKey，设置图片
        if (spriteFrameKey && this.bossProcessSprites[spriteFrameKey]) {
            imageNode.getComponent(Sprite).spriteFrame = this.bossProcessSprites[spriteFrameKey];
        }
    }


    //更好boss图片灵活
    updateImagesPositionByHealth() {
        //this.setCardsClickable(false);
        this.showMask(this.toumingmask)
        //按钮不能按
        this.buttonsEnabled = false;
        let slideDistance = 1600;
        // 更新当前Boss索引，每次函数调用时递增
        //this.currentBossIndex = (this.currentBossIndex + 1) % this.totalBosses;
        this.currentBossIndex = (this.currentBossIndex) % this.totalBosses;
    
        // 计算下一个Boss索引，用于确定加载哪个Boss的图像
        let nextBossIndex = (this.currentBossIndex + 1) % this.totalBosses;
    
        // 更新image1的位置
        tween(this.image1)
            .by(1, { position: new Vec3(0, -slideDistance, 0) })
            .call(() => {
                if (this.image1.position.y <= -1590) {
                    this.image1.position = new Vec3(this.image1.position.x, 1602, 0);
                }
            })
            .start();
        // 更新image2的位置
        tween(this.image2)
            .by(1, { position: new Vec3(0, -slideDistance, 0) })
            .call(() => {
                //if (this.image2.position.y <= -1600) {
                if (this.image2.position.y <= -1590) {
                    this.image2.position = new Vec3(this.image2.position.x, 1602, 0);
                }
            })
            .start();

        this.scheduleOnce(()=>{
            // 恢复卡牌点击
            this.toumingmask.active =false;
            this.isPaused = false;
            // 禁用按钮
            this.buttonsEnabled = true;
        },1.2)

        if (this.currentBossIndex % 2 === 0) {
            // 当前Boss索引为偶数时，延迟显示image1，准备image2
            this.scheduleOnce(() => {
                this.loadBossImageToNode(this.image1.getChildByName("boss"), this.currentBossIndex);
                this.loadBossImageToNode(this.image2.getChildByName("boss"), nextBossIndex);
            }, 0.8); // 1秒后执行
        } else {
            // 当前Boss索引为奇数时，延迟显示image2，准备image1
            this.scheduleOnce(() => {
                this.loadBossImageToNode(this.image2.getChildByName("boss"), this.currentBossIndex);
                this.loadBossImageToNode(this.image1.getChildByName("boss"), nextBossIndex);
            }, 0.8); // 1秒后执行
        }
        
    }

    attackBoss() {
        const bossNodes = [this.image1.getChildByName("boss"), this.image2.getChildByName("boss")];
        bossNodes.forEach(bossNode => {
            // 在这里对每个boss节点执行操作
            const bossSprite = bossNode.getComponent(Sprite);

            // 保存boss原始颜色
            const originalColor = bossSprite.color.clone();

            if (this.soundFlag) {
            // 播放选中卡牌的音效
            this.toboss.play();
            }

            // 震动效果
            tween(bossNode)
                .by(0.03, { position: new Vec3(10, 0, 0) })
                .by(0.05, { position: new Vec3(-20, 0, 0) })
                .by(0.03, { position: new Vec3(10, 0, 0) })
                .start();


            // 手机震动效果
            //if (typeof window['wx'] !== 'undefined' && window['wx'].vibrateShort && this.vibrationFlag) {
            if (this.isWX && window['wx'].vibrateShort && this.vibrationFlag) {
                window['wx'].vibrateShort({
                    success: function () {
                        //console.log('手机震动成功');
                    },
                    fail: function () {
                        console.error('手机震动失败');
                    }
                });
            } else if (this.isTT && window['tt'].vibrateShort && this.vibrationFlag){
                window['tt'].vibrateShort({
                    success: function () {
                        //console.log('手机抖音震动成功');
                    },
                    fail: function () {
                        console.error('手机抖音震动失败');
                    }
                });
            } else if (this.isKS && ks.vibrateShort && this.vibrationFlag){
                ks.vibrateShort({
                    success: function () {
                        console.log('手机快手震动成功');
                    },
                    fail: function () {
                        console.error('手机快手震动失败');
                    }
                });
            }

            // 变色效果
            tween(bossSprite)
                .to(0.03, { color: new Color(255, 0, 0) }) // 变为红色
                //.delay(0.5) // 保持红色一段时间
                .delay(0.03)
                .to(0.03, { color: originalColor }) // 恢复原始颜色
                .start();
        });

    }


    startNextLevel(event:Event) {
        console.log('this.numLevel:'+this.numLevel);
    
        if (this.numLevel === 2) {
            director.loadScene('mainscene');
        }else{
    
        this.onLoad();
        this.proBar.progress = 0; // 开始时设置进度为0
        this.zhedang.active = true; 
        this.proBar.node.active = true; // 确保进度条是可见的
    
        // 使用一个计时器来更新进度条
        let duration = 0.5; // 总持续时间为3秒
        let elapsed = 0; // 已过时间
        this.schedule(function(dt) {
            elapsed += dt; // 增加已过时间
            let progress = elapsed / duration; // 计算当前进度
            this.proBar.progress = progress; // 更新进度条
            
            // 当进度完成时
            if (progress >= 1) {
                this.unscheduleAllCallbacks(); // 停止所有计时器

                this.proBar.node.active = false;
    
                // 延迟执行原有逻辑
                this.scheduleOnce(function() {

                    //this.onLoad(); // 重新加载当前场景或初始化
                    this.GameOver.active = false; // 隐藏游戏结束节点
                    this.deepmaskLayer.active =false;
                    this.toumingmask.active = false;
                    this.zhedang.active =false
                    this.isPaused=false;
                    //ldx
                    //进入第二关的时间
                    gameEvents.instance.enterLevelTwo()
                }, 0); // 这里的1秒是进度条完成后延迟的时间
            }
        }, 0.1, macro.REPEAT_FOREVER); // 每0.1秒更新一次进度
        }
    }

    checkAndSaveAchievement() {
        //const damageRatio = (this.alldamage / this.allBossHealth) * 100;
        const damageRatio = parseFloat((this.alldamage / this.allBossHealth * 100).toFixed(2));
        //const damageRatio = Math.round((this.alldamage / (this.allBossHealth)) * 100)
        

        UserSettings.getInstance().checkAchievements(damageRatio);

    }

    updateButtonVisuals() {
        if (this.musicFlag) {
            this.musicButtonSprite.spriteFrame = this.musicOnSprite;
        } else {
            this.musicButtonSprite.spriteFrame = this.musicOffSprite;
        }

        if (this.soundFlag) {
            this.soundButtonSprite.spriteFrame = this.soundOnSprite;
        } else {
            this.soundButtonSprite.spriteFrame = this.soundOffSprite;
        }

        // 更新震动按钮的视觉状态
        if (this.vibrationFlag) {
            this.vibrationButtonSprite.spriteFrame = this.vibrationOnSprite;
        } else {
            this.vibrationButtonSprite.spriteFrame = this.vibrationOffSprite;
        }

    }

    //背景音乐
    onBGMButtonClicked() {
        this.musicFlag = !this.musicFlag;
        if (this.audioController) {
            this.audioController.toggleBGM(this.musicFlag);

            // 不仅切换背景音乐，也更新 AudioController 中的状态
            this.audioController.musicIsOn = this.musicFlag;

        }
        this.updateButtonVisuals(); // 更新按钮的视觉状态以反映当前的设置
    }

    //所有声音
    onSoundButtonClicked() {
        this.soundFlag = !this.soundFlag;
        if (this.audioController) {
            this.audioController.toggleSoundEffects(this.soundFlag);

            // 不仅切换声音效果，也更新 AudioController 中的状态
            this.audioController.soundEffectsIsOn = this.soundFlag;
        }
        this.updateButtonVisuals(); // 更新按钮的视觉状态以反映当前的设置
    }

    //音乐设置的总按钮
    toggleSoundSetting() {
        if (this.GameOver.active==true || this.GameWin.active==true || this.layerOver.active ==true || !this.buttonsEnabled || this.b1.active || this.b2.active || this.b3.active){
            return;
        }
        this.soundSetting.active = true
        this.showMask(this.maskLayer);
    }

    //重新开始
    restart(){
        director.loadScene("loadingGame")
    }

    //返回主页
    back(){
        director.loadScene("mainscene")
    }
    
    //关闭设置
    close(){
        // 音乐设置节点的可见性
        this.soundSetting.active = false;
        this.maskLayer.active =false;
        this.isPaused = false;
    }

    // toggleDebugMode() {
    //     this.isDebugMode = !this.isDebugMode;
    // }

    toggleDebugMode() {
        this.isDebugMode = !this.isDebugMode;
        // this.isWX=!this.isWX
        // this.isTT=!this.isTT
    }

    onVibrationButtonClicked() {
        if (VibrationManager.instance) {
            // 切换震动设置
            VibrationManager.instance.toggleVibration();
            
            // 获取更新后的震动设置
            this.vibrationFlag = VibrationManager.instance.vibrationEnabled;
        }
        
        this.updateButtonVisuals(); // 更新按钮的视觉状态以反映当前的设置
    }


    //更新增添的卡牌的状态
    updateOverlapOnAddition(addedBlock) {
        let children = this.parentBlocks.children;
        let addedBlockRect = addedBlock.getBoundingBox_pz(); // 假设这是获取卡牌边界的方法
    
        // 检查新加卡牌与其他卡牌的遮挡关系
        children.forEach(child => {
            let block = child.getComponent('block');
            if (block && block !== addedBlock) {
                let blockRect = block.getBoundingBox_pz();
                if (this.circlesIntersect(addedBlockRect, blockRect)) {
                    // 新加的卡牌遮挡了block
                    addedBlock.covers.push(block.id);
                    block.coveredBy.push(addedBlock.id);
                }
            }
        });
    
        // 更新所有受影响卡牌的点击状态
        this.evaluateCardClickability(addedBlock);
        addedBlock.covers.forEach(coveredBlockId => {
            let coveredBlock = this.findBlockById(coveredBlockId);
            if (coveredBlock) {
                this.evaluateCardClickability(coveredBlock);
            }
        });
    }

    //新增一个卡牌的重叠情况
    updateAddition(addedBlock) {
        let children = this.parentBlocks.children;
        let addedBlockRect = addedBlock.getBoundingBox_pz(); // 假设这是获取卡牌边界的方法
    
        // 检查新加卡牌与其他卡牌的遮挡关系
        children.forEach(child => {
            let block = child.getComponent('block');
          
            if (block && block !== addedBlock && !block.pileId) {
            //if (block && block !== addedBlock) {
                let blockRect = block.getBoundingBox_pz();
                if (this.circlesIntersect(addedBlockRect, blockRect)) {
                    // 新加的卡牌遮挡了block
                    // addedBlock.covers.push(block.id);
                    // block.coveredBy.push(addedBlock.id);
                    addedBlock.coveredBy.push(block.id);
                    block.covers.push(addedBlock.id);
                }
            }
        });
    
        // 更新所有受影响卡牌的点击状态
        this.evaluateCardClickability(addedBlock);
        addedBlock.covers.forEach(coveredBlockId => {
            let coveredBlock = this.findBlockById(coveredBlockId);
            if (coveredBlock) {
                this.evaluateCardClickability(coveredBlock);
            }
        });
    }

    //道具显示页面
    xianshib1(){
        this.numDJ =0
        if (this.GameOver.active==true || this.GameWin.active==true || this.layerOver.active ==true || this.soundSetting.active ==true || !this.buttonsEnabled || this.b1.active || this.b2.active || this.b3.active){
            return;
        }

        let arr_block_di = []
        let children_di_1 = this.parentBlocksDi.children
        for (let i =0;i<children_di_1.length;i++){
            let ts_block = children_di_1[i].getComponent(block)   

            if (ts_block.numDi <3 && ts_block.isXiaoChu == false){
                arr_block_di.push(children_di_1[i])
            }
        }

        let num_geShu = arr_block_di.length

        //增，若底部没有卡牌，则不能使用道具
        if (this.arrLabelDJ[0].string == `+`){

            this.b1.active = true
            this.showMask(this.maskLayer);
            //return;
        }else if(num_geShu <= 0){
            this.showdaojuText("暂时没法使用道具哦~")
            return;
        }else{
            this.executeButtonFunction('btn_1');
            let a: number = parseInt(this.arrLabelDJ[0].string)-1;
            if (a==0){
                this.arrLabelDJ[0].string = `+`
            }else{
                this.arrLabelDJ[0].string = `${a}`
            }
            this.shuaXinDJ();

        }
    }

    xianshib2(){
        this.numDJ =1
        if (this.GameOver.active==true || this.GameWin.active==true || this.layerOver.active ==true || this.soundSetting.active ==true || !this.buttonsEnabled || this.b1.active || this.b2.active || this.b3.active){
            return;
        }

        let children =this.parentBlocksDi.children
        if (this.arrLabelDJ[1].string == `+`){
            this.b2.active = true
            this.showMask(this.maskLayer);

        }else if(children.length<=0){
            this.showdaojuText("暂时没法使用道具哦~")
            return;
        }
        else{
            this.executeButtonFunction('btn_2');
            let b: number = parseInt(this.arrLabelDJ[1].string)-1;
            if (b==0){
                this.arrLabelDJ[1].string = `+`
            }else{
                this.arrLabelDJ[1].string = `${b}`
            }
            this.shuaXinDJ();
        }
      
    }

    xianshib3(){
        this.numDJ =2
        if (this.GameOver.active==true || this.GameWin.active==true || this.layerOver.active ==true || this.soundSetting.active ==true || !this.buttonsEnabled || this.b1.active || this.b2.active || this.b3.active){
            return;
        }

        if (this.arrLabelDJ[2].string == `+`){
            this.b3.active = true
            this.showMask(this.maskLayer);
        }else{
            this.executeButtonFunction('btn_3');
            let c: number = parseInt(this.arrLabelDJ[2].string)-1;
            if (c==0){
                this.arrLabelDJ[2].string = `+`
            }else{
                this.arrLabelDJ[2].string = `${c}`
            }
            this.shuaXinDJ();
        }

    }

    xianshib4(){
        this.numDJ =3

        if (this.arrLabelDJ[3].string == `+`){
            this.b4.active = true
            this.showMask(this.maskLayer);
        }else{
            this.executeButtonFunction('btn_fh');
            let d: number = parseInt(this.arrLabelDJ[3].string)-1;
            if (d==0){
                this.arrLabelDJ[3].string = `+`
            }else{
                this.arrLabelDJ[3].string = `${d}`
            }
            this.shuaXinDJ();
        }

    }

    xianshib5(){
        this.b5.active = true
        this.showMask(this.maskLayer);
    }

    xianshiclose(){
        if (this.b1.active){
            this.b1.active = false
            this.maskLayer.active =false;
          
        } else if (this.b2.active){
            this.b2.active = false
            this.maskLayer.active =false;
            
        }else if (this.b3.active){
            this.b3.active = false
            this.maskLayer.active =false;
         
        }else if (this.b4.active){
            this.b4.active = false
            this.maskLayer.active =false;
           
        }else if (this.b5.active){
            this.b5.active = false
            this.maskLayer.active =false;
        }
        this.isPaused = false;
    }

    
    showMask(maskLayer: Node) {
        maskLayer.active = true;
        this.isPaused = true;
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

    //随机道具
    suijidaoju() {

        if (this.GameOver.active==true || this.GameWin.active==true || this.layerOver.active ==true || this.soundSetting.active ==true || !this.buttonsEnabled || this.b1.active || this.b2.active || this.b3.active){
            return;
        }
        this.sharefriend(() => {
            // 随机选择一个道具
            this.numDJ = Math.floor(Math.random() * 3); // 假设有4种道具，随机选择一个
        
            // 根据选择的道具增加数量
            if (this.numDJ === 0) {
                // 道具1的逻辑
                this.incrementItem(0);
            } else if (this.numDJ === 1) {
                // 道具2的逻辑
                this.incrementItem(1);
            } else if (this.numDJ === 2) {
                // 道具3的逻辑
                this.incrementItem(2);
            }
            this.shuaXinDJ(); // 更新道具的显示
    
            this.xianshiclose();
            this.btn5.active =false;
            });

    }
    
    incrementItem(index) {
        // 通用逻辑来增加道具数量
        let currentCount = 0;
        if (this.arrLabelDJ[index].string === `+`) {
            currentCount = 0;
        } else {
            currentCount = parseInt(this.arrLabelDJ[index].string);
        }
        currentCount++;
        this.arrLabelDJ[index].string = `${currentCount}`;
        if(this.arrNumDJ[index] == 0){
            if (index === 0){
                let b1=this.node.getChildByName("btn_1").getComponent(Sprite)
                b1.color = new Color (255, 255, 255)
                let b1_sprite = this.node.getChildByName("btn_1").getChildByName("Sprite").getComponent(Sprite);
                b1_sprite.color = new Color (255, 255, 255)
                let btnComponent = this.node.getChildByName("btn_1").getComponent(Button);
                // 设置按钮为不可点击
                btnComponent.interactable = true;

            }else if(index === 1){
                let b2=this.node.getChildByName("btn_2").getComponent(Sprite)
                b2.color = new Color (255, 255, 255)
                let b2_sprite = this.node.getChildByName("btn_2").getChildByName("Sprite").getComponent(Sprite);
                b2_sprite.color = new Color (255, 255, 255)
                let btnComponent = this.node.getChildByName("btn_2").getComponent(Button);
                // 设置按钮为不可点击
                btnComponent.interactable = true;
            }else if(index === 2){
                let b3=this.node.getChildByName("btn_3").getComponent(Sprite)
                b3.color = new Color (255, 255, 255)
                let b3_sprite = this.node.getChildByName("btn_3").getChildByName("Sprite").getComponent(Sprite);
                b3_sprite.color = new Color (255, 255, 255)
                let btnComponent = this.node.getChildByName("btn_3").getComponent(Button);
                // 设置按钮为不可点击
                btnComponent.interactable = true;
            }
        }
    }

    //加固栅栏提示
    showjiagubossText(customText) {
        let bossText = new Node();
        let label = bossText.addComponent(Label);
        label.string = customText; // 使用传入的句子设置文本
        label.fontSize = 40; // 可以根据需要调整字体大小
        label.color = Color.WHITE; // 设置字体颜色为白色
        bossText.setPosition(0, 480); // 设置初始位置，根据需要调整
    
        this.node.addChild(bossText);
    
        // 执行飘动动画
        tween(bossText)
            .by(0.8, { position: new Vec3(0, 5, 0) }) // 向上移动5单位，根据需要调整
            .call(() => bossText.removeFromParent()) // 动画完成后移除文本节点
            .start();
    }

    //道具提示不能用
    showdaojuText(customText) {
        let bossText = new Node();
        let label = bossText.addComponent(Label);
        label.string = customText; // 使用传入的句子设置文本
        label.fontSize = 40; // 可以根据需要调整字体大小
        label.color = Color.WHITE; // 设置字体颜色为白色
        bossText.setPosition(0, -406); // 设置初始位置，根据需要调整
    
        this.node.addChild(bossText);
    
        // 执行飘动动画
        tween(bossText)
            .by(0.8, { position: new Vec3(0, 5, 0) }) // 向上移动5单位，根据需要调整
            .call(() => bossText.removeFromParent()) // 动画完成后移除文本节点
            .start();
    }

    checkAndShowAchievement() {
        // 当前的伤害比例
        //const damageRatio = (this.alldamage / this.allBossHealth) * 100;
        //const damageRatio = Math.round((this.alldamage / (this.allBossHealth)) * 100)
        const damageRatio = parseFloat((this.alldamage / this.allBossHealth * 100).toFixed(2));
        // 加载玩家成就进度
        let localAchievements = UserSettings.getInstance().getAchievements();
    
        // 查找玩家根据当前伤害比例应该解锁的成就
        let newAchievementUnlocked = false;
        for (let threshold of this.AchievementThresholds) {
            if (damageRatio >= threshold) {
                const achievement = this.gameConfig.achievements.find(a => a.threshold === threshold);
                let localAchievement = localAchievements.find(a => a.id === achievement.id);
    
                if (!localAchievement) {
                    // 如果本地没有记录，说明是新成就
                    //localAchievements.push({id: achievement.id, progress: threshold});
                    newAchievementUnlocked = true;
                } else if (localAchievement.progress < threshold) {
                    // 更新进度
                    localAchievement.progress = threshold;
                    newAchievementUnlocked = true;
                }
    
                // 仅展示最近解锁的成就
                if (newAchievementUnlocked) {
                    this.currentAchievement = achievement;
                    break;
                }
            }
        }
    
        if (newAchievementUnlocked) {
            // 展示成就弹窗
            this.achievemianban.active = true;
            this.achievemiaoshu.string = `完成${this.currentAchievement.threshold}%进度, 解锁${this.currentAchievement.name}`;
            this.achievetouxiang.getComponent(Sprite).spriteFrame = this.achievementImages[this.currentAchievement.id];
            console.log("解锁成就");
    
            // 在2秒后隐藏成就面板
            this.scheduleOnce(() => {
                this.achievemianban.active = false;
            }, 2);
            
            this.checkAndSaveAchievement();
        } else {
            //console.log("当前没有成就达到阈值或已经展示");
        }
    }

    closechengjiu(){
        this.achievemianban.active =false;
        this.maskLayer.active =false;
    }

    sharechengjiu(){
        this.tedingshare(() => {
            // 分享完成的回调
            this.closechengjiu()
        });
    }

    //开头提示
    showtishiText(customText) {
        let bossText = new Node();
        let label = bossText.addComponent(Label);
        label.string = customText; // 使用传入的句子设置文本
        label.fontSize = 40; // 可以根据需要调整字体大小
        label.color = Color.WHITE; // 设置字体颜色为白色
        bossText.setPosition(0, 360); // 设置初始位置，根据需要调整
    
        this.node.addChild(bossText);
    
        // 执行飘动动画
        tween(bossText)
            .by(2, { position: new Vec3(0, 1, 0) }) // 向上移动5单位，根据需要调整
            .call(() => bossText.removeFromParent()) // 动画完成后移除文本节点
            .start();
    }

    //指定分享
    tedingshare(call: Function) {
        // 假设 this.wx 已正确引用微信环境下的 wx 对象
        if (typeof (this.wx) == "undefined") return;
    
        let title = "一起来玩这个游戏吧！"; // 默认分享标题
        let imageUrl = "https://example.com/default-image.png"; // 默认图片 URL
    
        // 检查是否有当前成就
        if (this.currentAchievement) {
            // 根据当前成就设置分享的标题和图片
            title = `我完成了${this.currentAchievement.threshold}%, 荣获${this.currentAchievement.name}称号, 你也来试试? `; // 使用当前成就的名称作为标题
            // 假设achievementImages数组是按成就id顺序存储的图片
            imageUrl = this.achieveUrls[this.currentAchievement.id - 1]; // 注意成就id和数组索引的对应
        } else {
            // 如果没有当前成就，随机选择一个标题和图片
            const titles = [
                "动物园发生越狱事件？！看看咋回事...",
                "差一点点就能成功！帮帮我，一起玩！",
                "这款AI游戏居然能这么上头...想试试吗？",
                "居然有99%的人都无法通关？你能玩到哪？",
                "这款游戏居然让我室友玩到凌晨三点！你也来看看",
                "来帮助小动物们逃离铁笼吧！"
            ];
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
            title = titles[Math.floor(Math.random() * titles.length)];
            imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        }
    
        this.wx.shareAppMessage({
            title: title, // 使用确定的或随机选取的标题
            imageUrl: imageUrl // 使用确定的或随机选取的图片URL
        });
    
        // 假设无法直接获取分享成功的回调，此处示例中直接调用 call()
        call && call();
    }
       
    
}