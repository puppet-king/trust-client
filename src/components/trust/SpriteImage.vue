<template>
  <view
    :style="{
      position: 'relative',
      width: viewWidth + 'px',
      height: viewHeight + 'px',
      overflow: 'hidden',
      pointerEvents: 'none',
    }"
  >
    <image
      :src="src"
      mode="scaleToFill"
      :style="{
        position: 'absolute',
        left: offsetX + 'px',
        top: offsetY + 'px',
        width: sheetWidth + 'px',
        height: sheetHeight + 'px',
        maxWidth: 'none',
        display: 'block',
      }"
    />
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string
    viewWidth: number
    viewHeight: number
    sheetWidth: number
    sheetHeight: number
    offsetX?: number
    offsetY?: number
  }>(),
  {
    offsetX: 0,
    offsetY: 0,
  },
)
</script>
