import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  type AgentConfig,
  DEFAULT_INITIAL_AGENTS,
  type MoveType,
  type Payoffs,
  PAYOFFS_DEFAULT,
  type StrategyId,
} from '@/core/pd'
import { soundManager } from '@/core/sound'

export type ChapterId =
  | 'intro'
  | 'oneoff'
  | 'iterated'
  | 'tournament'
  | 'evolution'
  | 'distrust'
  | 'noise'
  | 'sandbox'
  | 'conclusion'
  | 'credits'

export interface ChapterMeta {
  id: ChapterId
  packageRoute: string
}

export const CHAPTERS: ChapterMeta[] = [
  { id: 'intro', packageRoute: '/pages/index/index' },
  { id: 'oneoff', packageRoute: '/pages/index/index' },
  { id: 'iterated', packageRoute: '/pages/index/index' },
  { id: 'tournament', packageRoute: '/pages-tournament/index/index' },
  { id: 'evolution', packageRoute: '/pages-tournament/index/index' },
  { id: 'distrust', packageRoute: '/pages-tournament/index/index' },
  { id: 'noise', packageRoute: '/pages-tournament/index/index' },
  { id: 'sandbox', packageRoute: '/pages-sandbox/index/index' },
  { id: 'conclusion', packageRoute: '/pages-sandbox/index/index' },
  { id: 'credits', packageRoute: '/pages-sandbox/index/index' },
]

export const useGameStore = defineStore('trust-game', () => {
  // 当前章节与子步骤
  const hasStartedGame = ref<boolean>(false)
  const currentChapter = ref<ChapterId>('intro')
  const slideStep = ref<number>(0)

  // 转场刮擦状态
  const isScratching = ref<boolean>(false)
  const scratchFrame = ref<number>(0)
  const scratchInPhase = ref<boolean>(true)

  // 局部刮擦状态（如切换对手或重置锦标赛）
  const localScratch = ref<{
    visible: boolean
    x: number
    y: number
    width: number
    height: number
    frame: number
    scratchIn: boolean
  }>({
    visible: false,
    x: 0,
    y: 0,
    width: 150,
    height: 162,
    frame: 0,
    scratchIn: true,
  })

  // 玩家交互记忆
  const oneoffAnswer = ref<MoveType>('COOPERATE')
  const iteratedTotalScore = ref<number>(0)
  const userBet = ref<StrategyId>('tft')

  // 全局博弈参数
  const payoffs = ref<Payoffs>({ ...PAYOFFS_DEFAULT })
  const turns = ref<number>(10)
  const selection = ref<number>(5)
  const noise = ref<number>(0)
  const initialAgents = ref<AgentConfig[]>(
    DEFAULT_INITIAL_AGENTS.map((a) => ({ ...a })),
  )
  const flowerConnections = ref<boolean>(false)

  function resetTournamentGlobals() {
    selection.value = 5
    turns.value = 10
    noise.value = 0
    flowerConnections.value = false
    payoffs.value = { ...PAYOFFS_DEFAULT }
    initialAgents.value = DEFAULT_INITIAL_AGENTS.map((a) => ({ ...a }))
  }

  function resetDefaultPayoffs() {
    payoffs.value = { ...PAYOFFS_DEFAULT }
  }

  /**
   * 播放全屏手绘刮擦动画并在中间帧执行回调
   */
  function runScratchTransition(onMidpoint: () => void, onDone?: () => void) {
    if (isScratching.value) return
    isScratching.value = true
    scratchInPhase.value = true
    scratchFrame.value = 0

    setTimeout(() => {
      soundManager.play('scratch_in', 0.75)
    }, 60)

    let frame = 0
    const timerIn = setInterval(() => {
      frame++
      if (frame > 19) {
        clearInterval(timerIn)
        onMidpoint()
        // 第二阶段：刮开
        scratchInPhase.value = false
        scratchFrame.value = 0
        setTimeout(() => {
          soundManager.play('scratch_out', 0.75)
        }, 60)
        let frameOut = 0
        const timerOut = setInterval(() => {
          frameOut++
          if (frameOut > 19) {
            clearInterval(timerOut)
            isScratching.value = false
            if (onDone) onDone()
          } else {
            scratchFrame.value = frameOut
          }
        }, 30)
      } else {
        scratchFrame.value = frame
      }
    }, 30)
  }

  /**
   * 播放局部手绘刮擦动画（例如第 2 章更换对手、第 4 章重置锦标赛）
   */
  function runLocalScratch(
    x: number,
    y: number,
    width: number,
    height: number,
    onMidpoint?: () => void,
    onDone?: () => void,
  ) {
    localScratch.value = {
      visible: true,
      x,
      y,
      width,
      height,
      frame: 0,
      scratchIn: true,
    }
    setTimeout(() => {
      soundManager.play('scratch_in', 0.65)
    }, 50)

    let frame = 0
    const timerIn = setInterval(() => {
      frame++
      if (frame > 19) {
        clearInterval(timerIn)
        if (onMidpoint) onMidpoint()
        localScratch.value.scratchIn = false
        localScratch.value.frame = 0
        setTimeout(() => {
          soundManager.play('scratch_out', 0.65)
        }, 50)
        let frameOut = 0
        const timerOut = setInterval(() => {
          frameOut++
          if (frameOut > 19) {
            clearInterval(timerOut)
            localScratch.value.visible = false
            if (onDone) onDone()
          } else {
            localScratch.value.frame = frameOut
          }
        }, 30)
      } else {
        localScratch.value.frame = frame
      }
    }, 30)
  }

  /**
   * 跳转到指定章节（自动判断同包切换或跨分包跳转）
   */
  function gotoChapter(targetChapter: ChapterId, targetStep = 0, useScratch = true) {
    hasStartedGame.value = true
    const currentMeta = CHAPTERS.find((c) => c.id === currentChapter.value)!
    const targetMeta = CHAPTERS.find((c) => c.id === targetChapter)!

    const performSwitch = () => {
      currentChapter.value = targetChapter
      slideStep.value = targetStep
      if (currentMeta.packageRoute !== targetMeta.packageRoute) {
        const pages = getCurrentPages()
        const currentRoute = pages.length > 0 ? '/' + pages[pages.length - 1].route : ''
        if (currentRoute !== targetMeta.packageRoute) {
          uni.redirectTo({
            url: `${targetMeta.packageRoute}?chapter=${targetChapter}&step=${targetStep}`,
          })
        }
      }
    }

    if (useScratch) {
      runScratchTransition(performSwitch)
    } else {
      performSwitch()
    }
  }

  /**
   * 前往下一章节
   */
  function nextChapter(useScratch = true) {
    const idx = CHAPTERS.findIndex((c) => c.id === currentChapter.value)
    if (idx >= 0 && idx < CHAPTERS.length - 1) {
      gotoChapter(CHAPTERS[idx + 1].id, 0, useScratch)
    }
  }

  return {
    hasStartedGame,
    currentChapter,
    slideStep,
    isScratching,
    scratchFrame,
    scratchInPhase,
    localScratch,
    oneoffAnswer,
    iteratedTotalScore,
    userBet,
    payoffs,
    turns,
    selection,
    noise,
    initialAgents,
    flowerConnections,
    resetTournamentGlobals,
    resetDefaultPayoffs,
    runScratchTransition,
    runLocalScratch,
    gotoChapter,
    nextChapter,
  }
})
