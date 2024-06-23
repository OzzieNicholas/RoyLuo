import { _decorator, assetManager, AudioSource, Button, CircleCollider2D, Collider2D, Color, Component, director, EventTouch, find, instantiate, JsonAsset, Label, labelAssembler, Node, NodePool, ParticleSystem, ParticleSystem2D, PhysicsSystem2D, Prefab, ProgressBar, resources, RigidBody2D, Size, Sprite, SpriteFrame, sys, Tween, tween, UITransform, Vec2, Vec3 } from 'cc';
import { AudioController } from './AudioController';
import { VibrationManager } from './VibrationManager';
const { ccclass, property } = _decorator;
declare var ks: any;
//Emotion枚举类型
enum Emotion {
    HUNGRY = 0, // 饿
    SEMI_FULL = 1, // 半饱
    FULL = 2, // 饱
    SURPRISE = 3 //惊喜
}
@ccclass('game')
export class game extends Component {
    //食物, 0 - 21是普通食物， 22 - 25是特殊食物
    @property([Prefab]) foodprefabs: Prefab[] = [];
    //用于表中的食物
    @property([Prefab]) foodprefabls: Prefab[] = [];
    //顾客
    @property([Prefab]) customerprefabs: Prefab[] = [];
    //装游戏界面食物的节点
    @property(Node) foodsRoot: Node;
    //装点击食物的节点
    @property(Node) foodtable: Node;
    //装顾客的节点
    @property(Node) customerRoot: Node;
    //营业额节点
    @property(Node) moneynode: Node;
    //工具栏
    //移出节点
    @property(Node) moveout: Node;
    //凑齐节点
    @property(Node) destroynode: Node;
    //打乱节点
    @property(Node) disorganize: Node;
    //结束画面节点
    @property(Node) gameover: Node;
    //顾客进度条节点
    @property(Node) progressbar: Node;
    //目标营业额节点
    @property(Node) goal_label: Node;
    //气泡mask节点
    @property(Node) bubble_mask: Node;
    //新的一天面板节点
    @property(Node) newdaynode: Node;
    //每日营业额进度条节点
    @property(Node) progressbar_day: Node;
    //计时器节点
    @property(Node) timer: Node;
    //表情节点
    @property(Node) emotionnode: Node;
    //表情图sprites
    @property([SpriteFrame])
    emotionSprites: SpriteFrame[] = [];
    //进阶文字图sprites
    @property([SpriteFrame])
    wordSprites: SpriteFrame[] = [];
    //暂存table
    @property(Node) temptable: Node;
    //游戏背景sprites
    @property([SpriteFrame])
    bgSprites: SpriteFrame[] = [];
    //游戏背景节点
    @property(Node) gamebgnode: Node;
    //移出面板
    @property(Node) moveoutpanel: Node;
    //销毁面板
    @property(Node) destroypanel: Node;
    //打乱面板
    @property(Node) disorganizepanel: Node;
    //成功面板
    @property(Node) successpanel: Node;
    //ldx
    //游戏总体进度
    @property(Sprite) progressbar_allday: Sprite = null
    //过渡面板进度条向左移动
    @property(Node) targetNode: Node;
    //过渡面板中黄色进度条向右移动
    @property(Sprite) interim_progress: Sprite = null;
    //过渡页面中圈的黄色图片
    @property([SpriteFrame]) interim_circle_Sprites: SpriteFrame[] = [];
    //过渡页面中的圈
    @property([Sprite]) interim_circle: Sprite[] = [];
    //顶部段位名称
    @property(Sprite) duanwei: Sprite = null;
    //过渡页面中圈的黄色图片
    @property([SpriteFrame]) duanwei_Sprites: SpriteFrame[] = [];
    //进度百分比,在面板上方
    @property(Label) progress_percent: Label = null;
    //3个按钮上的次数表示
    @property({ type: [Label] }) arrLabelDJ = [];
    //弹出面板中的次数表示
    @property({ type: [Label] }) bLabelDJ = [];
    //遮罩
    @property(Node) maskLayer: Node = null;
    // 声明背景音乐和声音效果的按钮Sprite
    @property(Sprite) musicButtonSprite: Sprite = null;
    @property(Sprite) soundButtonSprite: Sprite = null;
    @property(SpriteFrame) OnSprite: SpriteFrame = null;
    @property(SpriteFrame) OffSprite: SpriteFrame = null;
    @property(Sprite) vibrationButtonSprite: Sprite = null; // 震动按钮的Sprite组件
    @property(Node) soundSetting: Node = null; //游戏中声音设置
    @property(Node) chengjiuNode: Node; //成就节点，用于显示成就
    @property(Sprite) chengjiutishi: Sprite = null; //成就提示，达到某个段位后成就提示
    @property(Label) chengjiumiaoshu: Label = null; //成就描述
    @property([SpriteFrame]) unlockImg: SpriteFrame[] = [];//解锁后图片
    @property(Node) moneyfly: Node; //金钱的动画
    // 音效
    @property({ type: AudioSource }) match3SuccessAudio = null // 三消成功
    @property({ type: AudioSource }) match3SpecialfoodAudio = null // 三消特殊食物
    @property({ type: AudioSource }) clickFoodAudio = null // 点击食材
    @property({ type: AudioSource }) rankUpAudio = null // 升段位
    @property({ type: AudioSource }) failAudio = null // 失败
    @property({ type: AudioSource }) disruptionAudio = null // 打乱
    @property({ type: AudioSource }) moveOutAudio = null // 移出
    @property({ type: AudioSource }) clickCancelAudio = null // 点击叉号
    @property({ type: AudioSource }) destroyNodeAudio = null // 销毁
    @property({ type: AudioSource }) clickdaojubuttonAudio = null //点击道具按钮
    @property({ type: AudioSource }) achieveAudio = null //获得成就
    @property({ type: AudioSource }) getgoldAudio = null //获得金币
    @property({ type: AudioSource }) guestleaveAudio = null //送走一个客人
    @property({ type: AudioSource }) timeAudio = null //营业倒计时
    @property({ type: AudioSource }) successAudio = null //通关胜利
    @property({ type: AudioSource }) otherbuttonAudio = null //点击其他按钮
    //粒子系统
    @property(Node) match3Successparticle: Node = null;  // 三消粒子特效
    @property(Node) achieveleftparticle: Node = null;  // 成就左粒子特效
    @property(Node) achieverightparticle: Node = null;  // 成就右粒子特效
    @property(Node) achievestaticparticle: Node = null;  // 成就静态特效
    @property(Node) rankUpleftparticle: Node = null;  // 升段位左粒子特效
    @property(Node) rankUprightparticle: Node = null;  // 升段位右粒子特效
    @property(Node) rankUpstaticparticle: Node = null;  // 升段位静态特效
    //food配置
    //存储半径尺寸
    radius: number[] = [48, 58, 68, 78, 88, 98, 108];
    //存储摩擦力
    friction: number = 0.01;
    //存储弹性系数
    restitution: number = 0.02;
    //存储上边界y值
    limit: number = 100
    //存储密度;
    density: number = 10;
    //存储角阻尼
    angular_damping: number = 1;
    //存储线阻尼
    linear_damping: number = 1;
    //存储线速度
    linear_velocity: Vec2 = null;
    //存储是否为bullet
    isbullet: boolean;
    //存储当前服务的顾客
    curcustomer: any;
    //存储当前服务的顾客序号
    curcustomerindex: number = 0;
    //存储顾客位置
    customer_x: number = -208.5;
    customer_y: number = -276;
    //存储顾客饥饿度
    hungry: number[] = [];
    //存储营业额值
    money: number = 0;
    //存储不同食物消除增加的营业额
    food_val: number[] = [];
    //用于解决识别不了脚本类型问题
    temp: any;
    // 存储游戏配置
    gameConfig: any = null;
    //存储营业额与星星的兑换比例
    ratio: number;
    //存储游戏状态,0正常游戏，1游戏结束
    status: number = 0;
    //每个顾客固定营业额
    revenue_percustomer: number;
    //存储不同层数的食物种类.目前20层
    layers_categorys = [];
    //存储不同层数的食物种类数量
    layers_categorys_num = [];
    //存储第几天,后用作存储第几关，从0开始
    day: number = 0;
    //存储每一天的营业额目标
    revenue_goal: number[] = [];
    //存储气泡未遮挡的尺寸
    bubble_originsize: any;
    //存储倒计时,单位为秒
    time: number;
    //存储初始倒计时
    time_origin: number;
    //存储道具消除使用一次可以获得的消除次数
    destroynum: number;
    //存储当前可用消除的次数,初始为0
    curdestroynum: number = 0;
    //运动食物对象池,多个对象池，在一个数组中
    foodpools: NodePool[] = [];
    //table食物对象池,多个对象池，在一个数组中
    tablefoodpools: NodePool[] = [];
    //存储生成的食物的下标序列（对应种类序列）
    typeseries = [];
    //存储当前需要生成的食物在种类下标数组中的下标，从0开始递增，每次生成一个食物，下标加一
    curfoodindex: number = 0;
    //生成特殊食物的概率
    probability: number = 0;
    //存储名字到预制体数组下标的映射
    nametoindex: Map<string, number> = new Map<string, number>();
    //复活获得的时间
    revivetime: number;
    //总的层数
    layersnum: number;
    //每层多少个食物
    foodnumperlayer: number;
    hungryall: number = 0;
    revenue_goalall: number = 0;
    jingduall: number;
    //存储顾客表情的字典，用于中途换顾客表情
    imageDictionary: Record<string, SpriteFrame> = {};
    baseY: number;
    movedChildren = []; // 存储移出的节点
    wx: any;
    tt: any;
    isWX: boolean;
    isTT: boolean;
    isKS: boolean;
    videoAd: any; videoAdCallback: any;
    numDJ: number;
    lastActionType: string;
    adLoaded: boolean;
    isAdWatchedCompletely: boolean;
    actionRequired: boolean;
    arrNumDJ: number[];
    //调试模式
    isDebugMode: boolean = false;
    audioController: AudioController;
    musicFlag: boolean;
    soundFlag: boolean;
    vibrationFlag: boolean;
    isPaused: boolean;
    initData() {
        /********************************************** */
        //加载顾客表情图片
        this.loadImages();
        /*************************************8 */
        //初始化运动食物对象池
        for (let i = 0; i < 26; i++) {
            let tmppool = new NodePool();
            //每个预制体的对象池初始3个节点
            for (let j = 0; j < 3; j++) {
                let node = instantiate(this.foodprefabs[i]);
                tmppool.put(node);
            }
            this.foodpools.push(tmppool);
        }
        //初始化table食物对象池
        for (let i = 0; i < 26; i++) {
            let tmppool = new NodePool();
            //每个预制体的对象池初始3个节点
            for (let j = 0; j < 3; j++) {
                let node = instantiate(this.foodprefabls[i]);
                tmppool.put(node);
            }
            this.tablefoodpools.push(tmppool);
        }
        //重置foodprefab、foodpools、tablefoodpools数组的元素顺序，不包括特殊食物
        this.shufflefood();
        //存储食物姓名与index的关系,生成nametoindex
        for (let i = 0; i < 26; i++) {
            //获得相应对象池中某个元素
            let node = this.foodpools[i].get();
            this.nametoindex.set(node.name, i);
            //再将该元素加回去
            this.foodpools[i].put(node);
        }
        //初始化食物种类序列,以一定概率生成特殊食物
        for (let i = 0; i < this.layersnum; i++) {
            //用于存储该层所用的普通食材编号数组
            let indexs_all = this.layers_categorys[i];
            //再从中和特殊食材中选取layers_categorys_num[i]个编号
            let indexs = [];
            //flag用于存储普通食材是否被选取过
            let flag = [];
            for (let j = 0; j < indexs_all.length; j++) {
                flag.push(false);
            }
            //开始选取
            for (let j = 0; j < this.layers_categorys_num[i]; j++) {
                //判断从特殊食材中选还是从普通食材中选
                let t = Math.random();
                //选一个特殊食材
                if (t < this.probability) {
                    //22- 25选一个
                    let t = Math.floor(Math.random() * 4);
                    indexs.push(t + 22);
                }
                //否则，选一个普通食材
                else {
                    //获取食材编号
                    let size = indexs_all.length;
                    //0 - size-1下标
                    let randomindex = Math.floor(Math.random() * size);
                    //如果没有被选过，加入其中
                    if (flag[randomindex] == false) {
                        indexs.push(indexs_all[randomindex]);
                        flag[randomindex] = true;
                    }
                    //否则j--
                    else j--;
                }
            }
            //加入foodperlayer个食材下标，作为该层的食材
            for (let j = 0; j < this.foodnumperlayer; j++) {
                //获取食材编号
                let size = indexs.length;
                //0 - size-1下标
                let randomindex = Math.floor(Math.random() * size);
                let type = indexs[randomindex];
                this.typeseries.push(type);
            }
        }
        //生成60个食物
        for (let i = 0; i < 50; i++) {
            let type = this.typeseries[this.curfoodindex++];
            let x = Math.floor(Math.random() * 721) - 360;
            let y = 1100;
            //生成食物
            this.createFood(type, x, y);
        }
        /***************************************** */
        //liu
        this.baseY = 40
        //设置钱的位置
        //this.moneyfly.setPosition(new Vec3(10, -270, 0));
        this.moneyfly.setPosition(new Vec3(10, 0, 0));
        this.interim_progress.fillRange = 0;
        //开始时游戏进度
        this.progress_percent.string = '0%'
        this.isPaused = false;
        //广告接入
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
        } else if (this.isKS) {
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
        this.arrNumDJ = [3, 3, 3];
        //for (let i=0;i<4;i++){
        for (let i = 0; i < 3; i++) {
            this.bLabelDJ[i].string = `(3/3)`
        }
        //for (let j=0;j<4;j++){
        for (let j = 0; j < 3; j++) {
            this.arrLabelDJ[j].string = '+'
        }
        // 初始化音乐和震动设置
        this.initAudioAndVibration();
        // 初始化广告逻辑
        if (this.isWX) {
            const titles = this.gameConfig.sharetitles;
            // 随机选择一个标题
            const title = titles[Math.floor(Math.random() * titles.length)];
            // 创建包含所有图片URLs的数组
            const imageUrls = this.gameConfig.shareimageUrls;
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
        //清除本地记录
        //sys.localStorage.clear();
        //目前填饱的总饥饿度
        this.hungryall = 0;
        //总营业额
        this.revenue_goalall = this.revenue_goal[0] + this.revenue_goal[1] + this.revenue_goal[2] + this.revenue_goal[3] + this.revenue_goal[4]
        //初始化营业额
        let comp = this.moneynode.getComponent(Label);
        comp.string = this.money + '';
        //初始化第一天的目标营业额
        let comp_goal = this.goal_label.getComponent(Label);
        comp_goal.string = this.revenue_goal[this.day] + '';
        //获取气泡原始大小
        this.bubble_originsize = new Size(this.bubble_mask.getComponent(UITransform).contentSize.x, this.bubble_mask.getComponent(UITransform).contentSize.y);
        //设置初始为0
        this.bubble_mask.getComponent(UITransform).setContentSize(new Size(0, 0));
        //初始新一天面板不显示
        this.newdaynode.active = false;
        //初始下一阶段面板的文字
        this.newdaynode.getChildByName('word').getComponent(Sprite).spriteFrame = this.wordSprites[this.day + 1];
        //初始当前全局剩余时间
        this.time = this.time_origin;
        //初始游戏背景
        this.gamebgnode.getComponent(Sprite).spriteFrame = this.bgSprites[this.day];
        //初始倒计时
        let hour = Math.floor(this.time_origin / 60);
        let min = this.time_origin % 60;
        //补前置零
        if (min < 10) {
            this.timer.getComponent(Label).string = hour + ':0' + min;
        }
        else this.timer.getComponent(Label).string = hour + ':' + min;
        //添加schedule事件，每隔一秒调用更新timer函数
        this.schedule(this.updatetimer, 1);
    }
    updatetimer() {
        if (this.isPaused) {
            // 游戏失败或暂停时不继续计时
            return;
        }
        //时间减少
        if (this.time > 0) { //修改bug: 确保时间不减少到负数
            this.time--;
        }
        //更新显示
        let hour = Math.floor(this.time / 60);
        let min = this.time % 60;
        //补前置零
        if (min < 10) {
            this.timer.getComponent(Label).string = hour + ':0' + min;
        }
        else this.timer.getComponent(Label).string = hour + ':' + min;
        //判断游戏是否结束，时间是否到达
        if (this.time < 0) {
            this.isPaused = true;
            //游戏结束逻辑
            //关闭物理引擎，使得不在运动,默认是开启的
            PhysicsSystem2D.instance.enable = false;
            //切换状态
            this.status = 1;
            //打开结束界面
            this.gameover.active = true;
            this.showMask(this.maskLayer);
            // 播放失败的音效
            if (this.soundFlag) {
                this.failAudio.play();
            }
            // 暂停背景音乐
            if (this.audioController && this.musicFlag) {
                this.audioController.toggleBGM(false); // 暂时关闭音乐
            }
            //food节点设置不活跃，防止点击
            this.foodsRoot.active = false;
            //取消计时事件
            this.unschedule(this.updatetimer);
        }
        if (this.time == 30 || this.time == 60) {
            if (this.soundFlag) {
                // 营业倒计时音效
                this.timeAudio.play();
            }
        }
    }
    onEvent() {
        //更新新顾客的下标,循环
        this.curcustomerindex++;
        this.curcustomerindex = this.curcustomerindex % 12;
        if (this.soundFlag) {
            // 获得金币音效
            this.getgoldAudio.play();
            // 延迟0.5秒后播放送走客人音效
            setTimeout(() => {
                this.guestleaveAudio.play();
            }, 500);
        }
        // 钱飞的动画
        tween(this.moneyfly)
            //.to(1, { position: new Vec3(200, 800, 0) }) // 使用 .to 表示绝对变化到新的位置
            .to(0.8, { position: new Vec3(200, 1200, 0) })
            .start();
        //右移出屏幕后做其他操作
        tween(this.curcustomer)
            //.by(1, {position:  new Vec3(720, 0, 0)})
            .by(1, { position: new Vec3(720, 0, 0) })
            .call(() => {
                //this.curcustomer.destroy();
            })
            .start();
        //新的乘客来到
        this.curcustomer = this.createCustomer(this.curcustomerindex);
        //来的动画
        tween(this.curcustomer)
            //.by(1, {position:  new Vec3(720, 0, 0)})
            .by(1, { position: new Vec3(620, 0, 0) })
            .call(() => {
                setTimeout(() => {
                    this.updateData_newlevel(); //修改bug: 更新数据
                }, 1500); // 延迟0.5秒，确保动画完成
            })
            .start();
        // 延迟0.5秒后金币归为
        setTimeout(() => {
            this.moneyfly.setPosition(new Vec3(10, 0, 0));
        }, 1500);
    }
    updateData_newlevel() {
        //设置饥饿度
        let t = this.curcustomer.getComponent('Customer');
        t.leftnum = this.hungry[this.curcustomerindex];
        //更新营业额
        //每位顾客的营业额在基础值上加一个0-20的随机数
        let randommoney = Math.floor(Math.random() * 21);
        this.money += randommoney;
        this.money += this.revenue_percustomer;
        let comp = this.moneynode.getComponent(Label);
        comp.string = this.money + '';
        //更新每日营业额进度条
        this.progressbar_day.getComponent(ProgressBar).progress = this.money / this.revenue_goal[this.day];
        let a = this.money / this.revenue_goal[this.day] * 100
        if (a > 100) {
            a = 100
        }
        //this.progress_percent.string = (this.money / this.revenue_goal[this.day]* 100).toFixed(2) + '%'
        this.progress_percent.string = (a).toFixed(2) + '%'
        //更新顾客进度条
        this.progressbar.getComponent(ProgressBar).progress = 0;
        //更新气泡
        this.bubble_mask.getComponent(UITransform).setContentSize(new Size(0, 0));
        //更新表情
        this.emotionnode.getComponent(Sprite).spriteFrame = this.emotionSprites[Emotion.HUNGRY];
        //判断是否过关
        //判断是否达到目标营业额，如果是，换到下一天，
        if (this.money >= this.revenue_goal[this.day]) {
            if (this.soundFlag) {
                // 播放升段位的音效
                this.rankUpAudio.play();
            }
            //判断是否成功
            if (this.day == 3) {
                //显示成功面板
                this.successpanel.active = true;
                if (this.soundFlag) {
                    // 通关胜利的音效
                    this.successAudio.play();
                }
                // 暂停背景音乐
                if (this.audioController && this.musicFlag) {
                    this.audioController.toggleBGM(false); // 暂时关闭音乐
                }
                return;
            }
            //显示过关面板
            this.newdaynode.active = true;
            this.isPaused = true; // 停止计时
            //播放粒子特效
            this.rankUpleftparticle.getComponent(ParticleSystem2D).resetSystem(); // 重置并播放左闪
            this.rankUprightparticle.getComponent(ParticleSystem2D).resetSystem(); // 重置并播放右闪
            this.rankUpstaticparticle.getComponent(ParticleSystem2D).resetSystem(); // 重置并播放静态闪
            //过渡面板中总进度条左移
            tween(this.targetNode)
                .to(0.2, { position: new Vec3(this.targetNode.position.x - 107, this.targetNode.position.y, this.targetNode.position.z) })
                .start();
            //过渡面板中黄色进度条右移
            tween(this.interim_progress)
                .to(0.2, { fillRange: (this.day + 1) / 4 })
                .start();
            this.interim_circle[this.day + 1].spriteFrame = this.interim_circle_Sprites[this.day + 1]
            this.duanwei.spriteFrame = this.duanwei_Sprites[this.day + 1]
            //成就
            // 当前段位
            let currentDay = this.day;
            // 获取存储在本地的段位计数信息
            let dayCountKey = `dayCount_${currentDay}`;
            let count = sys.localStorage.getItem(dayCountKey);
            // 如果之前没有记录，则初始化计数
            // 如果之前没有记录或记录非数字，则初始化计数
            if (count === null || count === undefined || isNaN(parseInt(count))) {
                count = 0;
            } else {
                // 如果有记录，转换为整数类型
                count = parseInt(count);
            }
            // 更新次数
            count++;
            // 保存新的次数到本地存储
            sys.localStorage.setItem(dayCountKey, count.toString());
            // 可以选择输出当前的计数情况，用于调试
            console.log(`Day ${currentDay} count updated to: ${count}`);
            // 过一段时间隐藏过关面板，然后根据成就触发情况显示成就面板
            this.scheduleOnce(() => {
                // 隐藏过关面板
                //this.newdaynode.active = false;
                //this.isPaused = false; // 恢复计时或其他活动
                // 检查并处理成就
                let achievementTriggered = this.checkAndHandleAchievements(currentDay, count);
                if (achievementTriggered) {
                    this.scheduleOnce(() => {
                        // 再过一段时间关闭成就面板
                        this.scheduleOnce(() => {
                            this.chengjiuNode.active = false;
                            this.isPaused = false; // 恢复计时
                            //更新day
                            this.day++;
                            //更新游戏bg
                            this.gamebgnode.getComponent(Sprite).spriteFrame = this.bgSprites[this.day];
                            //更新目标营业额
                            let comp_goal = this.goal_label.getComponent(Label);
                            comp_goal.string = this.revenue_goal[this.day] + '';
                            //更新局外星星
                            //第一次返回时，revenue还未设置
                            if (!sys.localStorage.getItem('revenue')) {
                                sys.localStorage.setItem('revenue', this.money / this.ratio);
                            }
                            //更新星星数
                            let tmp = parseInt(sys.localStorage.getItem('revenue'));
                            sys.localStorage.setItem('revenue', this.money / this.ratio + tmp);
                            //更新游戏营业额
                            comp.string = 0 + '';
                            this.money = 0;
                            //更新每日营业额进度条
                            this.progressbar_day.getComponent(ProgressBar).progress = 0;
                            this.progress_percent.string = '0%'
                            // //隐藏过关面板
                            // this.newdaynode.active = false;
                            // this.chengjiuNode.active = false; //成就面板关闭
                            // this.isPaused = false; // 恢复计时
                            //更新下一阶段文字
                            this.newdaynode.getChildByName('word').getComponent(Sprite).spriteFrame = this.wordSprites[this.day + 1]
                        }, 3); // 显示成就面板3秒后关闭
                    }, 3); // 过关面板关闭3秒后显示成就面板
                } else {
                    //更新day
                    this.day++;
                    //更新游戏bg
                    this.gamebgnode.getComponent(Sprite).spriteFrame = this.bgSprites[this.day];
                    //更新目标营业额
                    let comp_goal = this.goal_label.getComponent(Label);
                    comp_goal.string = this.revenue_goal[this.day] + '';
                    //更新局外星星
                    //第一次返回时，revenue还未设置
                    if (!sys.localStorage.getItem('revenue')) {
                        sys.localStorage.setItem('revenue', this.money / this.ratio);
                    }
                    //更新星星数
                    let tmp = parseInt(sys.localStorage.getItem('revenue'));
                    sys.localStorage.setItem('revenue', this.money / this.ratio + tmp);
                    //更新游戏营业额
                    comp.string = 0 + '';
                    this.money = 0;
                    //更新每日营业额进度条
                    this.progressbar_day.getComponent(ProgressBar).progress = 0;
                    this.progress_percent.string = '0%'
                    // //隐藏过关面板
                    this.newdaynode.active = false;
                    // this.chengjiuNode.active = false; //成就面板关闭
                    this.isPaused = false; // 恢复计时
                    //更新下一阶段文字
                    this.newdaynode.getChildByName('word').getComponent(Sprite).spriteFrame = this.wordSprites[this.day + 1]
                }
            }, 3); // 显示过关面板3秒后关闭
        }
    }
    onLoad() {
        //初始时，游戏正常进行，结束界面隐藏
        this.gameover.active = false;
        this.maskLayer.active = false;
        //读入config
        resources.load("json/config", JsonAsset, (err, asset: JsonAsset) => {
            if (err) {
                console.error("Failed to load config.json", err);
                return;
            }
            // 使用JsonAsset的json属性访问JSON内容
            this.gameConfig = asset.json;
            this.limit = this.gameConfig.uplimitconfig.limit;
            let foodconf = this.gameConfig.foodconfig;
            this.radius = foodconf.radius
            this.friction = foodconf.friction;
            this.restitution = foodconf.friction;
            this.density = foodconf.density;
            this.angular_damping = foodconf.angulardamping;
            this.linear_damping = foodconf.lineardamping;
            this.linear_velocity = new Vec2(foodconf.linearvelocity.x, foodconf.linearvelocity.y);
            this.isbullet = foodconf.isbullet;
            //顾客饥饿度
            this.hungry = this.gameConfig.hungry;
            //食物消除饥饿能力
            this.food_val = this.gameConfig.food_val;
            //星星营业额比例
            this.ratio = this.gameConfig.ratio;
            //不层层的食物种类
            this.layers_categorys = this.gameConfig.layers_categorys;
            //顾客固定营业额
            this.revenue_percustomer = this.gameConfig.revenue_percustomer;
            //不同层数的食物种类数量
            this.layers_categorys_num = this.gameConfig.layers_categorys_num;
            //收入目标数组
            this.revenue_goal = this.gameConfig.revenue_goal;
            //console.log(this.revenue_goal);
            //计时器初始值
            this.time_origin = this.gameConfig.time_origin;
            //console.log(this.time_origin);
            //消除道具可用次数
            this.destroynum = this.gameConfig.destroynum;
            //console.log(this.destroynum);
            //特殊食物出现概率
            this.probability = this.gameConfig.probability;
            //复活时间
            this.revivetime = this.gameConfig.revivetime;
            //layer总数
            this.layersnum = this.gameConfig.layersnum;
            //每层的食物数
            this.foodnumperlayer = this.gameConfig.foodnumperlayer;
            this.initData();
            if (this.isTT) {
                // 初始化douyin激励视频广告
                this.initdouyinJiLiShiPin();
                console.log("初始化抖音广告")
            } else if (this.isKS) {
                this.initKuaiShouJiLiShiPin()
                console.log("初始化快手广告")
            }
            // 初始化广告逻辑
            if (this.isWX) {
                this.initJiLiShiPin();
                console.log("初始化微信广告")
                this.wx.onShareAppMessage(() => {
                    return {
                        //   title: title,
                        //   imageUrl: imageUrl // 图片 URL
                    }
                })
                this.wx.showShareMenu({
                    withShareTicket: true,
                    menus: ['shareAppMessage', 'shareTimeline']
                })
            }
            //随机顾客信息
            this.shufflecustomer();
            //初始化第一位乘客顾客,并使服务顾客定义为初始化的顾客
            this.curcustomer = this.createCustomer(this.curcustomerindex);
            //来的动画
            tween(this.curcustomer)
                //.by(0.5, {position:  new Vec3(720, 0, 0)})
                .by(0.5, { position: new Vec3(620, 0, 0) })
                .start();
            //设置饥饿度
            let t = this.curcustomer.getComponent('Customer');
            t.leftnum = this.hungry[this.curcustomerindex];
            //捕获顾客触发的喂饱了的信号，执行切换顾客操作
            this.node.on('event', this.onEvent, this);
            //设置表情为饥饿
            this.emotionnode.getComponent(Sprite).spriteFrame = this.emotionSprites[Emotion.HUNGRY];
            //设置上边界高度
            //this.limittop.setPosition(0, this.limit);
            this.node.active = true;
        });
    }
    start() {
        //this.schedule(this.createFood, 1);
    }
    update(deltaTime: number) {
        //更新物理引擎
        //PhysicsSystem2D.instance.update(deltaTime);
        //判断是否超时
        if (this.time < 0) {
            this.status = 1;
        }
        //处于游戏失败状态
        if (this.status == 1) {
            return;
        }
        //更新食物阴影信息
        for (let i = 0; i < this.foodsRoot.children.length; i++) {
            let fooditem = this.foodsRoot.children[i];
            //获取sprite
            const sprite = fooditem.getComponent(Sprite);
            if (this.checkFoodinteract(i)) {
                sprite.color = new Color(255, 255, 255);
            }
            else {
                sprite.color = new Color(167, 161, 161);
            }
        }
    }
    //生成食物并加入到节点中,index是食物的下标，x是x方向坐标, y 是 y方向坐标,返回生成的食物
    createFood(index: number, x: number, y: number) {
        // 创建食物实例
        let food = new Node;
        let tableitem = new Node;
        //如果缓冲池中有空闲节点，直接使用
        if (this.foodpools[index].size() > 0) {
            food = this.foodpools[index].get();
        }
        //否则实例化
        else food = instantiate(this.foodprefabs[index]);
        //如果缓冲池中有空闲节点，直接使用
        if (this.tablefoodpools[index].size() > 0) {
            tableitem = this.tablefoodpools[index].get();
        }
        //否则实例化
        else tableitem = instantiate(this.foodprefabls[index]);
        //获取表食物 ui
        const comp_tableui = tableitem.getComponent(UITransform);
        //设置表食物大小
        comp_tableui.contentSize.set(90, 90);
        //获取食物ui
        const comp_ui = food.getComponent(UITransform);
        //获取collider
        const comp_co = food.getComponent(CircleCollider2D);
        //设置食物大小
        comp_ui.contentSize.set(this.radius[index % 7] * 2, this.radius[index % 7] * 2);
        comp_co.radius = this.radius[index % 7];
        //设置摩擦系数
        comp_co.friction = this.friction;
        //设置弹性系数
        comp_co.restitution = this.restitution;
        //设置密度
        comp_co.density = this.density;
        //设置角阻尼
        const comp_rigid = food.getComponent(RigidBody2D);
        comp_rigid.angularDamping = this.angular_damping;
        //设置线阻尼
        comp_rigid.linearDamping = this.linear_damping;
        //设置初始速度
        comp_rigid.linearVelocity = this.linear_velocity;
        //设置bullet
        comp_rigid.bullet = this.isbullet;
        //获取sprite
        const comp_sprite = food.getComponent(Sprite);
        //初始时都为灰色
        comp_sprite.color = new Color(167, 161, 161);
        // 设置食物位置
        food.setPosition(x, y, 0);
        // 将食物添加到场景中
        this.foodsRoot.addChild(food);
        // 添加点击事件监听器
        food.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
            //获取食物尺寸
            const comp = food.getComponent(UITransform);
            const dy = comp.contentSize.y / 2;
            //如果点击节点的位置在分界线下,可交互
            if (food.position.y - dy < this.limit) {
                if (this.soundFlag) {
                    // 播放点击卡牌的音效
                    this.clickFoodAudio.play();
                }
                //判断当前可消除次数是否大于零
                if (this.curdestroynum > 0) {
                    //消耗可消除次数
                    this.curdestroynum--;
                    //将食物节点加入到缓冲池中,添加新的节点
                    let tmpindex = this.typeseries[this.curfoodindex++];
                    this.createFood(tmpindex, food.position.x, 1100);
                    //关闭删除节点的监听事件
                    food.off(Node.EventType.TOUCH_START);
                    this.foodpools[index].put(food);
                    //food.destroy();
                    return;
                }
                //否则继续接下来的逻辑
                //删除食物节点
                //food.destroy();
                //将食物节点加入到缓冲池中,添加新的节点
                let tmpindex = this.typeseries[this.curfoodindex++];
                this.createFood(tmpindex, food.position.x, 1100);
                //关闭删除节点的监听事件
                food.off(Node.EventType.TOUCH_START);
                this.foodpools[index].put(food);
                //获取食物在点击时的世界坐标
                let pos = new Vec3(event.getUILocation().x, event.getUILocation().y, 0);
                //转化为table节点的本地坐标
                let uitrans = this.foodtable.getComponent(UITransform);
                let locpos = uitrans.convertToNodeSpaceAR(pos);
                tableitem.position = locpos;
                let itemindex = this.addfoodtableChild(tableitem);
                //然后从点击的位置移动到table中相应位置，table中其他元素也相应移动
                //创建本节点的动画
                //获取终点的本地坐标
                let endpos = new Vec3(45 + itemindex * 90, 0, 0);
                tween(tableitem)
                    .to(0.2, { position: endpos })
                    .start();
                //循环创建后面每个节点的动画（右移一个单位），并添加到 tweens 数组中
                for (let i = itemindex + 1; i < this.foodtable.children.length; i++) {
                    let endpos = new Vec3(45 + i * 90, 0, 0);
                    let tweenitem = tween(this.foodtable.children[i])
                        .to(0.2, { position: endpos })
                        .start();
                }
                //执行消除逻辑
                this.checkAnddestroy(itemindex, index);
            }
        }, this);
    }
    //生成顾客, index是顾客的种类下标,挂载到customerroot下
    createCustomer(index: number): any {
        let cus = instantiate(this.customerprefabs[index]);
        //获取顾客 ui
        const comp_cusui = cus.getComponent(UITransform);
        //设置顾客大小
        cus.scale = new Vec3(0.5, 0.5);
        //设置位置
        let dx = comp_cusui.contentSize.x / 2 + 80;
        cus.setPosition(dx / 2 - 360 - 720, this.customer_y);
        this.customerRoot.addChild(cus);
        return cus;
    }
    //判断食物是否在分界线下，判断标准是有一部分在分界线下面就行, 传入index为数组下标
    checkFoodinteract(index: number) {
        let fooditem = this.foodsRoot.children[index];
        //获取食物尺寸
        const comp = fooditem.getComponent(UITransform);
        const dy = comp.contentSize.y / 2;
        return fooditem.position.y - dy < this.limit;
    }
    // 检查队列中是否有三个相同类型的食物,返回同最后一个元素同类型的食物节点
    checkThreeSameFoods(): any {
        if (this.foodtable.children.length < 3) {
            return false;
        }
        let lastIndex = this.foodtable.children.length - 1;
        let lastNode = this.foodtable.children[lastIndex];
        //遍历
        let nodes = [];
        for (let i = 0; i < this.foodtable.children.length; i++) {
            let node = this.foodtable.children[i];
            if (node.name == lastNode.name)
                nodes.push(node);
        }
        return nodes;
    }
    //每次加载都刷新foodprefabs和foodprefabs，不包括特殊食物
    shufflefood() {
        //shuffle普通食物
        for (let i = 22 - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // 生成一个随机索引
            [this.foodprefabs[i], this.foodprefabs[j]] = [this.foodprefabs[j], this.foodprefabs[i]]; // 交换元素位置
            [this.foodprefabls[i], this.foodprefabls[j]] = [this.foodprefabls[j], this.foodprefabls[i]]; // 交换元素位置
            [this.foodpools[i], this.foodpools[j]] = [this.foodpools[j], this.foodpools[i]]; // 交换元素位置
            [this.tablefoodpools[i], this.tablefoodpools[j]] = [this.tablefoodpools[j], this.tablefoodpools[i]]; // 交换元素位置
        }
    }
    shufflecustomer() {
        for (let i = this.customerprefabs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // 生成一个随机索引
            [this.customerprefabs[i], this.customerprefabs[j]] = [this.customerprefabs[j], this.customerprefabs[i]]; // 交换元素位置
            //[this.hungry[i], this.hungry[j]] = [this.hungry[j], this.hungry[i]]; // 交换元素位置
        }
    }
    //判断某节点是否在游戏界面中,position是以场景中心为原点的本地坐标
    isinScene(item: Node): boolean {
        let position = item.position;
        let comp = item.getComponent(UITransform);
        let height = comp.contentSize.y;
        return item.position.y + height / 2 <= 640;
    }
    //食物消除逻辑, itemindex是插入的新table元素在table中的下标，index是food在预制体数组中的下标
    checkAnddestroy(itemindex: number, index: number) {
        //判断是否有三个相同元素
        if (itemindex >= 2) {
            let children = this.foodtable.children;
            //判断三个元素是否是同种类型
            if (children[itemindex].name == children[itemindex - 1].name && children[itemindex].name == children[itemindex - 2].name) {
                //左右两边的移到中间
                let endpos = new Vec3(45 + (itemindex - 1) * 90, 0, 0);
                // 获取三个元素的全局坐标
                let pos1 = this.foodtable.getComponent(UITransform).convertToWorldSpaceAR(children[itemindex].position);
                let pos2 = this.foodtable.getComponent(UITransform).convertToWorldSpaceAR(children[itemindex - 1].position);
                let pos3 = this.foodtable.getComponent(UITransform).convertToWorldSpaceAR(children[itemindex - 2].position);
                // 转换中心位置的全局坐标到match3Successparticle的父节点的局部坐标
                //let centerGlobalPosition = new Vec3(centerX, centerY, centerZ);
                let centerGlobalPosition = new Vec3(pos2.x, pos2.y - 10, 0);
                let particleLocalPosition = this.match3Successparticle.parent.getComponent(UITransform).convertToNodeSpaceAR(centerGlobalPosition);
                // 设置粒子效果的位置
                this.match3Successparticle.setPosition(particleLocalPosition);
                tween(children[itemindex])
                    .delay(0.2)
                    .to(0.2, { position: endpos })
                    .start();
                tween(children[itemindex - 2])
                    .delay(0.2)
                    .to(0.2, { position: endpos })
                    .call(() => {
                        this.match3Successparticle.getComponent(ParticleSystem2D).resetSystem(); // 重置并播放粒子系统
                        //获取未删除前的table数组大小，避免同步时改变children数组大小
                        let length = children.length;
                        //右边的元素移到左边
                        for (let i = itemindex + 1; i < length; i++) {
                            tween(children[i])
                                .by(0.2, { position: new Vec3(-270, 0, 0) })
                                .start();
                        }
                        // 手机震动效果
                        if (this.isWX && window['wx'].vibrateShort && this.vibrationFlag) {
                            window['wx'].vibrateShort({
                                success: function () {
                                    //console.log('手机震动成功');
                                },
                                fail: function () {
                                    console.error('手机震动失败');
                                }
                            });
                        } else if (this.isTT && window['tt'].vibrateShort && this.vibrationFlag) {
                            window['tt'].vibrateShort({
                                success: function () {
                                    //console.log('手机抖音震动成功');
                                },
                                fail: function () {
                                    console.error('手机抖音震动失败');
                                }
                            });
                        } else if (this.isKS && ks.vibrateShort && this.vibrationFlag) {
                            ks.vibrateShort({
                                success: function () {
                                    console.log('手机快手震动成功');
                                },
                                fail: function () {
                                    console.error('手机快手震动失败');
                                }
                            });
                        }
                        //删除三个元素，加入到缓冲池
                        for (let i = 0; i < 3; i++) {
                            //children[itemindex - i].destroy();
                            this.tablefoodpools[index].put(children[itemindex - i]);
                        }
                        //判断是否是特殊食材
                        //冒烤鸭
                        if (index == 22) {
                            if (this.soundFlag) {
                                // 播放三消除特殊食物的音效
                                this.match3SpecialfoodAudio.play();
                            }
                            //更新饥饿度
                            let script = this.curcustomer.getComponent('Customer');
                            //实际-2，后面统一会-1
                            script.leftnum -= 1;
                        }
                        //冰淇淋
                        if (index == 23) {
                            if (this.soundFlag) {
                                // 播放三消除特殊食物的音效
                                this.match3SpecialfoodAudio.play();
                            }
                            this.time += 10;
                        }
                        //朝天椒
                        if (index == 24) {
                            if (this.soundFlag) {
                                // 播放三消除特殊食物的音效
                                this.match3SpecialfoodAudio.play();
                            }
                            //更新饥饿度
                            let script = this.curcustomer.getComponent('Customer');
                            //实际-3
                            script.leftnum -= 2;
                        }
                        //红蘑菇
                        if (index == 25) {
                            if (this.soundFlag) {
                                // 播放三消除特殊食物的音效
                                this.match3SpecialfoodAudio.play();
                            }
                            this.time += 20;
                        } else {
                            if (this.soundFlag) {
                                // 播放三消成功的音效
                                this.match3SuccessAudio.play();
                            }
                        }
                        //巨坑
                        //再更新其他元素的位置，有可能因为点击频繁没有在最后的位置
                        //循环创建每个节点的动画
                        for (let i = 0; i < this.foodtable.children.length; i++) {
                            let endpos = new Vec3(45 + i * 90, 0, 0);
                            let tweenitem = tween(this.foodtable.children[i])
                                .to(0.2, { position: endpos })
                                .start();
                        }
                        //更新饥饿度
                        let script = this.curcustomer.getComponent('Customer');
                        script.leftnum -= 1;
                        //console.log(script.leftnum);
                        //更新进度条
                        let progress = this.progressbar.getComponent(ProgressBar).progress;
                        progress = Number(this.hungry[this.curcustomerindex] - script.leftnum) / this.hungry[this.curcustomerindex];
                        //增Liu
                        //总填饱的进度
                        this.progressbar.getComponent(ProgressBar).progress = progress;
                        //更新气泡
                        let comp_bubble = this.bubble_mask.getComponent(UITransform);
                        console.log(this.bubble_originsize.x)
                        comp_bubble.setContentSize(new Size(this.bubble_originsize.x, progress * this.bubble_originsize.y));
                        //增Liu
                        //顾客表情的图片是第几张
                        let numericValue = parseInt(this.curcustomer.name.substring(3)) - 1;
                        //更新表情，不是特殊食物时
                        if (progress >= 1 / 3 && progress < 2 / 3 && index < 22) {
                            this.emotionnode.getComponent(Sprite).spriteFrame = this.emotionSprites[Emotion.SEMI_FULL];
                            //增Liu
                            //this.curcustomer.getComponent(Sprite).spriteFrame = this.imageDictionary[`img${numericValue}_${2}`]
                        }
                        else if (progress >= 2 / 3 && index < 22) {
                            this.emotionnode.getComponent(Sprite).spriteFrame = this.emotionSprites[Emotion.FULL];
                            //增Liu
                            //this.curcustomer.getComponent(Sprite).spriteFrame = this.imageDictionary[`img${numericValue}_${3}`]
                        }
                        //特殊食物，特殊表情
                        else if (index >= 22) {
                            this.emotionnode.getComponent(Sprite).spriteFrame = this.emotionSprites[Emotion.SURPRISE];
                            //增Liu
                            //this.curcustomer.getComponent(Sprite).spriteFrame = this.imageDictionary[`img${numericValue}_${4}`]
                        }
                    })
                    .start();
            }
            //否则
            else {   //等待动画结束
                this.scheduleOnce(() => {
                    //判断原有的规模是不是已经达到8，如果是，则游戏失败
                    if (this.foodtable.children.length == 8) {
                        //关闭物理引擎，使得不在运动,默认是开启的
                        PhysicsSystem2D.instance.enable = false;
                        //切换状态
                        this.status = 1;
                        //打开结束界面
                        this.gameover.active = true;
                        this.showMask(this.maskLayer);
                        // 播放失败的音效
                        if (this.soundFlag) {
                            this.failAudio.play();
                        }
                        // 暂停背景音乐
                        if (this.audioController && this.musicFlag) {
                            this.audioController.toggleBGM(false); // 暂时关闭音乐
                        }
                        //food节点设置不活跃，防止点击
                        this.foodsRoot.active = false;
                        //取消计时
                        //this.progressbar.active = false;
                        //return;
                    }
                }, 0.4);
            }
        }
        //itemindex  < 2,判断是否游戏失败
        else {
            //等待动画结束
            this.scheduleOnce(() => {
                //判断原有的规模是不是已经达到8，如果是，则游戏失败
                if (this.foodtable.children.length == 8) {
                    //关闭物理引擎，使得不在运动,默认是开启的
                    PhysicsSystem2D.instance.enable = false;
                    //切换状态
                    this.status = 1;
                    //打开结束界面
                    this.gameover.active = true;
                    this.showMask(this.maskLayer);
                    // 播放失败的音效
                    if (this.soundFlag) {
                        this.failAudio.play();
                    }
                    // 暂停背景音乐
                    if (this.audioController && this.musicFlag) {
                        this.audioController.toggleBGM(false); // 暂时关闭音乐
                    }
                    //food节点设置不活跃，防止点击
                    this.foodsRoot.active = false;
                    //this.progressbar.active = false;
                    //return;
                }
            }, 0.4);
        }
    }
    //为移出的节点添加点击事件
    addoutfoodClickEvent(child: Node) {
        child.once(Node.EventType.TOUCH_START, (event: EventTouch) => {
            //获取该child在点击时的世界坐标
            let pos = new Vec3(event.getUILocation().x, event.getUILocation().y, 0);
            //转化为table节点的本地坐标
            let uitrans = this.foodtable.getComponent(UITransform);
            let locpos = uitrans.convertToNodeSpaceAR(pos);
            let itemindex = this.addfoodtableChild(child);
            //然后从点击的位置移动到table中相应位置，table中其他元素也相应移动
            //创建本节点的动画
            //获取终点的本地坐标
            let endpos = new Vec3(45 + itemindex * 90, 0, 0);
            tween(child)
                .to(0.2, { position: endpos })
                .start();
            //循环创建后面每个节点的动画（右移一个单位），并添加到 tweens 数组中
            for (let i = itemindex + 1; i < this.foodtable.children.length; i++) {
                let endpos = new Vec3(45 + i * 90, 0, 0);
                let tweenitem = tween(this.foodtable.children[i])
                    .to(0.2, { position: endpos })
                    .start();
            }
            // 检查是否在移出数组中
            let movedIndex = this.movedChildren.indexOf(child);
            if (movedIndex !== -1) {
                // 从移出的节点数组中删除
                this.movedChildren.splice(movedIndex, 1);
            }
            // 更新下方卡牌的状态
            this.updateBelowCards(child);
            //找到该child在prefabs中的下标
            let index = this.nametoindex.get(child.name);
            //执行消除逻辑
            this.checkAnddestroy(itemindex, index);
        }, this);
    }
    //按钮逻辑
    //移出按钮
    moveout_btn_onClick(event: EventTouch) {
        if (this.soundFlag) {
            // 播放点击卡牌的音效
            this.clickFoodAudio.play();
        }
        //liu, 基础Y位置
        let baseY = this.baseY;
        this.numDJ = 0
        //判断当前可用次数状态
        //获取num节点
        let numnode = this.moveout.getChildByName('移出num');
        //获取string
        let num = numnode.getComponent(Label).string;
        //根据string进行不同处理
        //如果道具数量为0，弹出获取途径
        if (num == '+') {
            //弹出面板
            this.moveoutpanel.active = true;
        }
        //如果道具数量为1
        if (num == '1') {
            //消耗道具数量
            numnode.getComponent(Label).string = '+';
            //获取foodtable的children数组
            let children = this.foodtable.children;
            //如果大小为0
            if (children.length == 0) {
                console.log("没有可移出的食物");
            }
            //如果大小为1
            if (children.length == 1) {
                //最左边食物挂载到temptable上
                let child = children[0];
                this.movedChildren.push(child); // 添加到移出的节点数组
                child.parent = this.temptable;
                //移动到相应位置，动画
                tween(child)
                    //.by(0.2, { position: new Vec3(450, 100, 0)})
                    .by(0.2, { position: new Vec3(450, baseY, 0) })
                    .start();
                //为移出的节点添加点击监听事件，因为只会触发一次，所以用once
                this.addoutfoodClickEvent(child);
                console.log(1);
                // 更新基础Y位置
                this.baseY = baseY + 30;
                // 检查重叠
                //this.checkOverlapOnMoveOut(child, this.movedChildren);
                this.checkOverlap(this.movedChildren)
            }
            //如果大小为2
            if (children.length == 2) {
                //最左边两个食物
                for (let i = 0; i < 2; i++) {
                    //挂载到temptable上,挂载之后child就被删除了，所以下一次还是移除下标为0的元素
                    let child = children[0];
                    this.movedChildren.push(child); // 添加到移出的节点数组
                    child.parent = this.temptable;
                    //移动到相应位置，动画
                    tween(child)
                        //.by(0.2, { position: new Vec3(450, 100, 0)})
                        .by(0.2, { position: new Vec3(450, baseY, 0) }) // 修改bug
                        .start();
                    //为移出的节点添加点击监听事件，因为只会触发一次，所以用once
                    this.addoutfoodClickEvent(child);
                    console.log(2);
                }
                this.checkOverlap(this.movedChildren)
                // 更新基础Y位置
                this.baseY = baseY + 30;
            }
            //如果大小 >= 3
            if (children.length >= 3) {
                //移出最左边三个食物
                for (let i = 0; i < 3; i++) {
                    //挂载到temptable上,挂载之后child就被删除了，所以下一次还是移除下标为0的元素
                    let child = children[0];
                    this.movedChildren.push(child);
                    child.parent = this.temptable;
                    //移动到相应位置，动画
                    tween(child)
                        //.by(0.2, { position: new Vec3(450, 100, 0)})
                        .by(0.2, { position: new Vec3(450, baseY, 0) }) // 修改bug
                        .start();
                    //为移出的节点添加点击监听事件，因为只会触发一次，所以用once
                    this.addoutfoodClickEvent(child);
                    //this.movedChildren.push(child);
                }
                this.checkOverlap(this.movedChildren)
                // 更新基础Y位置
                this.baseY = baseY + 30;
                //剩余的所有食物向左移动三个位置
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    tween(child)
                        .by(0.2, { position: new Vec3(-270, 0, 0) })
                        .start();
                }
                console.log(3);
            }
            // 检查移出节点的重叠
            //this.checkOverlap(this.movedChildren);
        }
    }
    //移出逻辑
    moveoutAction() {
        //获取foodtable的children数组
        let children = this.foodtable.children;
        //如果大小为0
        if (children.length == 0) {
            console.log("没有可移出的食物");
        }
        //liu, 基础Y位置
        let baseY = this.baseY;
        //如果大小为1
        if (children.length == 1) {
            //最左边食物挂载到temptable上
            let child = children[0];
            this.movedChildren.push(child); // 添加到移出的节点数组
            child.parent = this.temptable;
            //移动到相应位置，动画
            tween(child)
                //.by(0.2, { position: new Vec3(450, 100, 0)})
                .by(0.2, { position: new Vec3(450, baseY, 0) })
                .start();
            //为移出的节点添加点击监听事件，因为只会触发一次，所以用once
            this.addoutfoodClickEvent(child);
            console.log(1);
            // 更新基础Y位置
            this.baseY = baseY + 30;
            this.checkOverlap(this.movedChildren)
        }
        //如果大小为2
        if (children.length == 2) {
            //最左边两个食物
            for (let i = 0; i < 2; i++) {
                //挂载到temptable上,挂载之后child就被删除了，所以下一次还是移除下标为0的元素
                let child = children[0];
                child.parent = this.temptable;
                //移动到相应位置，动画
                tween(child)
                    //.by(0.2, { position: new Vec3(450, 100, 0)})
                    .by(0.2, { position: new Vec3(450, baseY, 0) })
                    .start();
                //为移出的节点添加点击监听事件，因为只会触发一次，所以用once
                this.addoutfoodClickEvent(child);
                this.movedChildren.push(child);
                console.log(2);
            }
            this.checkOverlap(this.movedChildren)
            // 更新基础Y位置
            this.baseY = baseY + 30;
        }
        //如果大小 >= 3
        if (children.length >= 3) {
            //移出最左边三个食物
            for (let i = 0; i < 3; i++) {
                //挂载到temptable上,挂载之后child就被删除了，所以下一次还是移除下标为0的元素
                let child = children[0];
                child.parent = this.temptable;
                //移动到相应位置，动画
                tween(child)
                    //.by(0.2, { position: new Vec3(450, 100, 0)})
                    .by(0.2, { position: new Vec3(450, baseY, 0) })
                    .start();
                //为移出的节点添加点击监听事件，因为只会触发一次，所以用once
                this.addoutfoodClickEvent(child);
                this.movedChildren.push(child);
            }
            //剩余的所有食物向左移动三个位置
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                tween(child)
                    .by(0.2, { position: new Vec3(-270, 0, 0) })
                    .start();
            }
            console.log(3);
            this.checkOverlap(this.movedChildren)
            // 更新基础Y位置
            this.baseY = baseY + 30;
        }
        if (this.soundFlag) {
            // 播放移出的音效
            this.moveOutAudio.play();
        }
    }
    //销毁按钮
    //destroy_btn_onClick(event:Event)
    destroy_btn_onClick() {
        if (this.soundFlag) {
            // 点击销毁道具的音效
            this.destroyNodeAudio.play();
        }
        this.curdestroynum += this.destroynum;
    }
    //打乱按钮
    //disorganize_btn_onClick(event:Event)
    disorganize_btn_onClick() {
        let nodes = [];
        let nodes_color = [];
        let nodes_size = [];
        let nodes_position = [];
        let children = this.foodsRoot.children;
        for (let i = 0; i < children.length; i++) {
            if (this.isinScene(children[i])) {
                nodes.push(children[i]);
                nodes_color.push(children[i].getComponent(Sprite).color);
                let pos = new Vec3(children[i].position.x, children[i].position.y, children[i].position.z);
                nodes_position.push(pos);
                let size = new Size(children[i].getComponent(UITransform).contentSize.x, children[i].getComponent(UITransform).contentSize.y);
                nodes_size.push(size);
            }
        }
        //交换大小，颜色，位置
        //shuffle
        for (let i = nodes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // 生成一个随机索引
            [nodes_color[i], nodes_color[j]] = [nodes_color[j], nodes_color[i]]; // 交换元素位置
            [nodes_position[i], nodes_position[j]] = [nodes_position[j], nodes_position[i]]; // 交换元素位置
            [nodes_size[i], nodes_size[j]] = [nodes_size[j], nodes_size[i]]; // 交换元素位置
        }
        console.log(nodes[0]);
        //应用交换后的结果
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].getComponent(Sprite).color = nodes_color[i];
            nodes[i].getComponent(UITransform).setContentSize(nodes_size[i]);
            nodes[i].position = nodes_position[i];
            //别忘了collider的半径也得改变
            let comp_collider = nodes[i].getComponent(CircleCollider2D);
            comp_collider.radius = nodes_size[i].x / 2;
            //巨坑，collider属性更改后必须apply才能应用!!!!!
            comp_collider.apply();
        }
        if (this.soundFlag) {
            // 播放打乱的音效
            this.disruptionAudio.play();
        }
    }
    //复活逻辑
    revive_btn_OnClick(event: Event, str: string) {
        //打开物理引擎
        PhysicsSystem2D.instance.enable = true;
        //切换状态
        this.status = 0;
        //关闭结束界面
        this.gameover.active = false;
        this.maskLayer.active = false;
        this.isPaused = false;
        //food节点设置活跃
        this.foodsRoot.active = true;
        //时间复活时间
        //this.time = this.revivetime;
        this.time = this.time + this.revivetime;
        console.log(this.time)
        //foodtable清空
        //this.foodtable.removeAllChildren();
        //调用移出接口
        this.moveoutAction();
        //重新开始计时
        this.schedule(this.updatetimer, 1);
        // 恢复背景音乐
        if (this.audioController && this.musicFlag) {
            this.audioController.toggleBGM(true);
        }
    }
    backhome_btn_Onclick(event: Event, str: string) {
        this.updateHonorData();
        //开启物理引擎
        PhysicsSystem2D.instance.enable = true;
        //加载主页
        director.loadScene('main_scene');
        //加载主页的音乐
        this.audioController.switchBackgroundMusic(this.audioController.bgmClip);
        // 恢复背景音乐
        if (this.audioController && this.musicFlag) {
            this.audioController.toggleBGM(true);
        }
    }
    //移出工具的获取按钮逻辑
    moveout_get_Onclick(event: Event, str: string) {
        //获取num节点
        let numnode = this.moveout.getChildByName('移出num');
        //接入广告获取逻辑
        //获取成功
        numnode.getComponent(Label).string = '1';
        //关闭面板
        this.moveoutpanel.active = false;
    }
    //销毁工具的获取按钮逻辑
    destroy_get_Onclick(event: Event, str: string) {
        //获取num节点
        let numnode = this.destroynode.getChildByName('销毁num');
        //接入广告获取逻辑
        //获取成功
        numnode.getComponent(Label).string = '1';
        //关闭面板
        this.destroypanel.active = false;
    }
    //打乱工具的获取按钮逻辑
    disorganize_get_Onclick(event: Event, str: string) {
        //获取num节点
        let numnode = this.disorganize.getChildByName('打乱num');
        //接入广告获取逻辑
        //获取成功
        numnode.getComponent(Label).string = '1';
        //关闭面板
        this.disorganizepanel.active = false;
    }
    //成功界面的分享按钮逻辑
    share_btn_Onclick(event: Event, str: string) {
    }
    updateHonorData() {
        //第一次返回时，revenue还未设置
        if (!sys.localStorage.getItem('revenue')) {
            sys.localStorage.setItem('revenue', this.money / this.ratio);
        }
        //更新星星数
        let tmp = parseInt(sys.localStorage.getItem('revenue'));
        sys.localStorage.setItem('revenue', this.money / this.ratio + tmp);
    }
    addfoodtableChild(tableitem: Node): any {
        //找到插入的位置
        let children = this.foodtable.children;
        let index = -1;
        for (let i = 0; i < children.length; i++) {
            //画家算法，记录最后 一个相同的位置，index + 1就是插入的位置
            if (children[i].name == tableitem.name)
                index = i;
        }
        //如果没有相同的，即index == -1，插入到尾部即可
        if (index == -1) {
            this.foodtable.addChild(tableitem);
            index = this.foodtable.children.length - 1;
        }
        //否则插入到index + 1
        else {
            this.foodtable.insertChild(tableitem, index + 1);
            index++;
        }
        //至此，index为新元素的下标
        return index;
    }
    //加载顾客表情图片
    loadImages() {
        // 假设图片存储在"images"文件夹下
        const folderPath = "picture/newcustomer";
        resources.loadDir(folderPath, SpriteFrame, (err, assets) => {
            if (err) {
                console.error("Failed to load images:", err);
                return;
            }
            assets.forEach(spriteFrame => {
                // 假设文件名就是图片的名称，我们存储SpriteFrame到字典中
                if (spriteFrame instanceof SpriteFrame) {
                    // 获取文件名作为键，去除路径和扩展名
                    const imageName = spriteFrame.name;
                    this.imageDictionary[imageName] = spriteFrame;
                }
            });
        });
    }
    // 判断重叠的函数，只判断移出的节点
    checkOverlap(nodes) {
        // 先将所有移出的节点恢复为可点击的状态
        for (let i = 0; i < nodes.length; i++) {
            let fooditem = nodes[i];
            const sprite = fooditem.getComponent(Sprite);
            sprite.color = new Color(255, 255, 255);
            // 启用点击事件
            fooditem.getComponent(UITransform).enabled = true;
            fooditem.off(Node.EventType.TOUCH_START);
            this.addoutfoodClickEvent(fooditem);
        }
        // 再根据重叠情况禁用被遮挡的节点
        for (let i = 0; i < nodes.length; i++) {
            let fooditem = nodes[i];
            const sprite = fooditem.getComponent(Sprite);
            if (!this.checkFoodInteract(i, nodes)) {
                sprite.color = new Color(167, 161, 161);
                // 禁用点击事件
                fooditem.getComponent(UITransform).enabled = false;
                fooditem.off(Node.EventType.TOUCH_START);
            }
        }
    }
    // 判断食物是否可交互
    checkFoodInteract(index, nodes) {
        let fooditem = nodes[index];
        const comp = fooditem.getComponent(UITransform);
        const dy = comp.contentSize.y;
        // 获取当前食物的Y坐标
        let foodY = fooditem.position.y;
        // 遍历其他食物，判断是否有遮挡
        for (let i = 0; i < nodes.length; i++) {
            if (i === index) continue;
            let otherFood = nodes[i];
            const otherComp = otherFood.getComponent(UITransform);
            const otherDy = otherComp.contentSize.y;
            // 获取其他食物的Y坐标
            let otherY = otherFood.position.y;
            // 判断是否被遮挡（仅考虑垂直方向上的重叠）
            if (foodY > otherY && Math.abs(foodY - otherY) < otherDy) {
                return false;
            }
        }
        return true;
    }
    // 更新下方卡牌的状态,用于点击移出的卡牌时
    updateBelowCards(clickedCard: Node) {
        const clickedCardX = clickedCard.position.x;
        let highestBelowCard: Node | null = null;
        let highestBelowY = -Infinity;
        // 遍历所有移出的卡牌，找到下方且 y 坐标最大的卡牌
        for (let i = 0; i < this.movedChildren.length; i++) {
            const card = this.movedChildren[i];
            const cardX = card.position.x;
            const cardY = card.position.y;
            // 如果卡牌在下方且 x 坐标相等
            if (cardX === clickedCardX && cardY < clickedCard.position.y) {
                if (cardY > highestBelowY) {
                    highestBelowCard = card;
                    highestBelowY = cardY;
                }
            }
        }
        // 如果找到了下方且 y 坐标最大的卡牌
        if (highestBelowCard) {
            let sprite = highestBelowCard.getComponent(Sprite);
            sprite.color = new Color(255, 255, 255);
            highestBelowCard.getComponent(UITransform).enabled = true;
            this.addoutfoodClickEvent(highestBelowCard);
        }
    }
    //返回主页
    on_backhome_btn_click() {
        director.loadScene('main_scene');
        this.audioController.switchBackgroundMusic(this.audioController.bgmClip);
    }
    //初始化微信激励视频广告
    initJiLiShiPin() {
        if (!this.videoAd) {
            this.videoAd = this.wx.createRewardedVideoAd({
                adUnitId: 'adunit-94303ad6ed5921c1'
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
                    this.isAdWatchedCompletely = true
                    this.videoAdCallback && this.videoAdCallback(true);
                } else {
                    console.log('激励视频未观看完毕');
                    // 如果有设置回调函数，则调用之，并传递 false 表示未正常结束
                    this.isAdWatchedCompletely = false
                    this.videoAdCallback && this.videoAdCallback(false)
                }
                // 在广告关闭后清除回调函数引用
                this.videoAdCallback = null;
                //音频
                if (this.audioController && this.musicFlag) {
                    this.audioController.toggleBGM(true); // 根据用户设置恢复音乐
                }
            });
        }
    }
    //初始化抖音激励视频
    initdouyinJiLiShiPin() {
        this.videoAd = window['tt'].createRewardedVideoAd({
            adUnitId: "2js1vsbb4lp55sasu3" // 替换为你的广告单元 ID
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
        //   // 暂停背景音乐
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
        // // 暂停背景音乐
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
                // // 恢复背景音乐
                if (this.audioController && this.musicFlag) {
                    this.audioController.toggleBGM(true);
                }
            });
        });
    }
    //刷新道具
    shuaXinDJ() {
        for (let i = 0; i < this.arrLabelDJ.length; i++) {
            if (i < this.arrLabelDJ.length) {
                this.bLabelDJ[i].string = `(${this.arrNumDJ[i]}/${3})`
            }
            if (this.arrNumDJ[0] == 0 && this.arrLabelDJ[0].string == `+`) {
                let b1 = this.moveout.getChildByName('移出btn').getComponent(Sprite)
                b1.color = new Color(128, 128, 128)
                let btnComponent = this.moveout.getChildByName('移出btn').getComponent(Button);
                // 设置按钮为不可点击
                btnComponent.interactable = false;
            }
            if (this.arrNumDJ[1] == 0 && this.arrLabelDJ[1].string == `+`) {
                //let b2=this.node.getChildByName("btn_2").getComponent(Sprite)
                let b2 = this.destroynode.getChildByName('销毁btn').getComponent(Sprite)
                b2.color = new Color(128, 128, 128)
                let btnComponent = this.destroynode.getChildByName('销毁btn').getComponent(Button);
                // 设置按钮为不可点击
                btnComponent.interactable = false;
            }
            if (this.arrNumDJ[2] == 0 && this.arrLabelDJ[2].string == `+`) {
                let b3 = this.disorganize.getChildByName('打乱btn').getComponent(Sprite)
                b3.color = new Color(128, 128, 128)
                let btnComponent = this.disorganize.getChildByName('打乱btn').getComponent(Button);
                // 设置按钮为不可点击
                btnComponent.interactable = false;
            }
        }
    }
    // 修改点: 广告或分享完成后执行的操作
    actionCompleted(str: string) {
        this.actionRequired = true;
        if (this.lastActionType === 'ad' && this.isAdWatchedCompletely) {
            this.lastActionType = 'ad';
            this.isAdWatchedCompletely = null; // 重置广告观看标志
            if (this.numDJ === 0 && this.arrNumDJ[0] > 0) {
                this.arrNumDJ[0]--
                let a = 0
                if (this.arrLabelDJ[0].string === `+`) {
                    a = 0
                } else {
                    a = parseInt(this.arrLabelDJ[0].string)
                }
                a = a + 1
                if (a === 0) {
                    this.arrLabelDJ[0].string = `+`
                } else {
                    this.arrLabelDJ[0].string = `${a}`
                }
                this.shuaXinDJ()
            } else if (this.numDJ === 1 && this.arrNumDJ[1] > 0) {
                this.arrNumDJ[1]--
                let b = 0
                if (this.arrLabelDJ[1].string === `+`) {
                    b = 0
                } else {
                    b = parseInt(this.arrLabelDJ[1].string)
                }
                b = b + 1
                if (b == 0) {
                    this.arrLabelDJ[1].string = `+`
                } else {
                    this.arrLabelDJ[1].string = `${b}`
                }
                this.shuaXinDJ()
            } else if (this.numDJ === 2 && this.arrNumDJ[2] > 0) {
                this.arrNumDJ[2]--
                let c = 0
                if (this.arrLabelDJ[2].string === `+`) {
                    c = 0
                } else {
                    c = parseInt(this.arrLabelDJ[2].string)
                }
                c = c + 1
                if (c === 0) {
                    this.arrLabelDJ[2].string = `+`
                } else {
                    this.arrLabelDJ[2].string = `${c}`
                }
                this.shuaXinDJ()
            }
            this.xianshiclose();
        } else {
            this.xianshiclose();
        }
    }
    xianshiclose() {
        if (this.moveoutpanel.active) {
            this.moveoutpanel.active = false
            this.maskLayer.active = false;
        } else if (this.destroypanel.active) {
            this.destroypanel.active = false
            this.maskLayer.active = false;
        } else if (this.disorganizepanel.active) {
            this.disorganizepanel.active = false
            this.maskLayer.active = false;
        }
        this.isPaused = false;
        if (this.soundFlag) {
            // 点击叉号的音效
            this.clickCancelAudio.play();
        }
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
    //道具显示页面
    xianshib1() {
        this.numDJ = 0
        let children = this.foodtable.children;
        //增，若底部没有卡牌，则不能使用道具
        if (this.arrLabelDJ[0].string == `+`) {
            if (this.soundFlag) {
                // 点击道具按钮的音效
                this.clickdaojubuttonAudio.play();
            }
            this.moveoutpanel.active = true
            this.showMask(this.maskLayer);
            //return;
        } else if (children.length <= 0) {
            if (this.soundFlag) {
                // 点击道具按钮的音效
                this.clickdaojubuttonAudio.play();
            }
            this.showdaojuText("暂时没法使用道具哦~")
            return;
        } else {
            this.moveoutAction()
            let a: number = parseInt(this.arrLabelDJ[0].string) - 1;
            if (a == 0) {
                this.arrLabelDJ[0].string = `+`
            } else {
                this.arrLabelDJ[0].string = `${a}`
            }
            this.shuaXinDJ();
        }
    }
    xianshib2() {
        this.numDJ = 1
        if (this.arrLabelDJ[1].string == `+`) {
            this.destroypanel.active = true
            if (this.soundFlag) {
                // 点击道具按钮的音效
                this.clickdaojubuttonAudio.play();
            }
            this.showMask(this.maskLayer);
        }
        else {
            this.destroy_btn_onClick();
            let b: number = parseInt(this.arrLabelDJ[1].string) - 1;
            if (b == 0) {
                this.arrLabelDJ[1].string = `+`
            } else {
                this.arrLabelDJ[1].string = `${b}`
            }
            this.shuaXinDJ();
        }
    }
    xianshib3() {
        this.numDJ = 2
        if (this.arrLabelDJ[2].string == `+`) {
            if (this.soundFlag) {
                // 点击道具按钮的音效
                this.clickdaojubuttonAudio.play();
            }
            this.disorganizepanel.active = true
            this.showMask(this.maskLayer);
        } else {
            this.disorganize_btn_onClick();
            let c: number = parseInt(this.arrLabelDJ[2].string) - 1;
            if (c == 0) {
                this.arrLabelDJ[2].string = `+`
            } else {
                this.arrLabelDJ[2].string = `${c}`
            }
            this.shuaXinDJ();
        }
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
    callBackBtn(event: Event, str: string) {
        this.lastActionType = 'ad'
        // 修改点: 检查是否需要完成互动
        if (this.actionRequired && this.isWX && !this.isDebugMode) {
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
        } else if (this.actionRequired && this.isKS && !this.isDebugMode) {
            this.showkuaishouJiLiShiPin(() => {
                this.actionCompleted(str); // 广告完成后执行的操作
            });
            return; // 等待广告完成
        }
        if ((!this.isWX && !this.isTT) || this.isDebugMode && !this.isKS) {
            this.executeButtonFunction(str);
        }
    }
    // 执行按钮对应的功能
    executeButtonFunction(str: string) {
        switch (str) {
            case 'btn_1':
                this.moveoutpanel.active = false
                this.moveoutAction()
                this.maskLayer.active = false;
                break;
            case 'btn_2':
                this.destroypanel.active = false
                this.destroy_btn_onClick();
                this.maskLayer.active = false;
                break;
            case 'btn_3':
                this.disorganizepanel.active = false
                this.disorganize_btn_onClick();
                this.maskLayer.active = false;
                break;
        }
        this.isPaused = false; // 恢复计时
        this.shuaXinDJ(); // 刷新
    }
    //调试模式
    toggleDebugMode() {
        this.isDebugMode = !this.isDebugMode;
    }
    //初始化音频
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
    //更新按钮视觉
    updateButtonVisuals() {
        if (this.musicFlag) {
            this.musicButtonSprite.spriteFrame = this.OnSprite;
        } else {
            this.musicButtonSprite.spriteFrame = this.OffSprite;
        }
        if (this.soundFlag) {
            this.soundButtonSprite.spriteFrame = this.OnSprite;
        } else {
            this.soundButtonSprite.spriteFrame = this.OffSprite;
        }
        // 更新震动按钮的视觉状态
        if (this.vibrationFlag) {
            this.vibrationButtonSprite.spriteFrame = this.OnSprite;
        } else {
            this.vibrationButtonSprite.spriteFrame = this.OffSprite;
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
        if (this.soundFlag) {
            // 点击其他按钮的音效
            this.otherbuttonAudio.play();
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
        if (this.soundFlag) {
            // 点击其他按钮的音效
            this.otherbuttonAudio.play();
        }
        this.updateButtonVisuals(); // 更新按钮的视觉状态以反映当前的设置
    }
    //音乐设置的总按钮
    toggleSoundSetting() {
        this.soundSetting.active = true
        this.showMask(this.maskLayer);
        if (this.soundFlag) {
            // 点击其他按钮的音效
            this.otherbuttonAudio.play();
        }
    }
    //关闭设置
    close() {
        // 音乐设置节点的可见性
        this.soundSetting.active = false;
        this.maskLayer.active = false;
        this.isPaused = false;
        if (this.soundFlag) {
            // 点击叉号的音效
            this.clickCancelAudio.play();
        }
    }
    onVibrationButtonClicked() {
        if (VibrationManager.instance) {
            // 切换震动设置
            VibrationManager.instance.toggleVibration();
            // 获取更新后的震动设置
            this.vibrationFlag = VibrationManager.instance.vibrationEnabled;
        }
        if (this.soundFlag) {
            // 点击其他按钮的音效
            this.otherbuttonAudio.play();
        }
        this.updateButtonVisuals(); // 更新按钮的视觉状态以反映当前的设置
    }
    // 检查是否达到成就，并且弹出成就面板
    checkAndHandleAchievements(currentDay, count) {
        const achievements = this.gameConfig.achievements; // 从配置中获取成就数据
        let achievementTriggered = false; // 标志是否触发了成就
        achievements.forEach(achievement => {
            if (achievement.id === currentDay) {
                achievement.thresholds.forEach((threshold, index) => {
                    if (count === threshold) {
                        const achievementKey = `achievement_${achievement.id}_${index}_shown`;
                        const hasShown = sys.localStorage.getItem(achievementKey);
                        if (!hasShown) {
                            // 显示成就解锁的弹窗或信息
                            //this.chengjiumiaoshu.string = `${achievement.messages[index]}`.replace(/[，！]/g, "$&\n");
                            this.chengjiumiaoshu.string = `${achievement.getmessages[index]}`
                            this.chengjiutishi.spriteFrame = this.unlockImg[achievement.id * 4 + index];
                            this.newdaynode.active = false;
                            this.chengjiuNode.active = true;
                            //播放粒子特效
                            this.achieveleftparticle.getComponent(ParticleSystem2D).resetSystem(); // 重置并播放成就左闪
                            this.achieverightparticle.getComponent(ParticleSystem2D).resetSystem(); // 重置并播放成就右闪
                            this.achievestaticparticle.getComponent(ParticleSystem2D).resetSystem(); // 重置并播放成就静态闪
                            if (this.soundFlag) {
                                this.achieveAudio.play();
                            }
                            sys.localStorage.setItem(achievementKey, 'true'); // 标记此成就为已显示
                            achievementTriggered = true; // 成就被触发
                        }
                    }
                });
            }
        });
        return achievementTriggered; // 返回是否触发了成就
    }
    //重新开始
    restart() {
        if (this.soundFlag) {
            // 点击其他按钮的音效
            this.otherbuttonAudio.play();
        }
        director.loadScene("main_scene")
        this.audioController.switchBackgroundMusic(this.audioController.bgmClip);
    }
}