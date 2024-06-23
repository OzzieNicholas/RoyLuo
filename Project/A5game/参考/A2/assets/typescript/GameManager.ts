import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    // static instance: GameManager = new GameManager();
    
    // numDJ: number = 0;
    // itemsCount: number[] = [0, 0, 0];
    // isReceiving: boolean = false;  // 标记是否领取了奖励
    // lastRewardDate: string | null = null; // 存储最后一次领取奖励的日期

    // incrementItem(index: number) {
    //     if (index >= 0 && index < this.itemsCount.length) {
    //         this.itemsCount[index]++;
    //     }
    // }

    // getRandomItem() {
    //     const today = new Date().toISOString().slice(0, 10);
    //     if (this.lastRewardDate === today) {
    //         console.log("今天已经领取过奖励了");
    //         return; // 如果今天已经领取过，直接返回
    //     }

    //     this.numDJ = Math.floor(Math.random() * 3); // 随机选择一个道具
    //     this.incrementItem(this.numDJ);
    //     this.isReceiving = true; // 设置领取奖励标记为true
    //     this.lastRewardDate = today; // 更新最后领取日期
    // }

    // resetReceivingStatus() {
    //     this.isReceiving = false; // 重置领取状态
    // }


        static instance: GameManager = new GameManager();
        
        numDJ: number = 0;
        itemsCount: number[] = [0, 0, 0];
        isReceiving: boolean = false;  // 标记是否领取了奖励
    lingqu: boolean;
    
        private constructor() {
            super();  // 必须调用super()，因为GameManager继承自cc.Component
            this.loadLastRewardDate(); // 加载上一次奖励领取日期
        }
    
        public static getInstance(): GameManager {
            return GameManager.instance;
        }
    
        incrementItem(index: number) {
            if (index >= 0 && index < this.itemsCount.length) {
                this.itemsCount[index]++;
            }
        }
    
        getRandomItem() {
            const today = new Date().toISOString().slice(0, 10);
            const lastRewardDate = sys.localStorage.getItem('lastRewardDate'); // 从本地存储获取最后领取日期
    
            if (lastRewardDate === today) {
                this.lingqu=false;
                console.log(lastRewardDate)
                console.log("今天已经领取过奖励了");
                return; // 如果今天已经领取过，直接返回
            }
            this.lingqu=true;
            this.isReceiving = true; // 设置领取奖励标记为true
            sys.localStorage.setItem('lastRewardDate', today); // 更新并保存最后领取日期到本地存储
        }
    
        resetReceivingStatus() {
            this.isReceiving = false; // 重置领取状态
        }
    
        private loadLastRewardDate() {
            // 从本地存储中加载最后领取日期
            const lastRewardDate = sys.localStorage.getItem('lastRewardDate');
            if (lastRewardDate) {
                console.log(`Loaded last reward date: ${lastRewardDate}`);
            } else {
                console.log("No reward date found.");
            }
        }
    
    
    
    start() {

    }

    update(deltaTime: number) {
        
    }
}


