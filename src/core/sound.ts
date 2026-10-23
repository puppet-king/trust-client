import { ref } from 'vue'

export type SoundName =
  | 'button1'
  | 'button2'
  | 'button3'
  | 'coin_insert'
  | 'coin_get'
  | 'evil_laugh'
  | 'whoosh'
  | 'thump'
  | 'squeak'
  | 'bonk'
  | 'machine_start'
  | 'scratch_in'
  | 'scratch_out'
  | 'drumroll'
  | 'fart'
  | 'bg_music'

const SOUND_PATHS: Record<SoundName, string> = {
  button1: '/static/sounds/button1.mp3',
  button2: '/static/sounds/button2.mp3',
  button3: '/static/sounds/button3.mp3',
  coin_insert: '/static/sounds/coin_insert.mp3',
  coin_get: '/static/sounds/coin_get.mp3',
  evil_laugh: '/static/sounds/evil_laugh.mp3',
  whoosh: '/static/sounds/whoosh.mp3',
  thump: '/static/sounds/thump.mp3',
  squeak: '/static/sounds/squeak.mp3',
  bonk: '/static/sounds/bonk.mp3',
  machine_start: '/static/sounds/machine_start.mp3',
  scratch_in: '/static/sounds/scratch_in.mp3',
  scratch_out: '/static/sounds/scratch_out.mp3',
  drumroll: '/pages-tournament/static/drumroll.mp3',
  fart: '/pages-tournament/static/fart.mp3',
  bg_music: '/pages-tournament/static/bg_music.mp3',
}

class SoundManager {
  public isSoundOn = ref<boolean>(true)
  private bgmCtx: UniApp.InnerAudioContext | null = null
  private bgmStarted = false
  private sfxPool: UniApp.InnerAudioContext[] = []
  private poolIndex = 0
  private readonly maxPoolSize = 6

  public toggleSound() {
    this.isSoundOn.value = !this.isSoundOn.value
    if (!this.isSoundOn.value) {
      this.pauseBgm()
    } else if (this.bgmStarted) {
      this.resumeBgmIfNeeded()
    }
  }

  public play(name: SoundName, volume = 0.8) {
    if (!this.isSoundOn.value) return
    try {
      let ctx: UniApp.InnerAudioContext
      if (this.sfxPool.length < this.maxPoolSize) {
        ctx = uni.createInnerAudioContext()
        this.sfxPool.push(ctx)
      } else {
        ctx = this.sfxPool[this.poolIndex]
        this.poolIndex = (this.poolIndex + 1) % this.maxPoolSize
        try {
          ctx.stop()
        } catch {
          // ignore
        }
      }
      ctx.src = SOUND_PATHS[name]
      ctx.volume = Math.max(0, Math.min(1, volume))
      ctx.loop = false
      ctx.play()
    } catch {
      // ignore audio errors in restricted environments
    }
  }

  public playRandomButton() {
    const idx = Math.ceil(Math.random() * 3) as 1 | 2 | 3
    this.play(`button${idx}`, 0.7)
  }

  public startBgm(volume = 0.65) {
    this.bgmStarted = true
    if (!this.isSoundOn.value) return
    try {
      if (!this.bgmCtx) {
        this.bgmCtx = uni.createInnerAudioContext()
        this.bgmCtx.src = SOUND_PATHS.bg_music
        this.bgmCtx.loop = true
      }
      this.bgmCtx.volume = volume
      this.bgmCtx.play()
    } catch {
      // ignore
    }
  }

  public pauseBgm() {
    if (this.bgmCtx) {
      try {
        this.bgmCtx.pause()
      } catch {
        // ignore
      }
    }
  }

  public resumeBgmIfNeeded() {
    if (this.bgmStarted && this.isSoundOn.value && this.bgmCtx) {
      try {
        this.bgmCtx.play()
      } catch {
        // ignore
      }
    }
  }
}

export const soundManager = new SoundManager()
