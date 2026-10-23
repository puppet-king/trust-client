<template>
  <view
    class="absolute select-none"
    :style="{
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
      width: width + 'px',
      height: '40px',
    }"
    @touchstart.stop.prevent="onTouchStart"
    @touchmove.stop.prevent="onTouchMove"
    @touchend.stop.prevent="onTouchEnd"
  >
    <!-- 滑轨背景 -->
    <view
      class="absolute"
      style="position: absolute; top: 0px; left: 0px; pointer-events: none"
    >
      <SpriteImage
        src="/static/ui/slider_bg.png"
        :view-width="width"
        :view-height="30"
        :sheet-width="450"
        :sheet-height="30"
        :offset-x="0"
        :offset-y="0"
      />
    </view>
    <!-- 滑块旋钮 -->
    <image
      src="/static/ui/slider_knob.png"
      mode="scaleToFill"
      :style="{
        position: 'absolute',
        top: '0px',
        left: knobLeft + 'px',
        width: '30px',
        height: '30px',
        pointerEvents: 'none',
      }"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import SpriteImage from './SpriteImage.vue'

const props = withDefaults(
  defineProps<{
    x: number
    y: number
    width: number
    min: number
    max: number
    step: number
    modelValue: number
  }>(),
  {},
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'select'): void
  (e: 'change', value: number): void
}>()

const stageScale = inject<Ref<number>>('stageScale', ref(0.7))

const startTouchX = ref(0)
const startParam = ref(0)

const currentParam = computed(() => {
  if (props.max === props.min) return 0
  return Math.max(0, Math.min(1, (props.modelValue - props.min) / (props.max - props.min)))
})

const knobLeft = computed(() => {
  return currentParam.value * (props.width - 30)
})

function paramToValue(param: number): number {
  const clamped = Math.max(0, Math.min(1, param))
  const raw = props.min + (props.max - props.min) * clamped
  const stepped = Math.round(raw / props.step) * props.step
  return Number(stepped.toFixed(4))
}

function onTouchStart(e: any) {
  emit('select')
  const touch = e.touches?.[0] || e.changedTouches?.[0]
  if (!touch) return
  startTouchX.value = touch.clientX ?? touch.pageX ?? 0
  startParam.value = currentParam.value
}

function onTouchMove(e: any) {
  const touch = e.touches?.[0] || e.changedTouches?.[0]
  if (!touch) return
  const clientX = touch.clientX ?? touch.pageX ?? 0
  const scale = stageScale.value || 0.7
  const deltaStageX = (clientX - startTouchX.value) / scale
  const trackLen = Math.max(1, props.width - 30)
  const nextParam = startParam.value + deltaStageX / trackLen
  const nextValue = paramToValue(nextParam)

  if (nextValue !== props.modelValue) {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  }
}

function onTouchEnd() {
  // Touch end
}
</script>
