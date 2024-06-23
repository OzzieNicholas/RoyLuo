// AudioController.js
import { _decorator, Component, director, Node, AudioClip, AudioSource, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    @property({ type: AudioClip })
    bgmClip: AudioClip = null;
    @property({ type: AudioClip })
    clickClip: AudioClip = null;

    levelNames: string[] = [];

    private bgmSource: AudioSource

    // 添加音乐和声音效果的状态
    public musicIsOn: boolean = true;
    public soundEffectsIsOn: boolean = true;

    onLoad() {
        director.addPersistRootNode(this.node);
        this.bgmSource = this.getComponent(AudioSource) || this.addComponent(AudioSource);
        this.bgmSource.playOnAwake = false;
        // 初始化bgm
        if (!this.bgmClip) {
            resources.load('music/softvibes', AudioClip, (err, clip) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.bgmClip = clip;
                this.bgmSource.clip = this.bgmClip;
                this.bgmSource.loop = true;
                this.bgmSource.play();
            });
        } else {
            this.bgmSource.clip = this.bgmClip;
            this.bgmSource.loop = true;
            this.bgmSource.play();
        }


        // 初始化音量
        this.toggleBGM(true);
        this.toggleSoundEffects(true);
    }


    toggleBGM(isOn: boolean) {

        this.musicIsOn = isOn; // 更新状态

        if (isOn) {
            this.bgmSource.loop = true;
            this.bgmSource.play();
        } else {
            this.bgmSource.stop();
            this.bgmSource.loop = false;
        }
    }

    toggleSoundEffects(isOn: boolean) {
        // 控制声音效果的代码
        this.soundEffectsIsOn = isOn; // 更新状态
        
        this.bgmSource.volume = isOn ? 1 : 0;
    }

    public playSoundEffects(soundEffect: AudioClip) {
        this.bgmSource.playOneShot(soundEffect, this.bgmSource.volume);
    }

    playBGM(BGM: AudioClip) {
        this.bgmSource.clip = BGM;
        this.bgmSource.loop = true;
        this.bgmSource.play();
    }

    playclick() {
        this.bgmSource.playOneShot(this.clickClip, this.bgmSource.volume);
    }

    getVolume() {
        return this.bgmSource.volume;
    }

}
