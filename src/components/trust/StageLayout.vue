<template>
  <view
    class="w-screen h-screen relative overflow-hidden select-none flex flex-col"
    :style="{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: darkBg ? '#222222' : '#FFFFFF',
    }"
  >
    <!-- 主舞台缩放视口 -->
    <view
      class="flex-1 w-full relative overflow-hidden flex items-center justify-center"
      style="flex: 1; width: 100%; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center"
    >
      <!-- 960 x 540 逻辑舞台 -->
      <view
        class="relative trust-stage-text"
        :style="{
          position: 'relative',
          width: '960px',
          height: '540px',
          transform: `scale(${scaleRatio})`,
          transformOrigin: 'center center',
        }"
      >
        <slot />

        <!-- 局部手绘刮擦动画层 -->
        <view
          v-if="gameStore.localScratch.visible"
          class="absolute z-50 pointer-events-none"
          :style="{
            position: 'absolute',
            left: gameStore.localScratch.x + 'px',
            top: gameStore.localScratch.y + 'px',
            width: gameStore.localScratch.width + 'px',
            height: gameStore.localScratch.height + 'px',
            zIndex: 200,
          }"
        >
          <SpriteImage
            src="/static/ui/scratch.png"
            :view-width="gameStore.localScratch.width"
            :view-height="gameStore.localScratch.height"
            :sheet-width="gameStore.localScratch.width * 2"
            :sheet-height="gameStore.localScratch.height * 20"
            :offset-x="gameStore.localScratch.scratchIn ? 0 : -gameStore.localScratch.width"
            :offset-y="-gameStore.localScratch.frame * gameStore.localScratch.height"
          />
        </view>

        <!-- 全屏手绘刮擦转场层 (960 x 540) -->
        <view
          v-if="gameStore.isScratching"
          class="absolute inset-0 z-50 pointer-events-none"
          style="position: absolute; left: 0px; top: 0px; width: 960px; height: 540px; z-index: 250"
        >
          <SpriteImage
            src="/static/ui/scratch.png"
            :view-width="960"
            :view-height="540"
            :sheet-width="1920"
            :sheet-height="10800"
            :offset-x="gameStore.scratchInPhase ? 0 : -960"
            :offset-y="-gameStore.scratchFrame * 540"
          />
        </view>
      </view>
    </view>

    <!-- 底部导航与音效控制栏 -->
    <view
      class="w-full bg-dark flex flex-row items-center justify-between px-4 relative z-40"
      style="width: 100%; height: 46px; background-color: #222222; display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 0 16px; box-sizing: border-box; position: relative; z-index: 40"
    >
      <!-- 左侧：音效开关 -->
      <view
        class="flex flex-row items-center cursor-pointer active:opacity-75"
        style="display: flex; flex-direction: row; align-items: center"
        @tap="onToggleSound"
      >
        <SpriteImage
          src="/static/ui/sound.png"
          :view-width="32"
          :view-height="32"
          :sheet-width="64"
          :sheet-height="32"
          :offset-x="soundManager.isSoundOn.value ? 0 : -32"
          :offset-y="0"
        />
        <text
          class="ml-1.5 font-bold"
          style="margin-left: 6px; font-size: 18px; font-weight: 700"
          :style="{ color: soundManager.isSoundOn.value ? '#FFFFFF' : '#666666' }"
        >
          {{ soundManager.isSoundOn.value ? t('meta_on') : t('meta_off') }}
        </text>
      </view>

      <!-- 中间：10 个章节快速导航圆点 -->
      <view
        class="flex flex-row items-center justify-center"
        style="display: flex; flex-direction: row; align-items: center; justify-content: center"
      >
        <view
          v-for="ch in CHAPTERS"
          :key="ch.id"
          class="relative flex items-center justify-center"
          style="position: relative; display: flex; align-items: center; justify-content: center"
          @tap="onSelectChapter(ch.id)"
        >
          <!-- 章节气泡提示 -->
          <view
            v-if="hoveredChapter === ch.id || gameStore.currentChapter === ch.id"
            class="absolute px-2 py-0.5 rounded text-white whitespace-nowrap pointer-events-none"
            style="position: absolute; top: -26px; padding: 2px 6px; border-radius: 4px; background-color: rgba(0,0,0,0.85); color: #FFFFFF; white-space: nowrap; font-size: 11px; pointer-events: none"
          >
            {{ t('chapter_' + ch.id) }}
          </view>
          <view
            class="rounded-full transition-all"
            style="width: 20px; height: 20px; border-radius: 9999px; border: 1.5px solid #FFFFFF; margin: 0 5px; box-sizing: border-box"
            :style="{
              backgroundColor:
                gameStore.currentChapter === ch.id ? '#FFFFFF' : 'transparent',
            }"
          />
        </view>
      </view>

      <!-- 右侧：当前章节名展示 -->
      <view
        class="flex items-center justify-end"
        style="min-width: 110px; display: flex; align-items: center; justify-content: flex-end"
      >
        <text style="font-size: 13px; color: rgba(255,255,255,0.75)">
          {{ t('chapter_' + gameStore.currentChapter) }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide } from 'vue'
import SpriteImage from './SpriteImage.vue'
import { CHAPTERS, type ChapterId, useGameStore } from '@/stores/game'
import { soundManager } from '@/core/sound'
import { t } from '@/locales/zh-CN'

defineProps({
  darkBg: {
    type: Boolean,
    default: false,
  },
})

const gameStore = useGameStore()
const scaleRatio = ref<number>(0.7)
const hoveredChapter = ref<ChapterId | null>(null)

provide('stageScale', scaleRatio)

function updateScale() {
  try {
    const info = uni.getWindowInfo()
    const w = info.windowWidth || 667
    const h = (info.windowHeight || 375) - 46
    const scaleX = w / 960
    const scaleY = h / 540
    scaleRatio.value = Math.max(0.3, Math.min(scaleX, scaleY) * 0.98)
  } catch {
    scaleRatio.value = 0.7
  }
}

function onToggleSound() {
  soundManager.toggleSound()
}

function onSelectChapter(id: ChapterId) {
  hoveredChapter.value = id
  soundManager.playRandomButton()
  gameStore.gotoChapter(id, 0, true)
}

onMounted(() => {
  updateScale()
  uni.onWindowResize?.(updateScale)
})

onUnmounted(() => {
  uni.offWindowResize?.(updateScale)
})
</script>
