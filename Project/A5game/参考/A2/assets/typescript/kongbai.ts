import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('kongbai')
export class kongbai extends Component {
    
    protected onLoad(): void {

        const sceneName = "mainscene";
        console.log("dddddddddddd")

        director.preloadScene("mainscene", (completedCount, totalCount, item) => {
            console.log("zzzzzzzzzzz")
            const progress = completedCount / totalCount;  // 场景加载进度另外贡献50%
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
    
    start() {

        // const sceneName = "mainscene";
        // console.log("dddddddddddd")

        // director.preloadScene("mainscene", (completedCount, totalCount, item) => {
        //     console.log("zzzzzzzzzzz")
        //     const progress = completedCount / totalCount;  // 场景加载进度另外贡献50%
        //     console.log(`Currently loading: ${item.url}; Progress: ${progress * 100}%`);
        // }, (error) => {
        //     if (!error) {
        //         console.log(`${sceneName} scene preloaded successfully.`);
        //         director.loadScene(sceneName);
        //     } else {
        //         console.error(`Failed to preload ${sceneName} scene:`, error);
        //     }
        // });
        console.log("tttttttttttttt")

        //director.loadScene("mainscene")
    }

    update(deltaTime: number) {
        
    }
}


