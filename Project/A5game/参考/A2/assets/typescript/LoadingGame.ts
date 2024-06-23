import { _decorator, Component, director,AssetManager, ProgressBar, Label, assetManager,find } from 'cc';
import UserSettings from './UserSettings';
import { ResourceManager } from './ResourceManager';

const { ccclass, property } = _decorator;

@ccclass('LoadingGame')
export class LoadingGame extends Component {
    @property(ProgressBar)
    progressBar: ProgressBar | null = null;
    @property(Label)
    loadingLabel: Label | null = null;
    loadingOver=false;
    wx: any;


    async onLoad() {
        UserSettings.getInstance().loadAchievements(() => {console.log(UserSettings.getInstance().getAchievements())});
        const initialSceneName = "sheepgame";
        if (this.loadingLabel) this.loadingLabel.string = "加载中...";
        // 资源加载与场景加载共同进度计算
        await ResourceManager.instance.loadAllRequiredResources(progress => {
            this.updateProgress(progress * 0.5);  // 资源加载贡献50%的进度
        });

        this.loadResourceBundle(initialSceneName);

        this.wx=window['wx']

        // 初始化广告逻辑
        if (this.wx) {

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
    }
    
    loadResourceBundle(sceneName) {
        director.preloadScene(sceneName, (completedCount, totalCount, item) => {
            const progress = 0.5 + (completedCount / totalCount) * 0.5;  // 场景加载进度另外贡献50%
            this.updateProgress(progress);
            console.log(`Currently loading: ${item.url}; Progress: ${progress * 100}%`);
        }, (error) => {
            if (!error) {
                console.log(`${sceneName} scene preloaded successfully.`);
                director.loadScene(sceneName);
            } else {
                console.error(`Failed to preload ${sceneName} scene:`, error);
            }
        });
    }
    
    updateProgress(progress) {
        // Update progress bar and label based on actual loading progress
        if (this.progressBar) {
            this.progressBar.progress = progress;
        }
        if (this.loadingLabel) {
            this.loadingLabel.string = `加载中... ${Math.round(progress * 100)}%`;
        }
    }
}    




//     onLoad() {
//         const initialSceneName = "sheepgame";
//         this.loadResourceBundle();
//         const totalDuration = 3; // 总时长为 1 秒
//         const interval = 0.1; // 更新间隔为 0.1 秒
//         if (this.loadingLabel) this.loadingLabel.string = "Loading";
//         let progress = 0;
//         this.schedule(() => {
//             progress += 0.1; // 增加进度
//             if(this.loadingOver)
//             {
//                 progress = 1;
//             }
//             if (this.progressBar) this.progressBar.progress = progress;
            
//             if (progress >= 1) {
//                 // 当进度完成时，加载进入MainScene
//                 director.loadScene(initialSceneName);
//             }
//         }, interval, totalDuration / interval);
//     }

//     loadResourceBundle() {
//         director.preloadScene("sheepgame", function(){
//             console.log('Next scene preloaded');
//             // this.loadingOver=true;
//         });
//     }

//     updateProgress(finished: number, total: number) {
//         const progress = finished / total;
//         console.log("更新");
//         console.log(finished, total, progress);
//         if (this.progressBar) {
//             this.progressBar.progress = progress;
//         }
//         if (this.loadingLabel) {
//             this.loadingLabel.string = `Loading... ${Math.round(progress * 100)}%`;
//         }
//     }

//     loadInitialScene(bundle: AssetManager.Bundle) {
//         // Here you load the initial scene using the bundle
//         const initialSceneName = "MainScene"; // Change this to your actual initial scene name
//         console.log('Loading initial scene...');
//         bundle.loadScene(initialSceneName, (err, scene) => {
//             if (err) {
//                 console.error(`Failed to load scene "${initialSceneName}" from the bundle:`, err);
//                 return;
//             }
//             director.loadScene(initialSceneName);
//         }, this.updateProgress.bind(this));
//     }
// }

