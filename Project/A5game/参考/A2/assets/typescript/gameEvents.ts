//埋点的文件
import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gameEvents')
export class gameEvents extends Component {

    private static _instance: gameEvents = null;
    public static get instance(): gameEvents {
        if (!gameEvents._instance) {
            // 可能需要处理组件初始化，这取决于你的游戏架构和Cocos Creator的使用方式
            gameEvents._instance = new gameEvents();
        }
        return gameEvents._instance;
    }

    private userId: string = 'defaultUser';
    private startTime: number | null = null;
    private startGameTime: number | null = null;
    private levelTwoStartTime: number | null = null;
    private gameDuration: number | null = null;
    private currentEliminations: number = 0;
    private totalEliminations: number = 0;
    isWX: boolean=false;
    isTT: boolean=false;

    onload(){
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            // 微信登录
            this.isWX=true;

        } else if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            // 抖音登录
            this.isTT=true;
        }
    }
    
    // 方法: 用户登录
    login(userId: string): void {
        this.userId = userId;
        this.startTime = Date.now();
        if (this.isWX) {
            window['wx'].reportEvent('login', { userId: this.userId, time: this.startTime });
        }

    }

    // 方法: 用户退出
    logout(): void {
        const endTime = Date.now();
        if (this.isWX){
            window['wx'].reportEvent('logout', {
                userId: this.userId,
                startTime: this.startTime,
                endTime: endTime,
                currentEliminations: this.currentEliminations
                });
        }
        
        this.resetSession();
    }

    // 开始游戏时间
    startGame(): void {
        this.startGameTime = Date.now();
        if (this.isWX){
            window['wx'].reportEvent('start_game', { userId: this.userId, time: this.startGameTime });
        }
    }

    // 进入第二关时间
    enterLevelTwo(): void {
        this.levelTwoStartTime = Date.now();
        if (this.isWX){
            window['wx'].reportEvent('enter_level_two', { userId: this.userId, time: this.levelTwoStartTime });
        }
    }

    // //该局游戏时间
    // endGame(): void {
    //     const deathOrWinTime = Date.now();
    //     if (this.startGameTime) {
    //     this.gameDuration = deathOrWinTime - this.startGameTime;
    //     }

    //     if (this.isWX){
    //         window['wx'].reportEvent('end_game', {
    //             userId: this.userId,
    //             gameDuration: this.gameDuration
    //             });
    //     }
       
    // }

    // 记录消除次数
    reportElimination(): void {
        this.currentEliminations++;
        //this.totalEliminations++;
    }

    //重置消除次数
    resetElimination(): void {
        this.currentEliminations=0;
    }

    // 通关消除次数
    reportCurrentEliminations(): void {
        const deathOrWinTime = Date.now();
        this.gameDuration = deathOrWinTime - this.startGameTime;
        if (this.isWX){
            window['wx'].reportEvent('win_eliminations', { userId: this.userId, win_count: this.currentEliminations,gameDuration: this.gameDuration });
        }
    }

    // 失败消除次数
    dieEliminations(): void {
        const deathOrWinTime = Date.now();
        this.gameDuration = deathOrWinTime - this.startGameTime;
        if (this.isWX){
            window['wx'].reportEvent('die_eliminations', { userId: this.userId, die_count: this.currentEliminations,gameDuration: this.gameDuration });
        }
    }

    // //退出游戏时当局消除次数
    // exitEliminations(): void {
    //     if (this.isWX){
    //         window['wx'].reportEvent('exit_eliminations', { userId: this.userId, exit_count: this.currentEliminations });
    //     }
        
    // }

   
    // 重置会话
    private resetSession(): void {
        this.startTime = null;
        this.startGameTime = null;
        this.levelTwoStartTime = null;
        this.gameDuration = null;
        this.currentEliminations = 0;
        this.totalEliminations = 0;
    }
    
    start() {

    }

    update(deltaTime: number) {
        
    }
}


