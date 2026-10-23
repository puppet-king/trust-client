<template>
  <view
    class="absolute select-none"
    :style="{
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
      width: '500px',
      height: '500px',
    }"
  >
    <!-- 1. 网络连线层 -->
    <view
      class="absolute inset-0 pointer-events-none"
      style="position: absolute; left: 0px; top: 0px; width: 500px; height: 500px; pointer-events: none"
    >
      <view
        v-for="conn in renderedConnections"
        :key="conn.key"
        class="absolute"
        :style="{
          position: 'absolute',
          left: conn.x + 'px',
          top: conn.y + 'px',
          width: conn.dist + 'px',
          height: conn.highlighted ? '3px' : '1px',
          backgroundColor: conn.highlighted ? '#FFE663' : 'rgba(180, 180, 180, 0.45)',
          transform: `rotate(${conn.angleDeg}deg)`,
          transformOrigin: '0 50%',
          zIndex: conn.highlighted ? 5 : 1,
        }"
      />
    </view>

    <!-- 2. 环形角色与分数层 -->
    <view
      class="absolute inset-0 pointer-events-none"
      style="position: absolute; left: 0px; top: 0px; width: 500px; height: 500px; pointer-events: none"
    >
      <view
        v-for="agent in visualAgents"
        :key="agent.uid"
        class="absolute transition-opacity duration-200"
        :style="{
          position: 'absolute',
          left: agent.x + 'px',
          top: agent.y + 'px',
          zIndex: Math.round(agent.y) + 10,
          opacity: agent.eliminating ? 0 : 1,
          transform: agent.eliminating ? 'scale(0.5) rotate(12deg)' : 'scale(1)',
          transition: 'opacity 0.22s ease-out, transform 0.22s ease-out',
        }"
      >
        <!-- 小人雪碧图 (79x140 @ 0.5x = 39.5x70) -->
        <view
          class="absolute"
          :style="{
            position: 'absolute',
            left: '-20px',
            top: '-52.5px',
            width: '39.5px',
            height: '70px',
            transform: `scaleX(${agent.flipX})`,
          }"
        >
          <SpriteImage
            src="/static/tournament/tournament_peep.png"
            :view-width="39.5"
            :view-height="70"
            :sheet-width="256"
            :sheet-height="256"
            :offset-x="getTournamentPeepOffsetX(agent.strategy)"
            :offset-y="getTournamentPeepOffsetY(agent.strategy)"
          />
        </view>
        <!-- 内圈金币得分 -->
        <view
          v-if="showScores && !agent.eliminating"
          class="absolute flex items-center justify-center font-bold text-center"
          :style="{
            position: 'absolute',
            left: agent.scoreX - 24 + 'px',
            top: agent.scoreY - 12 + 'px',
            width: '48px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            textAlign: 'center',
            fontSize: '15px',
            color: '#444444',
          }"
        >
          {{ agent.coins }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import SpriteImage from './SpriteImage.vue'
import {
  type AgentConfig,
  createSimAgent,
  type Payoffs,
  PEEP_METADATA,
  playOneTournament,
  playRepeatedGame,
  type SimAgent,
  shuffleArray,
  type StrategyId,
} from '@/core/pd'
import { soundManager } from '@/core/sound'
import { useGameStore } from '@/stores/game'

const props = withDefaults(
  defineProps<{
    x?: number
    y?: number
  }>(),
  {
    x: -20,
    y: 20,
  },
)

const emit = defineEmits<{
  (e: 'stepCompleted', step: 'play' | 'eliminate' | 'reproduce'): void
  (e: 'autoPlayChange', playing: boolean): void
}>()

const gameStore = useGameStore()

interface VisualAgent {
  uid: number
  strategy: StrategyId
  angle: number
  startAngle: number
  gotoAngle: number
  coins: number
  eliminating: boolean
  sim: SimAgent
  x: number
  y: number
  scoreX: number
  scoreY: number
  flipX: number
}

let uidCounter = 1
const agents = ref<VisualAgent[]>([])
const agentCounts = ref<AgentConfig[]>([])
const showScores = ref(false)
const highlightedPair = ref<[number, number] | null>(null)
const highlightedAgentIndex = ref<number>(-1)
const isAutoPlaying = ref(false)
const currentStage = ref<'rest' | 'play' | 'eliminate' | 'reproduce'>('rest')

let sortedAgentUids: number[] = []
let stepPhase = 0 // 0: play, 1: eliminate, 2: reproduce
let animTimer: ReturnType<typeof setInterval> | null = null
let autoPlayTimer: ReturnType<typeof setTimeout> | null = null

function computeCoords(angle: number) {
  const x = Math.cos(angle) * 200 + 250
  const y = Math.sin(angle) * 200 + 265
  const scoreX = -Math.cos(angle) * 40
  const scoreY = -Math.sin(angle) * 48 - 22
  const flipX = Math.cos(angle) < 0 ? 1 : -1
  return { x, y, scoreX, scoreY, flipX }
}

function getTournamentPeepOffsetX(strategy: StrategyId): number {
  const frame = PEEP_METADATA[strategy].frame
  const col = frame % 5
  return -(5 + col * 44.5)
}

function getTournamentPeepOffsetY(strategy: StrategyId): number {
  const frame = PEEP_METADATA[strategy].frame
  const row = Math.floor(frame / 5)
  return -(5 + row * 75)
}

function populateAgents() {
  const flat: StrategyId[] = []
  for (const cfg of agentCounts.value) {
    for (let j = 0; j < cfg.count; j++) {
      flat.push(cfg.strategy)
    }
  }
  const n = flat.length
  const list: VisualAgent[] = []
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    const coords = computeCoords(angle)
    const uid = uidCounter++
    list.push({
      uid,
      strategy: flat[i],
      angle,
      startAngle: angle,
      gotoAngle: angle,
      coins: 0,
      eliminating: false,
      sim: createSimAgent(uid, flat[i]),
      ...coords,
    })
  }
  agents.value = list
}

function reset() {
  stopAutoPlay()
  if (animTimer) {
    clearInterval(animTimer)
    animTimer = null
  }
  currentStage.value = 'rest'
  stepPhase = 0
  showScores.value = false
  highlightedPair.value = null
  highlightedAgentIndex.value = -1
  agentCounts.value = gameStore.initialAgents.map((a) => ({ ...a }))
  populateAgents()
}

const visualAgents = computed(() => agents.value)

const renderedConnections = computed(() => {
  const list: {
    key: string
    x: number
    y: number
    dist: number
    angleDeg: number
    highlighted: boolean
  }[] = []
  const arr = agents.value.filter((a) => !a.eliminating)
  const pair = highlightedPair.value
  const hiIdx = highlightedAgentIndex.value

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const a = arr[i]
      const b = arr[j]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI
      let highlighted = false
      if (pair && ((pair[0] === i && pair[1] === j) || (pair[0] === j && pair[1] === i))) {
        highlighted = true
      } else if (hiIdx === i || hiIdx === j) {
        highlighted = true
      }
      list.push({
        key: `${a.uid}-${b.uid}`,
        x: a.x,
        y: a.y,
        dist,
        angleDeg,
        highlighted,
      })
    }
  }
  return list
})

function dehighlightAllConnections() {
  highlightedPair.value = null
  highlightedAgentIndex.value = -1
}

export interface MatchResultData {
  charA: StrategyId
  charB: StrategyId
  scoreA: number
  scoreB: number
  payoffs: [number, number][]
}

function playMatch(matchNumber: number): MatchResultData {
  const pairs: [number, number][] = []
  const arr = agents.value
  for (let a = 0; a < arr.length; a++) {
    for (let b = a + 1; b < arr.length; b++) {
      pairs.push([a, b])
    }
  }
  const pair = pairs[matchNumber] || [0, 1]
  highlightedPair.value = pair

  const agentA = arr[pair[0]]
  const agentB = arr[pair[1]]
  const scores = playRepeatedGame(
    agentA.sim,
    agentB.sim,
    10,
    gameStore.noise,
    gameStore.payoffs as Payoffs,
  )

  agentA.coins = agentA.sim.coins
  agentB.coins = agentB.sim.coins
  showScores.value = true

  return {
    charA: agentA.strategy,
    charB: agentB.strategy,
    scoreA: scores.totalA,
    scoreB: scores.totalB,
    payoffs: scores.payoffs,
  }
}

function startPlay() {
  if (currentStage.value !== 'rest') return
  currentStage.value = 'play'
  if (!isAutoPlaying.value) {
    soundManager.play('coin_get', 0.25)
  }

  const runCalculation = () => {
    const sims = agents.value.map((a) => a.sim)
    playOneTournament(sims, gameStore.turns, gameStore.noise, gameStore.payoffs)
    agents.value.forEach((a) => {
      a.coins = a.sim.coins
    })
    showScores.value = true

    const shuffled = shuffleArray(agents.value.slice())
    shuffled.sort((a, b) => a.coins - b.coins)
    sortedAgentUids = shuffled.map((a) => a.uid)

    highlightedAgentIndex.value = -1
    currentStage.value = 'rest'
    emit('stepCompleted', 'play')
  }

  if (isAutoPlaying.value) {
    highlightedAgentIndex.value = Math.floor(Math.random() * agents.value.length)
    setTimeout(runCalculation, 60)
  } else {
    let idx = 0
    if (animTimer) clearInterval(animTimer)
    animTimer = setInterval(() => {
      if (idx < agents.value.length) {
        highlightedAgentIndex.value = idx
        idx += 2
      } else {
        if (animTimer) clearInterval(animTimer)
        animTimer = null
        runCalculation()
      }
    }, 22)
  }
}

function startEliminate() {
  if (currentStage.value !== 'rest') return
  currentStage.value = 'eliminate'
  if (!isAutoPlaying.value) {
    soundManager.play('squeak', 0.45)
  }

  const count = Math.min(gameStore.selection, sortedAgentUids.length)
  const worstUids = new Set(sortedAgentUids.slice(0, count))

  for (const agent of agents.value) {
    if (worstUids.has(agent.uid)) {
      agent.eliminating = true
      const cfg = agentCounts.value.find((c) => c.strategy === agent.strategy)
      if (cfg && cfg.count > 0) cfg.count--
    }
  }

  const delay = isAutoPlaying.value ? 70 : 240
  setTimeout(() => {
    agents.value = agents.value.filter((a) => !worstUids.has(a.uid))
    currentStage.value = 'rest'
    emit('stepCompleted', 'eliminate')
  }, delay)
}

function startReproduce() {
  if (currentStage.value !== 'rest') return
  currentStage.value = 'reproduce'
  showScores.value = false
  if (!isAutoPlaying.value) {
    soundManager.play('bonk', 0.35)
  }

  const count = Math.min(gameStore.selection, sortedAgentUids.length)
  const bestUids = sortedAgentUids.slice(sortedAgentUids.length - count)

  for (const bestUid of bestUids) {
    const goodAgent = agents.value.find((a) => a.uid === bestUid)
    if (!goodAgent) continue

    const cfg = agentCounts.value.find((c) => c.strategy === goodAgent.strategy)
    if (cfg) cfg.count++

    const angle = goodAgent.angle + 0.08
    const coords = computeCoords(angle)
    const uid = uidCounter++
    const clone: VisualAgent = {
      uid,
      strategy: goodAgent.strategy,
      angle,
      startAngle: angle,
      gotoAngle: angle,
      coins: 0,
      eliminating: false,
      sim: createSimAgent(uid, goodAgent.strategy),
      ...coords,
    }
    const idx = agents.value.indexOf(goodAgent)
    agents.value.splice(idx, 0, clone)
  }

  const total = agents.value.length
  for (let i = 0; i < total; i++) {
    const a = agents.value[i]
    a.startAngle = a.angle
    a.gotoAngle = (i / total) * Math.PI * 2 - Math.PI / 2
  }

  let progress = 0
  const stepInc = isAutoPlaying.value ? 0.34 : 0.12
  if (animTimer) clearInterval(animTimer)
  animTimer = setInterval(() => {
    progress = Math.min(1, progress + stepInc)
    for (const a of agents.value) {
      a.angle = a.startAngle + (a.gotoAngle - a.startAngle) * progress
      const coords = computeCoords(a.angle)
      a.x = coords.x
      a.y = coords.y
      a.scoreX = coords.scoreX
      a.scoreY = coords.scoreY
      a.flipX = coords.flipX
    }
    if (progress >= 1) {
      if (animTimer) clearInterval(animTimer)
      animTimer = null
      currentStage.value = 'rest'
      emit('stepCompleted', 'reproduce')
    }
  }, 25)
}

function nextStep() {
  if (currentStage.value !== 'rest') return
  if (stepPhase === 0) startPlay()
  else if (stepPhase === 1) startEliminate()
  else if (stepPhase === 2) startReproduce()
  stepPhase = (stepPhase + 1) % 3
}

function stepManually() {
  stopAutoPlay()
  nextStep()
}

function startAutoPlay() {
  isAutoPlaying.value = true
  emit('autoPlayChange', true)
  const loop = () => {
    if (!isAutoPlaying.value) return
    if (currentStage.value === 'rest') {
      nextStep()
    }
    autoPlayTimer = setTimeout(loop, 85)
  }
  loop()
}

function stopAutoPlay() {
  if (isAutoPlaying.value) {
    isAutoPlaying.value = false
    emit('autoPlayChange', false)
  }
  if (autoPlayTimer) {
    clearTimeout(autoPlayTimer)
    autoPlayTimer = null
  }
}

function toggleAutoPlay() {
  if (isAutoPlaying.value) stopAutoPlay()
  else startAutoPlay()
}

// 初始化加载
reset()

onUnmounted(() => {
  stopAutoPlay()
  if (animTimer) clearInterval(animTimer)
})

defineExpose({
  isAutoPlaying,
  reset,
  playMatch,
  dehighlightAllConnections,
  startPlay,
  startEliminate,
  startReproduce,
  stepManually,
  startAutoPlay,
  stopAutoPlay,
  toggleAutoPlay,
})
</script>
