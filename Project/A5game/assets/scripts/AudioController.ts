// import { _decorator, AudioClip, AudioSource, Component, director, Node, resources } from 'cc';
// const { ccclass, property } = _decorator;

// @ccclass('AudioController')
// export class AudioController extends Component {
//     //主页的背景音乐
//     @property({ type: AudioClip })
//     bgmClip: AudioClip = null;
//     @property({ type: AudioClip })
//     clickClip: AudioClip = null;

//     //关卡内的背景音乐
//     @property(AudioClip)
//     public gameBGM: AudioClip = null;

//     private bgmSource: AudioSource

//     // 添加音乐和声音效果的状态
//     public musicIsOn: boolean = true;
//     public soundEffectsIsOn: boolean = true;

//     onLoad() {
//         director.addPersistRootNode(this.node);
//         this.bgmSource = this.getComponent(AudioSource) || this.addComponent(AudioSource);
//         this.bgmSource.playOnAwake = false;
//         // 初始化bgm
        
//         this.bgmSource.clip = this.bgmClip;
//         this.bgmSource.loop = true;
//         this.bgmSource.play();

//         // 初始化音量
//         this.toggleBGM(true);
//         this.toggleSoundEffects(true);
//     }

//     toggleBGM(isOn: boolean) {

//         this.musicIsOn = isOn; // 更新状态

//         if (isOn) {
//             this.bgmSource.loop = true;
//             this.bgmSource.play();
//         } else {
//             this.bgmSource.stop();
//             this.bgmSource.loop = false;
//         }
//     }

//     toggleSoundEffects(isOn: boolean) {
//         // 控制声音效果的代码
//         this.soundEffectsIsOn = isOn; // 更新状态
        
//         this.bgmSource.volume = isOn ? 1 : 0;
//     }

//     public playSoundEffects(soundEffect: AudioClip) {
//         this.bgmSource.playOneShot(soundEffect, this.bgmSource.volume);
//     }

//     playBGM(BGM: AudioClip) {
//         this.bgmSource.clip = BGM;
//         this.bgmSource.loop = true;
//         this.bgmSource.play();
//     }

//     playclick() {
//         this.bgmSource.playOneShot(this.clickClip, this.bgmSource.volume);
//     }

//     getVolume() {
//         return this.bgmSource.volume;
//     }

//     //切换背景音乐
//     switchBackgroundMusic(clip: AudioClip) {
//         this.bgmSource.stop();
//         this.bgmSource.clip = clip;
//         this.bgmSource.play();
//     }


//     start() {

//     }

//     update(deltaTime: number) {
        
//     }
// }


import { _decorator, AudioClip, AudioSource, Component, director, Node, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    @property({ type: AudioClip })
    bgmClip: AudioClip = null;

    @property({ type: AudioClip })
    clickClip: AudioClip = null;

    @property(AudioClip)
    public gameBGM: AudioClip = null;

    private bgmSource: AudioSource;
    private effectSource: AudioSource;

    public musicIsOn: boolean = true;
    public soundEffectsIsOn: boolean = true;

    onLoad() {
        director.addPersistRootNode(this.node);

        this.bgmSource = this.getComponent(AudioSource) || this.addComponent(AudioSource);
        this.bgmSource.playOnAwake = false;
        this.bgmSource.clip = this.bgmClip;
        this.bgmSource.loop = true;

        // 新建一个 AudioSource 用于音效
        this.effectSource = this.node.addComponent(AudioSource);
        this.effectSource.playOnAwake = false;

        // 初始化背景音乐和音效
        this.toggleBGM(this.musicIsOn);
        this.toggleSoundEffects(this.soundEffectsIsOn);
    }

    toggleBGM(isOn: boolean) {
        this.musicIsOn = isOn;

        if (isOn) {
            this.bgmSource.loop = true;
            if (!this.bgmSource.playing) {
                this.bgmSource.play();
            }
        } else {
            this.bgmSource.stop();
        }
    }

    toggleSoundEffects(isOn: boolean) {
        this.soundEffectsIsOn = isOn;
        this.effectSource.volume = isOn ? 1 : 0;
    }

    public playSoundEffects(soundEffect: AudioClip) {
        if (this.soundEffectsIsOn) {
            this.effectSource.playOneShot(soundEffect, 1);
        }
    }

    playBGM(BGM: AudioClip) {
        this.bgmSource.clip = BGM;
        this.bgmSource.loop = true;
        this.bgmSource.play();
    }

    playClick() {
        if (this.soundEffectsIsOn) {
            this.effectSource.playOneShot(this.clickClip, 1);
        }
    }

    switchBackgroundMusic(clip: AudioClip) {
        this.bgmSource.stop();
        this.bgmSource.clip = clip;
        this.bgmSource.play();
    }
}



