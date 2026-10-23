<template>
  <StageLayout :dark-bg="gameStore.currentChapter === 'credits'">
    <!-- ==================== 第 7 章：沙盒模式 (sandbox) ==================== -->
    <template v-if="gameStore.currentChapter === 'sandbox'">
      <TournamentRing ref="sandboxTournamentRef" :x="-20" :y="-20" @auto-play-change="sandboxAutoPlaying = $event" />

      <SandboxPanel
        :is-auto-playing="sandboxAutoPlaying"
        @toggle-auto-play="sandboxTournamentRef?.toggleAutoPlay()"
        @step="sandboxTournamentRef?.stepManually()"
        @reset="sandboxTournamentRef?.reset()"
      />

      <!-- 底部跳转提示与按钮 -->
      <view
        class="absolute text-right"
        style="
          position: absolute;
          left: 55px;
          top: 482px;
          width: 535px;
          font-size: 16.5px;
          line-height: 1.35;
          color: #333333;
        "
      >
        <rich-text :nodes="t('sandbox_end')" />
      </view>
      <TrustButton :x="605" :y="482" size="long" text-id="sandbox_end_btn" @click="onLeaveSandbox" />
    </template>

    <!-- ==================== 第 8 章：总结与启示 (conclusion) ==================== -->
    <template v-else-if="gameStore.currentChapter === 'conclusion'">
      <!-- Step 0: 信任演化的三大基石 -->
      <template v-if="gameStore.slideStep === 0">
        <view
          class="absolute font-bold"
          style="position: absolute; left: 10px; top: 8px; width: 880px; font-size: 21px; color: #333333"
        >
          {{ t('conclusion_0') }}
        </view>

        <image
          :src="'/pages-sandbox/static/summary.png'"
          style="position: absolute; left: 10px; top: 60px; width: 140px; height: 350px"
          mode="scaleToFill"
        />

        <!-- 1. 重复的互动 -->
        <view
          class="absolute font-bold"
          style="position: absolute; left: 176px; top: 55px; width: 760px; font-size: 28px; color: #4089dd"
        >
          {{ t('conclusion_1_a') }}
        </view>
        <view
          class="absolute"
          style="
            position: absolute;
            left: 176px;
            top: 98px;
            width: 760px;
            font-size: 19px;
            line-height: 1.42;
            color: #333333;
          "
        >
          <rich-text :nodes="t('conclusion_1_a2')" />
        </view>

        <!-- 2. 双赢的可能 -->
        <view
          class="absolute font-bold"
          style="position: absolute; left: 176px; top: 180px; width: 760px; font-size: 28px; color: #d4af00"
        >
          {{ t('conclusion_2_a') }}
        </view>
        <view
          class="absolute"
          style="
            position: absolute;
            left: 176px;
            top: 223px;
            width: 760px;
            font-size: 19px;
            line-height: 1.42;
            color: #333333;
          "
        >
          <rich-text :nodes="t('conclusion_2_a2')" />
        </view>

        <!-- 3. 低水平的误解 -->
        <view
          class="absolute font-bold"
          style="position: absolute; left: 176px; top: 304px; width: 760px; font-size: 28px; color: #dd4040"
        >
          {{ t('conclusion_3_a') }}
        </view>
        <view
          class="absolute"
          style="
            position: absolute;
            left: 176px;
            top: 347px;
            width: 760px;
            font-size: 19px;
            line-height: 1.42;
            color: #333333;
          "
        >
          <rich-text :nodes="t('conclusion_3_a2')" />
        </view>

        <view
          class="absolute text-right"
          style="
            position: absolute;
            left: 60px;
            top: 438px;
            width: 535px;
            font-size: 18px;
            line-height: 1.38;
            color: #333333;
          "
        >
          <rich-text :nodes="t('conclusion_4')" />
        </view>

        <TrustButton :x="615" :y="478" size="long" text-id="conclusion_btn" @click="onConclusionStep1" />
      </template>

      <!-- Step 1: 博弈论最核心的一课 -->
      <template v-else-if="gameStore.slideStep === 1">
        <SplashRing :blush="true" />

        <view
          class="absolute text-center animate-fade-in"
          style="
            position: absolute;
            left: 150px;
            top: 16px;
            width: 660px;
            font-size: 19px;
            line-height: 1.48;
            color: #333333;
          "
        >
          <rich-text :nodes="t('outro_1')" />
        </view>

        <TrustButton :x="385" :y="466" text-id="outro_1_btn" @click="gameStore.slideStep = 2" />
      </template>

      <!-- Step 2: 圣诞休战历史画作与尾声 -->
      <template v-else>
        <SplashRing :blush="true" />

        <view
          class="absolute text-center font-bold animate-fade-in"
          style="position: absolute; left: 160px; top: 28px; width: 640px; font-size: 24px; color: #333333"
        >
          {{ t('outro_2') }}
        </view>

        <image
          :src="'/pages-sandbox/static/truce.jpg'"
          style="position: absolute; left: 230px; top: 82px; width: 500px; height: 305px; border-radius: 4px"
          mode="aspectFill"
        />

        <view
          class="absolute text-center animate-fade-in"
          style="position: absolute; left: 180px; top: 400px; width: 600px; font-size: 14px; color: #888888"
        >
          <rich-text :nodes="t('outro_2_credits')" />
        </view>

        <TrustButton
          :x="427"
          :y="462"
          size="short"
          text-id="outro_2_btn"
          @click="gameStore.gotoChapter('credits', 0, true)"
        />
      </template>
    </template>

    <!-- ==================== 第 9 章：致谢名单 (credits) ==================== -->
    <template v-else-if="gameStore.currentChapter === 'credits'">
      <view class="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
        <view class="text-neutral-400" style="font-size: 17px; line-height: 1.6"> 原著设计与开发 </view>
        <view class="text-white font-bold mt-1" style="font-size: 36px; letter-spacing: 2px"> NICKY CASE </view>
        <view class="text-accent mt-1" style="font-size: 15px">
          《The Evolution of Trust》(2017) · CC0 公共领域开源作品
        </view>

        <view class="h-4" />

        <view class="text-neutral-400" style="font-size: 17px; line-height: 1.6">
          理论基础源自罗伯特·阿克塞尔罗德 (Robert Axelrod) 1984 年经典著作
        </view>
        <view class="text-white font-bold mt-1" style="font-size: 30px">
          《合作的进化》(THE EVOLUTION OF COOPERATION)
        </view>

        <view class="h-4" />
        <view class="text-primary font-bold mt-1" style="font-size: 24px"> 《信任的进化》互动科普小程序版 </view>
        <view class="text-neutral-400 mt-1" style="font-size: 14px">
          愿我们在每一次重复博弈中，都能选择有原则、有宽容的善意 ♥
        </view>

        <TrustButton :x="650" :y="455" text="重新体验 ↻" @click="gameStore.gotoChapter('intro', 0, true)" />
      </view>
    </template>
  </StageLayout>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StageLayout from '@/components/trust/StageLayout.vue'
import TournamentRing from '@/components/trust/TournamentRing.vue'
import SandboxPanel from '@/components/trust/SandboxPanel.vue'
import SplashRing from '@/components/trust/SplashRing.vue'
import TrustButton from '@/components/trust/TrustButton.vue'
import { t } from '@/locales/zh-CN'
import { type ChapterId, useGameStore } from '@/stores/game'

defineOptions({
  name: 'TrustSandboxPage',
})

const gameStore = useGameStore()
const sandboxTournamentRef = ref<InstanceType<typeof TournamentRing> | null>(null)
const sandboxAutoPlaying = ref(false)

function initSandboxChapter() {
  gameStore.resetTournamentGlobals()
  gameStore.noise = 0.05
  nextTick(() => {
    sandboxTournamentRef.value?.reset()
  })
}

function onLeaveSandbox() {
  sandboxTournamentRef.value?.stopAutoPlay()
  gameStore.gotoChapter('conclusion', 0, true)
}

function onConclusionStep1() {
  gameStore.runScratchTransition(() => {
    gameStore.slideStep = 1
  })
}

watch(
  () => gameStore.currentChapter,
  (ch) => {
    if (ch === 'sandbox') {
      initSandboxChapter()
    }
  },
)

onLoad((query?: Record<string, string>) => {
  const ch = (query?.chapter as ChapterId) || gameStore.currentChapter
  if (ch === 'sandbox' || ch === 'conclusion' || ch === 'credits') {
    gameStore.currentChapter = ch
    gameStore.slideStep = Number(query?.step || 0)
  } else {
    gameStore.currentChapter = 'sandbox'
    gameStore.slideStep = 0
  }
  if (gameStore.currentChapter === 'sandbox') {
    initSandboxChapter()
  }
})
</script>
