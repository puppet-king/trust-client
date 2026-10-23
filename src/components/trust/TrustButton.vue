<template>
  <view
    class="absolute select-none transition-transform duration-100"
    :style="{
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
      width: hitboxWidth + 'px',
      height: '55px',
      zIndex: isPressed || showTooltip ? 100 : 20,
      transform: isPressed ? 'scale(0.95)' : 'scale(1)',
      transformOrigin: transformOrigin,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.4s ease-in-out, transform 0.1s ease-out',
    }"
  >
    <!-- 角色说明气泡 Tooltip -->
    <view
      v-if="tooltipText && showTooltip"
      class="absolute z-50 bg-dark text-white rounded-lg px-3 py-2 shadow-lg pointer-events-none"
      style="
        position: absolute;
        z-index: 120;
        bottom: 62px;
        left: 50%;
        transform: translateX(-50%);
        width: 230px;
        padding: 8px 10px;
        border-radius: 8px;
        background-color: #222222;
        color: #ffffff;
        font-size: 14px;
        line-height: 1.35;
        text-align: left;
        pointer-events: none;
      "
    >
      {{ tooltipText }}
    </view>

    <!-- 按钮背景雪碧图 -->
    <view
      class="absolute pointer-events-none"
      :style="{
        position: 'absolute',
        top: '-35px',
        left: bgLeft + 'px',
        width: bgWidth + 'px',
        height: '125px',
        pointerEvents: 'none',
      }"
    >
      <SpriteImage
        :src="bgUrl"
        :view-width="bgWidth"
        :view-height="125"
        :sheet-width="bgWidth"
        :sheet-height="375"
        :offset-x="0"
        :offset-y="bgOffsetY"
      />
    </view>

    <!-- 按钮文本或角色图标+名称 -->
    <view
      class="absolute flex flex-row items-center justify-center pointer-events-none text-center font-bold"
      :style="{
        position: 'absolute',
        left: '5px',
        top: size === 'long' ? '11px' : '13px',
        width: textWidth + 'px',
        height: '30px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: fontSize + 'px',
        color: !active ? '#CCCCCC' : '#000000',
        pointerEvents: 'none',
      }"
    >
      <!-- 如果是角色下注按钮，渲染角色帽子小图标 + 彩色名称 -->
      <template v-if="character">
        <view style="width: 25px; height: 25px; margin-right: 6px; flex-shrink: 0">
          <SpriteImage
            src="/static/ui/sandbox_hats.png"
            :view-width="25"
            :view-height="25"
            :sheet-width="200"
            :sheet-height="25"
            :offset-x="-PEEP_METADATA[character].frame * 25"
            :offset-y="0"
          />
        </view>
        <text :style="{ color: !active ? '#CCCCCC' : PEEP_METADATA[character].color }">
          {{ t('label_' + character) }}
        </text>
      </template>
      <template v-else>
        <rich-text :nodes="displayHtml" />
      </template>
    </view>

    <!-- 触摸热区 -->
    <view
      v-if="active && visible"
      class="absolute cursor-pointer"
      :style="{
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: hitboxWidth + 'px',
        height: '55px',
      }"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @touchcancel="onTouchCancel"
      @longpress="onLongPress"
      @tap="onTap"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SpriteImage from './SpriteImage.vue'
import { PEEP_METADATA, type StrategyId } from '@/core/pd'
import { soundManager, type SoundName } from '@/core/sound'
import { t } from '@/locales/zh-CN'

const props = withDefaults(
  defineProps<{
    x: number
    y: number
    size?: 'normal' | 'short' | 'long'
    textId?: string
    text?: string
    character?: StrategyId
    tooltip?: string
    active?: boolean
    visible?: boolean
    sound?: SoundName
  }>(),
  {
    size: 'normal',
    textId: '',
    text: '',
    character: undefined,
    tooltip: '',
    active: true,
    visible: true,
    sound: undefined,
  },
)

const emit = defineEmits<{
  (e: 'click'): void
}>()

const isPressed = ref(false)
const showTooltip = ref(false)

const bgUrl = computed(() => {
  if (props.size === 'short') return '/static/ui/button_short.png'
  if (props.size === 'long') return '/static/ui/button_long.png'
  return '/static/ui/button.png'
})

const bgWidth = computed(() => {
  if (props.size === 'short') return 150
  if (props.size === 'long') return 400
  return 250
})

const bgLeft = computed(() => {
  if (props.size === 'short') return -20
  return -30
})

const textWidth = computed(() => {
  if (props.size === 'short') return 105
  if (props.size === 'long') return 330
  return 180
})

const hitboxWidth = computed(() => {
  if (props.size === 'short') return 115
  if (props.size === 'long') return 345
  return 195
})

const transformOrigin = computed(() => {
  if (props.size === 'short') return '57.5px 27.5px'
  if (props.size === 'long') return '172.5px 27.5px'
  return '97.5px 27.5px'
})

const bgOffsetY = computed(() => {
  if (!props.active) return -250
  if (isPressed.value) return -125
  return 0
})

const displayHtml = computed(() => {
  if (props.text) return props.text
  if (props.textId) return t(props.textId)
  return ''
})

const fontSize = computed(() => {
  const raw = displayHtml.value.replace(/<[^>]+>/g, '')
  if (props.size === 'short' && raw.length > 4) return 18
  if (raw.length > 14) return 19
  return 21
})

const tooltipText = computed(() => {
  if (!props.tooltip) return ''
  return t(props.tooltip)
})

function onTouchStart() {
  if (!props.active) return
  isPressed.value = true
}

function onTouchEnd() {
  isPressed.value = false
  setTimeout(() => {
    showTooltip.value = false
  }, 1500)
}

function onTouchCancel() {
  isPressed.value = false
  showTooltip.value = false
}

function onLongPress() {
  if (props.tooltip) {
    showTooltip.value = true
  }
}

function onTap() {
  if (!props.active || !props.visible) return
  if (props.sound) {
    soundManager.play(props.sound, 0.8)
  } else {
    soundManager.playRandomButton()
  }
  emit('click')
}
</script>
