<template>
  <view
    class="absolute select-none"
    :style="{
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
      width: '0px',
      height: '0px',
    }"
  >
    <!-- 向上增加箭头 -->
    <view
      class="absolute cursor-pointer active:opacity-70"
      style="position: absolute; left: -10px; top: -35px; width: 20px; height: 20px"
      @tap="onIncrement"
    >
      <SpriteImage
        src="/static/ui/sandbox_incdec.png"
        :view-width="20"
        :view-height="20"
        :sheet-width="80"
        :sheet-height="20"
        :offset-x="0"
        :offset-y="0"
      />
    </view>

    <!-- 数字显示 -->
    <view
      class="absolute flex items-center justify-center text-center font-bold"
      style="position: absolute; left: -25px; top: -16px; width: 50px; height: 36px; display: flex; align-items: center; justify-content: center; text-align: center; font-weight: 700; font-size: 23px; color: #333333"
    >
      {{ displayValue }}
    </view>

    <!-- 向下减少箭头 -->
    <view
      class="absolute cursor-pointer active:opacity-70"
      style="position: absolute; left: -10px; top: 18px; width: 20px; height: 20px"
      @tap="onDecrement"
    >
      <SpriteImage
        src="/static/ui/sandbox_incdec.png"
        :view-width="20"
        :view-height="20"
        :sheet-width="80"
        :sheet-height="20"
        :offset-x="-40"
        :offset-y="0"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SpriteImage from './SpriteImage.vue'
import { soundManager } from '@/core/sound'

const props = withDefaults(
  defineProps<{
    x: number
    y: number
    min?: number
    max?: number
    modelValue: number
  }>(),
  {
    min: -5,
    max: 5,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void
  (e: 'change', val: number): void
}>()

const displayValue = computed(() => {
  return props.modelValue > 0 ? `+${props.modelValue}` : `${props.modelValue}`
})

function onIncrement() {
  if (props.modelValue < props.max) {
    const next = props.modelValue + 1
    soundManager.play('button2', 0.75)
    emit('update:modelValue', next)
    emit('change', next)
  }
}

function onDecrement() {
  if (props.modelValue > props.min) {
    const next = props.modelValue - 1
    soundManager.play('button1', 0.75)
    emit('update:modelValue', next)
    emit('change', next)
  }
}
</script>
