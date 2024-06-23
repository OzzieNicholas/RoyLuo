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