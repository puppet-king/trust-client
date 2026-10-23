<template>
  <view
    class="absolute select-none transition-all duration-500"
    :style="{
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
      width: '700px',
      height: '250px',
    }"
  >
    <!-- 计分板（可选显示，位于投币机上方） -->
    <view
      v-if="showScoreboard"
      class="absolute transition-opacity duration-300"
      style="position: absolute; left: 248px; top: -98px; width: 200px; height: 100px"
    >
      <image
        src="/static/iterated/iterated_scoreboard.png"
        mode="scaleToFill"
        style="width: 200px; height: 100px; display: block"
      />
      <view
        class="absolute flex items-center justify-center font-bold"
        style="position: absolute; left: 20px; top: 21px; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 42px; color: #666666"
      >
        {{ scoreA }}
      </view>
      <view
        class="absolute flex items-center justify-center font-bold"
        style="position: absolute; right: 15px; top: 21px; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 42px; color: #666666"
      >
        {{ scoreB }}
      </view>
    </view>

    <!-- 投币机主体背景 (1398x498 @ 0.5x = 699x249) -->
    <view
      class="absolute pointer-events-none"
      style="position: absolute; left: 0px; top: 0px; width: 699px; height: 249px; pointer-events: none"
    >
      <SpriteImage
        src="/static/iterated/iterated_machine.png"
        :view-width="699"
        :view-height="249"
        :sheet-width="1024"
        :sheet-height="1024"
        :offset-x="-5"
        :offset-y="-5"
      />
    </view>

    <!-- 中央收益矩阵高亮雪碧图 (502x502 @ 0.5x = 251x251) -->
    <view
      class="absolute pointer-events-none"
      style="position: absolute; left: 224.5px; top: -0.5px; width: 251px; height: 251px; pointer-events: none"
    >
      <SpriteImage
        src="/static/iterated/iterated_payoffs.png"
        :view-width="251"
        :view-height="251"
        :sheet-width="1024"
        :sheet-height="2048"
        :offset-x="payoffOffsetX"
        :offset-y="payoffOffsetY"
      />
    </view>

    <!-- 四个倾斜文字标签 -->
    <view
      class="absolute text-center font-bold pointer-events-none"
      :style="{
        position: 'absolute',
        left: '354px',
        top: '32px',
        width: '72px',
        fontSize: '14px',
        lineHeight: '1.1',
        textAlign: 'center',
        fontWeight: 700,
        transform: 'rotate(45deg)',
        color: highlightL1 ? '#FFE663' : '#333333',
        pointerEvents: 'none',
      }"
    >
      <rich-text :nodes="t('label_they_cooperate')" />
    </view>
    <view
      class="absolute text-center font-bold pointer-events-none"
      :style="{
        position: 'absolute',
        left: '272px',
        top: '33px',
        width: '72px',
        fontSize: '14px',
        lineHeight: '1.1',
        textAlign: 'center',
        fontWeight: 700,
        transform: 'rotate(-45deg)',
        color: highlightL2 ? '#FFE663' : '#333333',
        pointerEvents: 'none',
      }"
    >
      <rich-text :nodes="t('label_you_cooperate')" />
    </view>
    <view
      class="absolute text-center font-bold pointer-events-none"
      :style="{
        position: 'absolute',
        left: '406px',
        top: '84px',
        width: '72px',
        fontSize: '14px',
        lineHeight: '1.1',
        textAlign: 'center',
        fontWeight: 700,
        transform: 'rotate(45deg)',
        color: highlightL3 ? '#FFE663' : '#333333',
        pointerEvents: 'none',
      }"
    >
      <rich-text :nodes="t('label_they_cheat')" />
    </view>
    <view
      class="absolute text-center font-bold pointer-events-none"
      :style="{
        position: 'absolute',
        left: '224px',
        top: '81px',
        width: '72px',
        fontSize: '14px',
        lineHeight: '1.1',
        textAlign: 'center',
        fontWeight: 700,
        transform: 'rotate(-45deg)',
        color: highlightL4 ? '#FFE663' : '#333333',
        pointerEvents: 'none',
      }"
    >
      <rich-text :nodes="t('label_you_cheat')" />
    </view>

    <!-- 左侧玩家 A (你) -->
    <view
      class="absolute pointer-events-none"
      :style="{
        position: 'absolute',
        left: 62 + playerA.offsetX + 'px',
        top: 236 + playerA.offsetY + 'px',
        transform: `rotate(${playerA.rotation}deg)`,
        transition: playerA.transition,
        pointerEvents: 'none',
      }"
    >
      <!-- 手持硬币 -->
      <view
        v-if="playerA.coinVisible"
        class="absolute"
        :style="{
          position: 'absolute',
          left: playerA.coinX - 25.5 + 'px',
          top: playerA.coinY - 25.5 + 'px',
          width: '51px',
          height: '51px',
          transition: 'left 0.25s ease-in-out, top 0.25s ease-in-out',
        }"
      >
        <SpriteImage
          src="/static/iterated/iterated_coin.png"
          :view-width="51"
          :view-height="51"
          :sheet-width="64"
          :sheet-height="64"
          :offset-x="-5"
          :offset-y="-5"
        />
      </view>
      <!-- 奖励飞出硬币 -->
      <view
        v-for="(c, idx) in playerA.rewardCoins"
        :key="'ca-' + idx"
        v-show="c.visible"
        class="absolute"
        :style="{
          position: 'absolute',
          left: c.x - 25.5 + 'px',
          top: c.y - 25.5 + 'px',
          width: '51px',
          height: '51px',
          transition: 'left 0.28s linear, top 0.14s ease-out',
        }"
      >
        <SpriteImage
          src="/static/iterated/iterated_coin.png"
          :view-width="51"
          :view-height="51"
          :sheet-width="64"
          :sheet-height="64"
          :offset-x="-5"
          :offset-y="-5"
        />
      </view>
      <!-- 身体 (Frame 0) -->
      <view
        class="absolute"
        style="position: absolute; left: -75.5px; top: -191px; width: 151px; height: 201px"
      >
        <SpriteImage
          src="/static/iterated/iterated_peep.png"
          :view-width="151"
          :view-height="201"
          :sheet-width="1024"
          :sheet-height="1024"
          :offset-x="getPeepOffsetX(0)"
          :offset-y="getPeepOffsetY(0)"
        />
      </view>
      <!-- 帽子 -->
      <view
        class="absolute"
        style="position: absolute; left: -75.5px; top: -191px; width: 151px; height: 201px"
      >
        <SpriteImage
          src="/static/iterated/iterated_peep.png"
          :view-width="151"
          :view-height="201"
          :sheet-width="1024"
          :sheet-height="1024"
          :offset-x="getPeepOffsetX(playerAHatFrame)"
          :offset-y="getPeepOffsetY(playerAHatFrame)"
        />
      </view>
      <!-- 脸部表情 -->
      <view
        class="absolute"
        style="position: absolute; left: -75.5px; top: -191px; width: 151px; height: 201px"
      >
        <SpriteImage
          src="/static/iterated/iterated_peep.png"
          :view-width="151"
          :view-height="201"
          :sheet-width="1024"
          :sheet-height="1024"
          :offset-x="getPeepOffsetX(playerA.faceFrame)"
          :offset-y="getPeepOffsetY(playerA.faceFrame)"
        />
      </view>
      <!-- 眉毛 -->
      <view
        v-if="playerA.eyebrowFrame > 0"
        class="absolute"
        style="position: absolute; left: -75.5px; top: -191px; width: 151px; height: 201px"
      >
        <SpriteImage
          src="/static/iterated/iterated_peep.png"
          :view-width="151"
          :view-height="201"
          :sheet-width="1024"
          :sheet-height="1024"
          :offset-x="getPeepOffsetX(playerA.eyebrowFrame)"
          :offset-y="getPeepOffsetY(playerA.eyebrowFrame)"
        />
      </view>
    </view>

    <!-- 右侧玩家 B (对手，水平翻转) -->
    <view
      class="absolute pointer-events-none"
      :style="{
        position: 'absolute',
        left: 638 - playerB.offsetX + 'px',
        top: 236 + playerB.offsetY + 'px',
        transform: 'scaleX(-1)',
        transition: playerB.transition,
        pointerEvents: 'none',
      }"
    >
      <!-- 手持硬币 -->
      <view
        v-if="playerB.coinVisible"
        class="absolute"
        :style="{
          position: 'absolute',
          left: playerB.coinX - 25.5 + 'px',
          top: playerB.coinY - 25.5 + 'px',
          width: '51px',
          height: '51px',
          transition: 'left 0.25s ease-in-out, top 0.25s ease-in-out',
        }"
      >
        <SpriteImage
          src="/static/iterated/iterated_coin.png"
          :view-width="51"
          :view-height="51"
          :sheet-width="64"
          :sheet-height="64"
          :offset-x="-5"
          :offset-y="-5"
        />
      </view>
      <!-- 奖励飞出硬币 -->
      <view
        v-for="(c, idx) in playerB.rewardCoins"
        :key="'cb-' + idx"
        v-show="c.visible"
        class="absolute"
        :style="{
          position: 'absolute',
          left: c.x - 25.5 + 'px',
          top: c.y - 25.5 + 'px',
          width: '51px',
          height: '51px',
          transition: 'left 0.28s linear, top 0.14s ease-out',
        }"
      >
        <SpriteImage
          src="/static/iterated/iterated_coin.png"
          :view-width="51"
          :view-height="51"
          :sheet-width="64"
          :sheet-height="64"
          :offset-x="-5"
          :offset-y="-5"
        />
      </view>
      <!-- 身体 -->
      <view
        class="absolute"
        style="position: absolute; left: -75.5px; top: -191px; width: 151px; height: 201px"
      >
        <SpriteImage
          src="/static/iterated/iterated_peep.png"
          :view-width="151"
          :view-height="201"
          :sheet-width="1024"
          :sheet-height="1024"
          :offset-x="getPeepOffsetX(0)"
          :offset-y="getPeepOffsetY(0)"
        />
      </view>
      <!-- 帽子 -->
      <view
        class="absolute"
        style="position: absolute; left: -75.5px; top: -191px; width: 151px; height: 201px"
      >
        <SpriteImage
          src="/static/iterated/iterated_peep.png"
          :view-width="151"
          :view-height="201"
          :sheet-width="1024"
          :sheet-height="1024"
          :offset-x="getPeepOffsetX(playerBHatFrame)"
          :offset-y="getPeepOffsetY(playerBHatFrame)"
        />
      </view>
      <!-- 脸部表情 -->
      <view
        class="absolute"
        style="position: absolute; left: -75.5px; top: -191px; width: 151px; height: 201px"
      >
        <SpriteImage
          src="/static/iterated/iterated_peep.png"
          :view-width="151"
          :view-height="201"
          :sheet-width="1024"
          :sheet-height="1024"
          :offset-x="getPeepOffsetX(playerB.faceFrame)"
          :offset-y="getPeepOffsetY(playerB.faceFrame)"
        />
      </view>
      <!-- 眉毛 -->
      <view
        v-if="playerB.eyebrowFrame > 0"
        class="absolute"
        style="position: absolute; left: -75.5px; top: -191px; width: 151px; height: 201px"
      >
        <SpriteImage
          src="/static/iterated/iterated_peep.png"
          :view-width="151"
          :view-height="201"
          :sheet-width="1024"
          :sheet-height="1024"
          :offset-x="getPeepOffsetX(playerB.eyebrowFrame)"
          :offset-y="getPeepOffsetY(playerB.eyebrowFrame)"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import SpriteImage from './SpriteImage.vue'
import {
  createLogic,
  getPayoffs,
  type MoveType,
  PD_CHEAT,
  PD_COOPERATE,
  PEEP_METADATA,
  type StrategyId,
  type StrategyLogic,
} from '@/core/pd'
import { soundManager } from '@/core/sound'
import { t } from '@/locales/zh-CN'

const props = withDefaults(
  defineProps<{
    x?: number
    y?: number
    opponentStrategy?: StrategyId
    playerAStrategy?: StrategyId | null
    showScoreboard?: boolean
    scoreA?: number
    scoreB?: number
  }>(),
  {
    x: 130,
    y: 133,
    opponentStrategy: 'tft',
    playerAStrategy: null,
    showScoreboard: false,
    scoreA: 0,
    scoreB: 0,
  },
)

const payoffFrame = ref<number>(3)
const highlightL1 = ref(false) // they cooperate
const highlightL2 = ref(false) // you cooperate
const highlightL3 = ref(false) // they cheat
const highlightL4 = ref(false) // you cheat

let opponentLogic: StrategyLogic = createLogic(props.opponentStrategy)

watch(
  () => props.opponentStrategy,
  (newStrat) => {
    opponentLogic = createLogic(newStrat)
    resetFaces()
  },
)

interface PeepAnimState {
  offsetX: number
  offsetY: number
  rotation: number
  transition: string
  faceFrame: number
  eyebrowFrame: number
  coinVisible: boolean
  coinX: number
  coinY: number
  rewardCoins: { visible: boolean; x: number; y: number }[]
}

function makeInitialPeepState(): PeepAnimState {
  return {
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    transition: 'left 0.35s linear, top 0.2s ease, transform 0.25s ease',
    faceFrame: 1,
    eyebrowFrame: 0,
    coinVisible: false,
    coinX: 10,
    coinY: -30,
    rewardCoins: [
      { visible: false, x: 155, y: -25 },
      { visible: false, x: 155, y: -25 },
      { visible: false, x: 155, y: -25 },
    ],
  }
}

const playerA = reactive<PeepAnimState>(makeInitialPeepState())
const playerB = reactive<PeepAnimState>(makeInitialPeepState())

const playerAHatFrame = computed(() => {
  if (props.playerAStrategy) {
    return 13 + PEEP_METADATA[props.playerAStrategy].frame
  }
  return 12
})

const playerBHatFrame = computed(() => {
  return 13 + PEEP_METADATA[props.opponentStrategy].frame
})

function getPeepOffsetX(frame: number): number {
  const col = frame % 6
  return -(5 + col * 156)
}

function getPeepOffsetY(frame: number): number {
  const row = Math.floor(frame / 6)
  return -(5 + row * 206)
}

const payoffOffsetX = computed(() => {
  const col = payoffFrame.value % 3
  return -(5 + col * 256)
})

const payoffOffsetY = computed(() => {
  const row = Math.floor(payoffFrame.value / 3)
  return -(5 + row * 256)
})

function dehighlightPayoff() {
  payoffFrame.value = 3
  highlightL1.value = false
  highlightL2.value = false
  highlightL3.value = false
  highlightL4.value = false
}

function oneoffHighlight1(yourAnswer: MoveType) {
  dehighlightPayoff()
  payoffFrame.value = 1
  if (yourAnswer === PD_COOPERATE) highlightL2.value = true
  else highlightL4.value = true
  highlightL3.value = true
}

function oneoffHighlight2(yourAnswer: MoveType) {
  dehighlightPayoff()
  payoffFrame.value = 2
  if (yourAnswer === PD_COOPERATE) highlightL2.value = true
  else highlightL4.value = true
  highlightL1.value = true
}

function highlightPayoffByScore(payoffA: number) {
  dehighlightPayoff()
  if (payoffA === 2) {
    payoffFrame.value = 4
    highlightL1.value = true
    highlightL2.value = true
  } else if (payoffA === 3) {
    payoffFrame.value = 5
    highlightL1.value = true
    highlightL4.value = true
  } else if (payoffA === -1) {
    payoffFrame.value = 6
    highlightL2.value = true
    highlightL3.value = true
  } else {
    payoffFrame.value = 7
    highlightL3.value = true
    highlightL4.value = true
  }
}

let introTimer: ReturnType<typeof setInterval> | null = null
function introMachine() {
  soundManager.play('machine_start', 0.65)
  let step = 12
  if (introTimer) clearInterval(introTimer)
  introTimer = setInterval(() => {
    payoffFrame.value = 4 + (step % 4)
    step--
    if (step <= 0) {
      if (introTimer) clearInterval(introTimer)
      dehighlightPayoff()
    }
  }, 90)
}

function resetFaces() {
  playerA.faceFrame = 1
  playerA.eyebrowFrame = 0
  playerA.rotation = 0
  playerB.faceFrame = 1
  playerB.eyebrowFrame = 0
  playerB.rotation = 0
}

function resetOpponent(strategy: StrategyId) {
  opponentLogic = createLogic(strategy)
  resetFaces()
  dehighlightPayoff()
}

function animateSinglePeep(
  peep: PeepAnimState,
  payoff: number,
  isOpponent: boolean,
  isTrip: boolean,
): Promise<void> {
  return new Promise((resolve) => {
    // 1. 掏出硬币
    peep.coinVisible = true
    peep.coinX = 60
    peep.coinY = -75

    setTimeout(() => {
      if (isTrip) {
        // 第 6 章失误绊倒动画
        peep.offsetX = 18
        peep.offsetY = -10
        peep.rotation = 72
        peep.coinVisible = false
        peep.eyebrowFrame = 0
        peep.faceFrame = 19
        soundManager.play('thump', 0.85)
        soundManager.play('squeak', 0.85)

        setTimeout(() => {
          peep.offsetX = 0
          peep.offsetY = 0
          peep.rotation = 0
          peep.faceFrame = 2
          setTimeout(() => {
            peep.faceFrame = 1
            resolve()
          }, 250)
        }, 700)
        return
      }

      // 2. 走向机器
      peep.offsetX = 70
      setTimeout(() => {
        // 3. 投币或收回硬币
        if (payoff === 2 || payoff === -1) {
          // 合作：投币进入机器
          peep.coinX = 95
          peep.coinY = -25
          setTimeout(() => {
            peep.coinVisible = false
            peep.eyebrowFrame = 0
            peep.faceFrame = payoff === 2 ? 8 : 9
            soundManager.play('coin_insert', 0.45)
          }, 180)
        } else {
          // 欺骗：收回硬币
          peep.coinX = 50
          peep.coinY = -95
          setTimeout(() => {
            peep.eyebrowFrame = 0
            peep.faceFrame = payoff === 0 ? 7 : 10
            soundManager.play('whoosh', 0.7)
            if (payoff === 3 && !isOpponent) {
              soundManager.play('evil_laugh', 0.85)
            } else if (payoff === 3 && isOpponent) {
              setTimeout(() => soundManager.play('evil_laugh', 0.85), 80)
            }
          }, 180)
        }

        // 4. 走回原位并结算奖励硬币
        setTimeout(() => {
          peep.offsetX = 0
          if (peep.coinVisible) {
            peep.coinX = 10
            peep.coinY = -30
            setTimeout(() => {
              peep.coinVisible = false
            }, 120)
          }

          setTimeout(() => {
            peep.faceFrame = 1
            if (payoff === 0) peep.eyebrowFrame = 3
            else if (payoff === 2) peep.eyebrowFrame = 4
            else if (payoff === -1) peep.eyebrowFrame = 5
            else if (payoff === 3) peep.eyebrowFrame = 6

            if (payoff === 2 || payoff === 3) {
              // 弹出 3 枚奖励硬币
              peep.rewardCoins.forEach((rc, i) => {
                setTimeout(() => {
                  rc.visible = true
                  rc.x = 155
                  rc.y = -25
                  if (!(payoff === 2 && i === 2)) {
                    soundManager.play('coin_get', 0.25)
                  }
                  setTimeout(() => {
                    rc.x = 0
                    rc.y = -85
                    setTimeout(() => {
                      rc.y = -20
                      setTimeout(() => {
                        rc.visible = false
                      }, 120)
                    }, 120)
                  }, 20)
                }, i * 130)
              })
              setTimeout(resolve, 550)
            } else {
              setTimeout(resolve, 220)
            }
          }, 300)
        }, 420)
      }, 320)
    }, 150)
  })
}

async function playOneRound(yourMove: MoveType | 'TRIP'): Promise<[number, number]> {
  const isTrip = yourMove === 'TRIP'
  const moveA: MoveType = isTrip ? PD_CHEAT : yourMove
  const moveB: MoveType = opponentLogic.play()
  const payoffs = getPayoffs(moveA, moveB)

  opponentLogic.remember(moveB, moveA)

  const highlightTimer = setTimeout(() => {
    highlightPayoffByScore(payoffs[0])
  }, 520)

  await Promise.all([
    animateSinglePeep(playerA, payoffs[0], false, isTrip),
    animateSinglePeep(playerB, payoffs[1], true, false),
  ])

  clearTimeout(highlightTimer)
  dehighlightPayoff()
  return payoffs
}

onUnmounted(() => {
  if (introTimer) clearInterval(introTimer)
})

defineExpose({
  dehighlightPayoff,
  oneoffHighlight1,
  oneoffHighlight2,
  introMachine,
  resetOpponent,
  playOneRound,
})
</script>
