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
      style="flex: 1; min-height: 0; width: 100%; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center"
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

    <!-- 底部导航与音效控制栏（相对定位 + 透明底色，左右各自独立小区域，中间完全留空） -->
    <view
      class="w-full flex flex-row items-center justify-between px-4 relative z-40"
      style="position: relative; width: 100%; height: 38px; background-color: transparent; display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 0 18px; box-sizing: border-box; z-index: 40; mix-blend-mode: difference"
    >
      <!-- 最左侧小区域：声音开关 -->
      <view
        class="flex flex-row items-center cursor-pointer active:opacity-75"
        style="display: flex; flex-direction: row; align-items: center; padding: 3px 10px; border-radius: 999px; background-color: rgba(255,255,255,0.06)"
        @tap="onToggleSound"
      >
        <SpriteImage
          src="/static/ui/sound.png"
          :view-width="24"
          :view-height="24"
          :sheet-width="48"
          :sheet-height="24"
          :offset-x="soundManager.isSoundOn.value ? 0 : -24"
          :offset-y="0"
        />
        <text
          class="ml-1.5 font-bold"
          style="margin-left: 5px; font-size: 14px; font-weight: 700"
          :style="{ color: soundManager.isSoundOn.value ? '#FFFFFF' : '#666666' }"
        >
          {{ soundManager.isSoundOn.value ? t('meta_on') : t('meta_off') }}
        </text>
      </view>

      <!-- 最右侧小区域：选择关卡 + 展示当前关卡文案 + 分享 -->
      <view
        class="flex flex-row items-center justify-end"
        style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end; padding: 3px 10px; border-radius: 999px; background-color: rgba(255,255,255,0.06)"
      >
        <view
          class="flex flex-row items-center"
          style="display: flex; flex-direction: row; align-items: center; margin-right: 8px"
        >
          <view
            v-for="ch in CHAPTERS"
            :key="ch.id"
            class="relative flex items-center justify-center"
            style="position: relative; display: flex; align-items: center; justify-content: center; padding: 4px 0"
            @tap="onSelectChapter(ch.id)"
          >
            <!-- 章节气泡提示（透明底色，仅点击切换时短暂提示，不遮挡舞台） -->
            <view
              v-if="hoveredChapter === ch.id"
              class="absolute px-2 py-0.5 whitespace-nowrap pointer-events-none"
              :style="{
                position: 'absolute',
                top: '-22px',
                padding: '2px 6px',
                backgroundColor: 'transparent',
                color: darkBg ? 'rgba(255,255,255,0.75)' : '#777777',
                whiteSpace: 'nowrap',
                fontSize: '11px',
                fontWeight: 600,
                pointerEvents: 'none',
              }"
            >
              {{ t('chapter_' + ch.id) }}
            </view>
            <view
              class="rounded-full transition-all"
              style="width: 11px; height: 11px; border-radius: 9999px; border: 1.5px solid #FFFFFF; margin: 0 3px; box-sizing: border-box"
              :style="{
                backgroundColor:
                  gameStore.currentChapter === ch.id ? '#FFFFFF' : 'transparent',
              }"
            />
          </view>
        </view>

        <text style="font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.9); margin-right: 8px; white-space: nowrap">
          {{ t('chapter_' + gameStore.currentChapter) }}
        </text>
        <button
          open-type="share"
          style="margin: 0; padding: 1px 8px; line-height: 18px; font-size: 11px; font-weight: 600; color: #FFFFFF; background-color: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.45); border-radius: 999px"
          @tap="soundManager.playRandomButton()"
        >
          {{ t('label_share_short') }}
        </button>
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

let hoverTimer: ReturnType<typeof setTimeout> | null = null

function onSelectChapter(id: ChapterId) {
  hoveredChapter.value = id
  if (hoverTimer) clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => {
    hoveredChapter.value = null
  }, 1500)
  soundManager.playRandomButton()
  gameStore.gotoChapter(id, 0, true)
}

onMounted(() => {
  updateScale()
  uni.onWindowResize?.(updateScale)
  // #ifdef MP-WEIXIN
  try {
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })
  } catch {
    // Ignore if unsupported in simulator
  }
  // #endif
})

onUnmounted(() => {
  uni.offWindowResize?.(updateScale)
})
</script>
