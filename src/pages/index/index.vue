<template>
  <StageLayout>
    <!-- ==================== 第 0 章：序言 (intro) ==================== -->
    <template v-if="gameStore.currentChapter === 'intro'">
      <SplashRing :blush="false" />

      <!-- Step 0: 封面标题与开始按钮 -->
      <template v-if="gameStore.slideStep === 0">
        <view
          class="absolute text-center font-bold"
          style="position: absolute; left: 130px; top: 85px; width: 700px; font-size: 82px; line-height: 1.05; text-align: center; font-weight: 700; color: #333333; z-index: 10"
        >
          <rich-text :nodes="t('title')" />
        </view>
        <view
          class="absolute text-center"
          style="position: absolute; left: 220px; top: 335px; width: 520px; font-size: 16px; text-align: center; color: #999999; z-index: 10"
        >
          <rich-text :nodes="t('subtitle')" />
        </view>
        <TrustButton
          :x="382"
          :y="405"
          text-id="loading_done"
          @click="onStartGame"
        />
      </template>

      <!-- Step 1: 一战 1914 圣诞休战引言 -->
      <template v-else>
        <view
          class="absolute text-center animate-fade-in"
          style="position: absolute; left: 130px; top: 18px; width: 700px; height: 435px; font-size: 19px; line-height: 1.48; text-align: center; color: #333333; z-index: 10"
        >
          <rich-text :nodes="t('intro')" />
        </view>
        <TrustButton
          :x="304"
          :y="466"
          size="long"
          text-id="intro_button"
          @click="gameStore.gotoChapter('oneoff', 0, true)"
        />
      </template>
    </template>

    <!-- ==================== 第 1 章：单次博弈 (oneoff) ==================== -->
    <template v-else-if="gameStore.currentChapter === 'oneoff'">
      <IteratedMachine
        ref="oneoffMachineRef"
        :x="130"
        :y="133"
        opponent-strategy="tft"
      />

      <!-- 顶部解说文字 -->
      <view
        class="absolute text-center animate-fade-in"
        style="position: absolute; left: 130px; top: 10px; width: 700px; height: 110px; font-size: 19px; line-height: 1.42; text-align: center; color: #333333; z-index: 10"
      >
        <rich-text :nodes="oneoffTopHtml" />
      </view>

      <!-- 玩家与对手指向标签 -->
      <view
        class="absolute text-center font-bold"
        style="position: absolute; left: 202px; top: 198px; width: 68px; font-size: 16px; text-align: center; font-weight: 700; color: #999999; line-height: 1.2; z-index: 10"
      >
        <rich-text :nodes="t('label_you')" />
      </view>
      <view
        class="absolute text-center font-bold"
        style="position: absolute; left: 690px; top: 188px; width: 85px; font-size: 16px; text-align: center; font-weight: 700; color: #999999; line-height: 1.2; z-index: 10"
      >
        <rich-text :nodes="t('label_them')" />
      </view>

      <!-- 底部引导文字 -->
      <view
        class="absolute text-center animate-fade-in"
        style="position: absolute; left: 130px; top: 392px; width: 700px; height: 90px; font-size: 18.5px; line-height: 1.42; text-align: center; color: #333333; z-index: 10"
      >
        <rich-text :nodes="oneoffBtmHtml" />
      </view>

      <!-- Step 0 / Step 1: 欺骗 或 合作 按钮 -->
      <template v-if="gameStore.slideStep < 2">
        <TrustButton
          :x="275"
          :y="463"
          text-id="label_cheat"
          @click="onOneoffChoose('CHEAT')"
        />
        <TrustButton
          :x="495"
          :y="460"
          text-id="label_cooperate"
          @click="onOneoffChoose('COOPERATE')"
        />
      </template>

      <!-- Step 2: 进入重复博弈 -->
      <template v-else>
        <TrustButton
          :x="304"
          :y="480"
          size="long"
          text-id="oneoff_button_next"
          @click="onEnterIterated"
        />
      </template>
    </template>

    <!-- ==================== 第 2 章：重复博弈 (iterated) ==================== -->
    <template v-else-if="gameStore.currentChapter === 'iterated'">
      <!-- Step 0 & Step 1: 投币机对决 -->
      <template v-if="gameStore.slideStep < 2">
        <!-- 顶部回合与累计总分统计 (Step 1) -->
        <view
          v-if="gameStore.slideStep === 1"
          class="absolute text-center font-bold"
          style="position: absolute; left: 330px; top: 32px; width: 300px; font-size: 16px; line-height: 1.35; text-align: center; font-weight: 700; color: #333333; z-index: 10"
        >
          <rich-text :nodes="iteratedInfoHtml" />
        </view>

        <!-- Step 0 顶部与底部开场白 -->
        <template v-if="gameStore.slideStep === 0">
          <view
            class="absolute text-center animate-fade-in"
            style="position: absolute; left: 130px; top: 10px; width: 700px; height: 110px; font-size: 18.5px; line-height: 1.42; text-align: center; color: #333333; z-index: 10"
          >
            <rich-text :nodes="t('iterated_intro_top')" />
          </view>
          <view
            class="absolute text-center font-bold"
            style="position: absolute; left: 202px; top: 198px; width: 68px; font-size: 16px; text-align: center; font-weight: 700; color: #999999; line-height: 1.2; z-index: 10"
          >
            <rich-text :nodes="t('label_you')" />
          </view>
          <view
            class="absolute text-center font-bold"
            style="position: absolute; left: 690px; top: 188px; width: 85px; font-size: 16px; text-align: center; font-weight: 700; color: #999999; line-height: 1.2; z-index: 10"
          >
            <rich-text :nodes="t('label_them')" />
          </view>
          <view
            class="absolute text-center animate-fade-in"
            style="position: absolute; left: 130px; top: 408px; width: 700px; height: 50px; font-size: 19px; text-align: center; color: #333333; z-index: 10"
          >
            <rich-text :nodes="t('iterated_intro_btm')" />
          </view>
        </template>

        <IteratedMachine
          ref="iteratedMachineRef"
          :x="130"
          :y="gameStore.slideStep === 0 ? 133 : 183"
          :opponent-strategy="currentRoundOpponent"
          :show-scoreboard="gameStore.slideStep === 1"
          :score-a="roundScoreA"
          :score-b="roundScoreB"
        />

        <!-- 欺骗 / 合作 按钮 -->
        <TrustButton
          :x="275"
          :y="453"
          text-id="label_cheat"
          :active="iteratedButtonsActive"
          @click="onIteratedMove('CHEAT')"
        />
        <TrustButton
          :x="495"
          :y="450"
          text-id="label_cooperate"
          :active="iteratedButtonsActive"
          @click="onIteratedMove('COOPERATE')"
        />
      </template>

      <!-- Step 2: 总分揭晓与五大角色图鉴 -->
      <template v-else>
        <view
          class="absolute"
          style="position: absolute; left: 24px; top: 28px; width: 250px; font-size: 20px; color: #333333; z-index: 10"
        >
          {{ t('iterated_score_start') }}
        </view>
        <view
          class="absolute text-right font-bold"
          style="position: absolute; left: 95px; top: 46px; width: 170px; font-size: 108px; line-height: 1.1; text-align: right; font-weight: 700; color: #333333; z-index: 10"
        >
          {{ gameStore.iteratedTotalScore }}
        </view>
        <view
          class="absolute"
          style="position: absolute; left: 290px; top: 52px; width: 640px; font-size: 19px; line-height: 1.45; color: #333333; z-index: 10"
        >
          <rich-text :nodes="iteratedFinalCommentHtml" />
        </view>

        <!-- 5 大角色介绍卡 -->
        <CharacterCard :x="35" :y="204" :width="445" character="tft" />
        <CharacterCard :x="495" :y="204" :width="215" character="all_d" />
        <CharacterCard :x="725" :y="204" :width="215" character="all_c" />
        <CharacterCard :x="35" :y="332" :width="385" character="grudge" />
        <CharacterCard :x="435" :y="332" :width="505" character="prober" />

        <!-- 底部预告与跳转按钮 -->
        <view
          class="absolute"
          style="position: absolute; left: 104px; top: 478px; width: 430px; font-size: 20px; color: #333333; z-index: 10"
        >
          {{ t('characters_teaser') }}
        </view>
        <TrustButton
          :x="544"
          :y="471"
          size="long"
          text-id="characters_button"
          @click="gameStore.gotoChapter('tournament', 0, true)"
        />
      </template>
    </template>
  </StageLayout>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import StageLayout from '@/components/trust/StageLayout.vue'
import SplashRing from '@/components/trust/SplashRing.vue'
import IteratedMachine from '@/components/trust/IteratedMachine.vue'
import TrustButton from '@/components/trust/TrustButton.vue'
import CharacterCard from '@/components/trust/CharacterCard.vue'
import type { MoveType, StrategyId } from '@/core/pd'
import { soundManager } from '@/core/sound'
import {
  getShareAppMessageData,
  getShareTimelineData,
  t,
} from '@/locales/zh-CN'
import { type ChapterId, useGameStore } from '@/stores/game'

defineOptions({
  name: 'TrustIndexPage',
})

const gameStore = useGameStore()

const oneoffMachineRef = ref<InstanceType<typeof IteratedMachine> | null>(null)
const iteratedMachineRef = ref<InstanceType<typeof IteratedMachine> | null>(null)

// ==================== 第 1 章：单次博弈状态 ====================
const oneoffTopHtml = computed(() => {
  if (gameStore.slideStep === 0) return t('oneoff_0_top')
  if (gameStore.slideStep === 1) {
    const prefix =
      gameStore.oneoffAnswer === 'COOPERATE'
        ? t('oneoff_1_cooperated')
        : t('oneoff_1_cheated')
    return `${prefix}<br>${t('oneoff_1_top')}`
  }
  const prefix =
    gameStore.oneoffAnswer === 'COOPERATE'
      ? t('oneoff_2_cooperated')
      : t('oneoff_2_cheated')
  return `${prefix}<br>${t('oneoff_2_top')}`
})

const oneoffBtmHtml = computed(() => {
  if (gameStore.slideStep === 0) return t('oneoff_0_btm')
  if (gameStore.slideStep === 1) return t('oneoff_1_btm')
  return t('oneoff_2_btm')
})

function onStartGame() {
  gameStore.hasStartedGame = true
  soundManager.startBgm(0.65)
  gameStore.slideStep = 1
}

function onOneoffChoose(ans: MoveType) {
  gameStore.oneoffAnswer = ans
  if (gameStore.slideStep === 0) {
    gameStore.slideStep = 1
    nextTick(() => {
      oneoffMachineRef.value?.oneoffHighlight1(ans)
    })
  } else if (gameStore.slideStep === 1) {
    gameStore.slideStep = 2
    nextTick(() => {
      oneoffMachineRef.value?.oneoffHighlight2(ans)
    })
  }
}

function onEnterIterated() {
  oneoffMachineRef.value?.dehighlightPayoff()
  gameStore.currentChapter = 'iterated'
  gameStore.slideStep = 0
  resetIteratedSession()
  nextTick(() => {
    iteratedMachineRef.value?.introMachine()
  })
}

// ==================== 第 2 章：重复博弈状态 ====================
const ITERATED_ROUNDS: { id: StrategyId; num: number }[] = [
  { id: 'tft', num: 5 },
  { id: 'all_d', num: 4 },
  { id: 'all_c', num: 4 },
  { id: 'grudge', num: 5 },
  { id: 'prober', num: 7 },
]

const roundIndex = ref(0)
const roundNum = ref(0)
const roundScoreA = ref(0)
const roundScoreB = ref(0)
const iteratedButtonsActive = ref(true)

const currentRoundOpponent = computed<StrategyId>(() => {
  return ITERATED_ROUNDS[roundIndex.value]?.id ?? 'tft'
})

const iteratedInfoHtml = computed(() => {
  const line1 = t('iterated_info_1', {
    X: roundIndex.value + 1,
    Y: ITERATED_ROUNDS.length,
  })
  const line2 = `${t('iterated_info_2')}${gameStore.iteratedTotalScore}`
  return `${line1}<br>${line2}`
})

const iteratedFinalCommentHtml = computed(() => {
  const s = gameStore.iteratedTotalScore
  let key = 'x'
  if (s === 49) key = '5'
  else if (s >= 34) key = '4'
  else if (s >= 22) key = '3'
  else if (s >= 8) key = '2'
  else if (s === 7) key = '1'
  return `${t('iterated_score_' + key)} ${t('iterated_score_end')}<br><br>${t('who_were')}`
})

function resetIteratedSession() {
  roundIndex.value = 0
  roundNum.value = 0
  roundScoreA.value = 0
  roundScoreB.value = 0
  gameStore.iteratedTotalScore = 0
  iteratedButtonsActive.value = true
}

async function onIteratedMove(move: MoveType) {
  if (!iteratedButtonsActive.value) return
  if (gameStore.slideStep === 0) {
    gameStore.slideStep = 1
  }
  iteratedButtonsActive.value = false
  const machine = iteratedMachineRef.value
  if (!machine) {
    iteratedButtonsActive.value = true
    return
  }

  const [pA, pB] = await machine.playOneRound(move)
  roundScoreA.value += pA
  roundScoreB.value += pB
  gameStore.iteratedTotalScore += pA
  roundNum.value++

  const currentCfg = ITERATED_ROUNDS[roundIndex.value]
  if (roundNum.value >= currentCfg.num) {
    roundNum.value = 0
    if (roundIndex.value + 1 >= ITERATED_ROUNDS.length) {
      // 全部 5 位对手完成，进入结算页
      gameStore.runScratchTransition(() => {
        gameStore.slideStep = 2
      })
    } else {
      // 局部刮擦切换下一位对手
      gameStore.runLocalScratch(
        700,
        260,
        150,
        162,
        () => {
          roundIndex.value++
          roundScoreA.value = 0
          roundScoreB.value = 0
          iteratedMachineRef.value?.resetOpponent(currentRoundOpponent.value)
        },
        () => {
          iteratedButtonsActive.value = true
        },
      )
    }
  } else {
    iteratedButtonsActive.value = true
  }
}

watch(
  () => gameStore.currentChapter,
  (ch) => {
    if (ch === 'iterated' && gameStore.slideStep === 0) {
      resetIteratedSession()
      nextTick(() => {
        iteratedMachineRef.value?.introMachine()
      })
    }
  },
)

onLoad((query?: Record<string, string>) => {
  if (query?.chapter) {
    const ch = query.chapter as ChapterId
    if (ch === 'intro' || ch === 'oneoff' || ch === 'iterated') {
      gameStore.currentChapter = ch
      gameStore.slideStep = Number(query.step || 0)
      if (ch === 'iterated' && gameStore.slideStep === 0) {
        resetIteratedSession()
      }
    }
  }
})

onShareAppMessage(() => {
  return getShareAppMessageData(gameStore.currentChapter, gameStore.iteratedTotalScore)
})

onShareTimeline(() => {
  return getShareTimelineData(gameStore.iteratedTotalScore)
})
</script>
