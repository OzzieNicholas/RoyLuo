import { _decorator, Component, JsonAsset, Node, resources, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends Component {
    static instance: ResourceManager = new ResourceManager();

    public gameConfig: any;  // 游戏配置
    public bossspriteFrame: SpriteFrame[];  // Boss 图片帧
    public achievementImages: SpriteFrame[];  // 成就图片帧
    public bossProcessSprites: { [key: string]: SpriteFrame };  // Boss 进程图片帧
    public longziImage: SpriteFrame;  // 笼子图片帧
    allBossHealth: any;
    achievementsConfig: any;

    chuchi(){
        // 初始化所有属性
        this.bossspriteFrame = [];
        this.achievementImages = [];
        this.bossProcessSprites = {};

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
                        }
                        resolve();
                });
            } catch (error) {
                console.error("Failed to load config.json", error);
            }
        });
    }

    //async loadAllRequiredResources(): Promise<void> {
    async loadAllRequiredResources(onProgress: (progress: number) => void): Promise<void> {
        if (!this.gameConfig) {
            await this.loadAndInitGameConfig();
        }

        let totalResources = 1 + 18 + 3 * 2 * 2 + 1; // 总资源数 = 配置 + 成就图片 + Boss处理图片 + 笼子图片
        let loadedResources = 0;
    
        // 首先处理所有boss的图片加载
        const levelTwoConfig = this.gameConfig.boss.level_two;
        this.allBossHealth = levelTwoConfig.bosses.reduce((total, boss) => total + boss.health, 0) + 100;
        this.achievementsConfig = this.gameConfig.achievements;
    
        // 准备加载boss图片资源的Promises数组
        let bossImagePromises = levelTwoConfig.bosses.map(boss => new Promise((resolve, reject) => {
            resources.load(boss.image, SpriteFrame, (err, spriteFrame) => {
                if (!err) {
                    resolve(spriteFrame);
                    this.updateProgress(loadedResources, totalResources, onProgress); // 更新进度
                    loadedResources++;
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
                        this.updateProgress(loadedResources, totalResources, onProgress); // 更新进度
                        loadedResources++;
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
                                this.updateProgress(loadedResources, totalResources, onProgress); // 更新进度
                                loadedResources++;
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

                    this.updateProgress(loadedResources, totalResources, onProgress); // 更新进度
                    loadedResources++;
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

    updateProgress(loadedResources: number, totalResources: number, onProgress: (progress: number) => void) {
        loadedResources++;
        onProgress(loadedResources / totalResources);
    }
    
    
    
    
    start() {

    }

    update(deltaTime: number) {
        
    }
}


