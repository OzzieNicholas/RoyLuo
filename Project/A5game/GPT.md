```
请根据上述代码以及对应的注释，找出"特殊食材三消成功"的逻辑对应的代码，将其提取出来给我
```

```ts

```

```
对于这个cocos项目，现在我的新需求是：我需要做一个空白的弹窗面板，当特殊食材三消时，弹出这个弹窗面板，我该怎么做呢
```

```
我在左边选中了"移出面板"，但右边展示的仍然是game_scene的场景编辑，我该怎么打开"移出面板"对应的场景编辑呢
```

```json
ts原本的onload函数如下：

...
@property(Node) match3SuccessPanel: Node;
...
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

如图所示。match3SuccessPanel节点下面有四个Button，分别是Button1、Button2、Button3、Button4，每个Button下都有label属性，

config.json有如下数据:

"match3SuccessPanel": [
    {
        "id": 0,
        "title": "食材短缺",
        "description": "来店内吃饭的熊猫女士气呼呼地问，为什么店里没有它最爱吃的竹笋",
        "firstButton": [
            {
                "id": 0,
                "label": "随便找个理由敷衍它",
                "note": "错误-选项"
            },
            {
                "id": 1,
                "label": "安抚熊猫女士",
                "note": "正确1-加饱食度"
            },
            {
                "id": 2,
                "label": "——",
                "note": "正确2-加时间"
            },
            {
                "id": 3,
                "label": "立即赠与熊猫女士一碟酸笋作为免费小菜",
                "note": "广告-加金币"
            }
        ],
        "secondButton": [
            {
                "id": 0,
                "label": "熊猫女士生气地拍了拍桌子，整个小店震得晃了晃",
                "note": "剩余时间缩短10秒钟"
            },
            {
                "id": 1,
                "label": "熊猫女士点点头，表示做生意辛苦，能理解你",
                "note": "顾客饱食度提升"
            },
            {
                "id": 2,
                "label": "——",
                "note": "剩余时间增加30秒钟"
            },
            {
                "id": 3,
                "label": "熊猫女士喜笑颜开地付了小费，说第一次尝到这个味儿",
                "note": "营业额增加100元"
            }
        ]
    }
]

我想将match3SuccessPanel的firstButton的四个label数据分别绑定到四个Button的label中

json数据通过this.gameConfig.match3SuccessPanel获取，我应该在onload中怎么写呢

你不需要重新写整个onload，只需要告诉我应该怎么写功能对应的代码即可
```

## 参考代码

```ts
// 判断是否是特殊食材
// 冒烤鸭
if (index == 22) {
    if (this.soundFlag) {
        // 播放三消除特殊食物的音效
        this.match3SpecialfoodAudio.play();
    }
    // 更新饥饿度
    let script = this.curcustomer.getComponent('Customer');
    // 实际-2，后面统一会-1
    script.leftnum -= 1;
}
// 冰淇淋
if (index == 23) {
    if (this.soundFlag) {
        // 播放三消除特殊食物的音效
        this.match3SpecialfoodAudio.play();
    }
    this.time += 10;
}
// 朝天椒
if (index == 24) {
    if (this.soundFlag) {
        // 播放三消除特殊食物的音效
        this.match3SpecialfoodAudio.play();
    }
    // 更新饥饿度
    let script = this.curcustomer.getComponent('Customer');
    // 实际-3
    script.leftnum -= 2;
}
// 红蘑菇
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
```

```ts
//移出面板
@property(Node) moveoutpanel: Node;

this.moveoutpanel.active = true;
```

