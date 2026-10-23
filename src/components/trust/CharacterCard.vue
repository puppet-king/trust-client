<template>
  <view
    class="absolute select-none flex flex-row items-start"
    :style="{
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
      width: width + 'px',
      height: '114px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
    }"
  >
    <!-- 角色全身立绘雪碧图 (8 frames x 105px = 840 x 114) -->
    <view
      class="flex-shrink-0"
      style="width: 105px; height: 114px; margin-top: -5px; margin-left: -10px; flex-shrink: 0"
    >
      <SpriteImage
        src="/static/tournament/peep_characters.png"
        :view-width="105"
        :view-height="114"
        :sheet-width="840"
        :sheet-height="114"
        :offset-x="-PEEP_METADATA[character].frame * 105"
        :offset-y="0"
      />
    </view>

    <!-- 右侧角色介绍 -->
    <view
      class="flex-1 pl-1"
      :style="{
        flex: '1',
        paddingLeft: '4px',
        fontSize: '16px',
        lineHeight: '1.35',
        color: PEEP_METADATA[character].color,
      }"
    >
      <rich-text :nodes="t('character_' + character)" />
    </view>
  </view>
</template>

<script setup lang="ts">
import SpriteImage from './SpriteImage.vue'
import { PEEP_METADATA, type StrategyId } from '@/core/pd'
import { t } from '@/locales/zh-CN'

defineProps<{
  x: number
  y: number
  width: number
  character: StrategyId
}>()
</script>
