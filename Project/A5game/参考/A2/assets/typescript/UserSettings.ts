// UserSettings.ts

import { sys } from "cc";
import CryptoJS from 'crypto-js';
import { gameEvents } from "./gameEvents";

// 小游戏用户信息服务 API 配置，请联系后端开发人员获取
const BASE_URL: string = 'https://a2.giiso.com';
const GAME_ID: string = '2';
const GAME_SECRET: string = "adbc837469a24dc1ec0aae475ab7a7c6";

// 微信小游戏 appId，请登录微信公众平台获取
const WX_APP_ID: string = 'wx2e1e3f5d008cb592'

// 抖音 appId，请登录抖音开发者平台获取
const DOUYIN_APP_ID: string = 'tt9c4ceaf1037de4ea02'

const TEST_USER_ID = 'test_user';

/**
 * 成就对象定义
 */
export interface Achievement {
    id: string;
    name: string;
    description: string;
    threshold: number;
    requiredSuccesses: number;
    progress: number;
}

export default class UserSettings {
    private static _instance: UserSettings;

    private _hasSyncedRemoteConfig;

    private _openid: string;

    private _achievements: Achievement[] = [
        { "id": "1", "name":"松鼠之友","description": "完成关卡的20%", "threshold": 20, "requiredSuccesses": 1, "progress": 0 },
        { "id": "2", "name":"蹦跳白兔","description": "完成关卡的30%", "threshold": 30, "requiredSuccesses": 1, "progress": 0 },
        { "id": "3", "name":"慵懒考拉","description": "完成关卡的35%", "threshold": 35, "requiredSuccesses": 1, "progress": 0 },
        { "id": "4", "name":"摇摆企鹅","description": "完成关卡的40%", "threshold": 40, "requiredSuccesses": 1, "progress": 0 },
        { "id": "5", "name":"粉粉小猪","description": "完成关卡的45%", "threshold": 45, "requiredSuccesses": 1, "progress": 0 },
        { "id": "6", "name":"猫头鹰扬","description": "完成关卡的50%", "threshold": 50, "requiredSuccesses": 1, "progress": 0 },
        { "id": "7", "name":"灵动浣熊","description": "完成关卡的55%", "threshold": 55, "requiredSuccesses": 1, "progress": 0 },
        { "id": "8", "name":"梅花鹿魅","description": "完成关卡的60%", "threshold": 60, "requiredSuccesses": 1, "progress": 0 },
        { "id": "9", "name":"灵巧猕猴","description": "完成关卡的65%", "threshold": 65, "requiredSuccesses": 1, "progress": 0 },
        { "id": "10", "name":"机巧狐狸","description": "完成关卡的70%", "threshold": 70, "requiredSuccesses": 1, "progress": 0 },
        { "id": "11", "name":"黑白斑马","description": "完成关卡的75%", "threshold": 75, "requiredSuccesses": 1, "progress": 0 },
        { "id": "12", "name":"勤奋水牛","description": "完成关卡的80%", "threshold": 80, "requiredSuccesses": 1, "progress": 0 },
        { "id": "13", "name":"大嘴河马","description": "完成关卡的85%", "threshold": 85, "requiredSuccesses": 1, "progress": 0 },
        { "id": "14", "name":"草原犀牛","description": "完成关卡的90%", "threshold": 90, "requiredSuccesses": 1, "progress": 0 },
        { "id": "15", "name":"大力棕熊","description": "完成关卡的93%", "threshold": 93, "requiredSuccesses": 1, "progress": 0 },
        { "id": "16", "name":"猛虎下山","description": "完成关卡的96%", "threshold": 96, "requiredSuccesses": 1, "progress": 0 },
        { "id": "17", "name":"象群之首","description": "完成关卡的98%", "threshold": 98, "requiredSuccesses": 1, "progress": 0 },
        { "id": "18", "name":"霸气狮王","description": "完成关卡的100%", "threshold": 100, "requiredSuccesses": 1, "progress": 0 }

    ];



    private constructor() {
        this._hasSyncedRemoteConfig = false;
    }

    public static getInstance(): UserSettings {
        if (!UserSettings._instance) {
            UserSettings._instance = new UserSettings();
        }
        return UserSettings._instance;
    }

    public setHasSyncedRemoteConfig(enabled: boolean): void {
        this._hasSyncedRemoteConfig = enabled;
    }

    public setOpenid(openid: string): void {
        this._openid = openid;
    }

    public getOpenid(): string {
        return this._openid;
    }

    public getAchievements() {
        return this._achievements;
    }

    public setAchievements(achievements: Achievement[]) {
        this._achievements = achievements;
    }

    //我加重置数据，用于测试
    public resetAchievements(): void {
        // 获取当前所有成就的进度
        let achievements = UserSettings.getInstance().getAchievements();

        // 将所有成就的进度设置为0
        achievements.forEach(achievement => {
            achievement.progress = 0;
        });

        // 更新本地存储的成就进度
        UserSettings.getInstance().setAchievements(achievements);

        // 将重置后的成就数据同步到服务器
        this.saveAchievements();
    }

    /**
     * 登录
     * @param success 
     */
    public login(success: Function) {
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            // 微信登录
            this.wxLogin(success);

        } else if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            // 抖音登录
            this.ttLogin(success);


        } else {
            // 随机返回一个字符串，方便H5调试
            UserSettings.getInstance().setOpenid(TEST_USER_ID);
            success(TEST_USER_ID);
        }
    }

    private wxLogin(success: Function) {
        let openid: string = UserSettings.getInstance().getOpenid();
        console.log(openid)
        if (openid) {
            //ldx
            gameEvents.instance.login(openid);
            success();
            return;
        }
        window['wx'].login({
            success(res) {
                if (res.code) {
                    console.log('登录成功 code:', res.code)
                    let payload = { 'appId': WX_APP_ID, 'code': res.code }
                    window['wx'].request({
                        url: BASE_URL + `/wx/user/login`, // 请求地址
                        method: 'POST', // 请求方式
                        data: JSON.stringify(payload), // 发送的数据
                        header: { // 设置请求的 header
                            'Content-Type': 'application/json',
                            'X-Game-Id': GAME_ID,
                            'Authorization': 'Bearer ' + generateToken(),
                            'X-Game-Platform': getPlatform()
                        },
                        success(res) {

                            console.log('wx code2session success:', res.data);

                            if (res.data && res.data.openid) {
                                UserSettings.getInstance().setOpenid(res.data.openid);
                                //ldx
                                gameEvents.instance.login(res.data.openid);
                                success();
                            }
                        },
                        fail(err) {
                            console.error('wx code2session fail:', err);
                        }
                    });
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    }

    //增加抖音
    private ttLogin(success: Function) {
        let openid: string = UserSettings.getInstance().getOpenid();
        console.log(openid)
        if (openid) {
            success();
            return;
        }
        window['tt'].login({
            success(res) {
                if (res.code) {
                    console.log('登录成功 code:', res.code)
                    let payload = { 'appId': DOUYIN_APP_ID, 'code': res.code }
                    window['tt'].request({
                        url: BASE_URL + `/douyin/user/login`, // 请求地址
                        method: 'POST', // 请求方式
                        data: JSON.stringify(payload), // 发送的数据
                        header: { // 设置请求的 header
                            'Content-Type': 'application/json',
                            'X-Game-Id': GAME_ID,
                            'Authorization': 'Bearer ' + generateToken(),
                            'X-Game-Platform': getPlatform()
                        },
                        success(res) {

                            console.log('tt code2session success:', res.data);

                            if (res.data && res.data.openid) {
                                UserSettings.getInstance().setOpenid(res.data.openid);
                                success();
                            }
                        },
                        fail(err) {
                            console.error('tt code2session fail:', err);
                        }
                    });
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    }

    public loadAchievements(success: Function) {
        // 每次打开小游戏仅从远程服务器同步一次成就榜,后续操作只维护本地变量,防止多次拉取因网络差异出现覆盖掉最新配置情况
        if (this._hasSyncedRemoteConfig) {
            success();
            return;
        }
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            this.wxLoadAchievements(success);
        } else if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME){
            this.ttLoadAchievements(success);
        }
    }


    public wxLoadAchievements(success: Function) {
        this.login(() => {
            window['wx'].request({
                url: BASE_URL + `/user/get`, // 请求地址
                method: 'POST', // 请求方式
                data: JSON.stringify({}), // 发送的数据
                header: { // 设置请求的 header
                    'Content-Type': 'application/json',
                    'X-Game-Id': GAME_ID,
                    'Authorization': 'Bearer ' + generateToken(),
                    'X-Game-Platform': getPlatform()
                },
                success(res) {
                    if (res.data && res.data.code === '0') {
                        UserSettings.getInstance().setHasSyncedRemoteConfig(true);
                        console.log('success load user achievements:', res.data);
                        if (res.data.data) {
                            // this._achievements = res.data.data.achievements;
                            // UserSettings.getInstance().setAchievements(res.data.data.achievements);
                            let remoteAchievements = res.data.data.achievements;
                            let localAchievements = UserSettings.getInstance().getAchievements();
                            for (let i = 0; i < remoteAchievements.length; i++) {
                                const remoteAchievement = remoteAchievements[i];
                                let id = remoteAchievement.id;
                                let remoteProgress = remoteAchievement.progress;
                                for (let j = 0; j < localAchievements.length; j++) {
                                    const localAchievement = localAchievements[j];
                                    if (id === localAchievement.id) {
                                        localAchievement.progress = remoteProgress;
                                        break;
                                    }
                                }
                            }
                        }
                        success();
                    }
                },
                fail(err) {
                    console.error('Error load user achievements:', err);
                }
            });
        });
    }

    //增加抖音
    public ttLoadAchievements(success: Function) {
        this.login(() => {
            window['tt'].request({
                url: BASE_URL + `/user/get`, // 请求地址
                method: 'POST', // 请求方式
                data: JSON.stringify({}), // 发送的数据
                header: { // 设置请求的 header
                    'Content-Type': 'application/json',
                    'X-Game-Id': GAME_ID,
                    'Authorization': 'Bearer ' + generateToken(),
                    'X-Game-Platform': getPlatform()
                },
                success(res) {
                    if (res.data && res.data.code === '0') {
                        UserSettings.getInstance().setHasSyncedRemoteConfig(true);
                        console.log('success load user achievements:', res.data);
                        if (res.data.data) {
                            // this._achievements = res.data.data.achievements;
                            // UserSettings.getInstance().setAchievements(res.data.data.achievements);
                            let remoteAchievements = res.data.data.achievements;
                            let localAchievements = UserSettings.getInstance().getAchievements();
                            for (let i = 0; i < remoteAchievements.length; i++) {
                                const remoteAchievement = remoteAchievements[i];
                                let id = remoteAchievement.id;
                                let remoteProgress = remoteAchievement.progress;
                                for (let j = 0; j < localAchievements.length; j++) {
                                    const localAchievement = localAchievements[j];
                                    if (id === localAchievement.id) {
                                        localAchievement.progress = remoteProgress;
                                        break;
                                    }
                                }
                            }
                        }
                        success();
                    }
                },
                fail(err) {
                    console.error('Error load user achievements:', err);
                }
            });
        });
    }

    public checkAchievements(damageRatio) {
        console.log('-----------------------------------checkAchievements----------------------------', damageRatio)
        let isNeedSaveAchievements: boolean = false;
        this._achievements.forEach(achievement => {

            // 检查是否满足成就条件
            if (damageRatio >= achievement.threshold) {
                achievement.progress++;
                isNeedSaveAchievements = true;
                // 保存成就到服务器
                // this.saveAchievements();
            }
        });
        // 保存成就到服务器
        if (isNeedSaveAchievements) {
            this.saveAchievements();
        }
    }

    public saveAchievements(): void {
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            this.wxSaveAchievements();
        }else if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME){
            this.ttSaveAchievements();
        }
    }

    public wxSaveAchievements(): void {
        this.login(() => {
            let uploadAchievements = UserSettings.getInstance().getAchievements().map(achievement => {
                return { "id": achievement.id, "progress": achievement.progress }
            })
            const postDataBody = {
                'openid': UserSettings.getInstance().getOpenid(),
                'achievements': uploadAchievements
            };

            window['wx'].request({
                url: BASE_URL + '/user/save', // 请求地址
                method: 'POST', // 请求方式
                data: JSON.stringify(postDataBody), // 发送的数据
                header: { // 设置请求的 header
                    'Content-Type': 'application/json',
                    'X-Game-Id': GAME_ID,
                    'Authorization': 'Bearer ' + generateToken(),
                    'X-Game-Platform': getPlatform()
                },
                success(res) {
                    console.log('User achievements saved success:', res);
                },
                fail(err) {
                    console.error('Error saving user achievements:', err);
                }
            });
        });
    }

    //增加抖音
    public ttSaveAchievements(): void {
        this.login(() => {
            let uploadAchievements = UserSettings.getInstance().getAchievements().map(achievement => {
                return { "id": achievement.id, "progress": achievement.progress }
            })
            const postDataBody = {
                'openid': UserSettings.getInstance().getOpenid(),
                'achievements': uploadAchievements
            };

            window['tt'].request({
                url: BASE_URL + '/user/save', // 请求地址
                method: 'POST', // 请求方式
                data: JSON.stringify(postDataBody), // 发送的数据
                header: { // 设置请求的 header
                    'Content-Type': 'application/json',
                    'X-Game-Id': GAME_ID,
                    'Authorization': 'Bearer ' + generateToken(),
                    'X-Game-Platform': getPlatform()
                },
                success(res) {
                    console.log('User achievements saved success:', res);
                },
                fail(err) {
                    console.error('Error saving user achievements:', err);
                }
            });
        });
    }
}

/**
 * 获取当前运行平台
 * @returns 
 */
function getPlatform(): string {
    if (sys.platform == sys.Platform.WECHAT_GAME) {
        return 'Wechat';
    } else if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
        return 'douyin';
    } else {
        return 'Wechat';
    }
}

function generateToken() {
    // 定义JWT的头部信息，指定了令牌的类型（JWT）和所使用的签名算法（HS256）
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    // 将头部信息对象转换为字符串，然后使用UTF-8编码，再通过Base64url方法进行编码得到一个URL安全的字符串
    let headBase64URLStr = CryptoJS.enc.Base64url.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(header)));

    // 定义JWT的载荷信息
    const payload = {
        "userId": UserSettings.getInstance().getOpenid(),
    };
    // 与头部处理相同，将载荷信息对象转换为字符串，然后编码得到URL安全的字符串
    let payloadBase64URLStr = CryptoJS.enc.Base64url.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));

    // 将编码后的头部和载荷信息用点号(.)连接起来，准备进行签名
    let needSignStr = headBase64URLStr + "." + payloadBase64URLStr;
    // 使用HmacSHA256算法对连接后的字符串进行签名
    const signature = CryptoJS.HmacSHA256(needSignStr, GAME_SECRET);
    // 将签名也进行Base64url编码得到URL安全的字符串
    let signatureBase64URLStr = CryptoJS.enc.Base64url.stringify(signature);

    // // 将编码后的头部、载荷和签名用点号(.)连接起来，形成完整的JWT令牌
    let token = headBase64URLStr + "." + payloadBase64URLStr + "." + signatureBase64URLStr;
    return token;
}

