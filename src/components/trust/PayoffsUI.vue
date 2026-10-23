<template>
  <view
    class="absolute select-none"
    :style="{
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
      width: '300px',
      height: '300px',
      transform: scale ? `scale(${scale})` : undefined,
      transformOrigin: 'top left',
    }"
  >
    <!-- 收益矩阵底图 -->
    <image
      src="/static/ui/payoffs_ui.png"
      style="width: 300px; height: 300px; display: block"
      mode="scaleToFill"
    />

    <!-- 四个旋转标签 -->
    <view
      class="absolute text-center font-bold"
      style="position: absolute; left: 148px; top: 17px; transform: rotate(45deg); color: #bbbbbb; font-size: 16px; font-weight: 700"
    >
      {{ t('label_cooperate') }}
    </view>
    <view
      class="absolute text-center font-bold"
      style="position: absolute; left: 52px; top: 17px; transform: rotate(-45deg); color: #bbbbbb; font-size: 16px; font-weight: 700"
    >
      {{ t('label_cooperate') }}
    </view>
    <view
      class="absolute text-center font-bold"
      style="position: absolute; left: 245px; top: 90px; transform: rotate(45deg); color: #bbbbbb; font-size: 16px; font-weight: 700"
    >
      {{ t('label_cheat') }}
    </view>
    <view
      class="absolute text-center font-bold"
      style="position: absolute; left: 6px; top: 90px; transform: rotate(-45deg); color: #bbbbbb; font-size: 16px; font-weight: 700"
    >
      {{ t('label_cheat') }}
    </view>

    <!-- 对称的 8 个增减数字控件 (R, T, S, P) -->
    <!-- R: 双方合作 -->
    <IncDecNumber :x="127" :y="80" :model-value="payoffs.R" @change="updatePayoff('R', $event)" />
    <IncDecNumber :x="169" :y="80" :model-value="payoffs.R" @change="updatePayoff('R', $event)" />

    <!-- 左 T (对方被坑) / S (你被坑) -->
    <IncDecNumber :x="57" :y="150" :model-value="payoffs.T" @change="updatePayoff('T', $event)" />
    <IncDecNumber :x="97" :y="150" :model-value="payoffs.S" @change="updatePayoff('S', $event)" />

    <!-- 右 S / T -->
    <IncDecNumber :x="199" :y="150" :model-value="payoffs.S" @change="updatePayoff('S', $event)" />
    <IncDecNumber :x="242" :y="150" :model-value="payoffs.T" @change="updatePayoff('T', $event)" />

    <!-- P: 双方欺骗 -->
    <IncDecNumber :x="128" :y="221" :model-value="payoffs.P" @change="updatePayoff('P', $event)" />
    <IncDecNumber :x="168" :y="221" :model-value="payoffs.P" @change="updatePayoff('P', $event)" />
  </view>
</template>

<script setup lang="ts">
import IncDecNumber from './IncDecNumber.vue'
import type { Payoffs } from '@/core/pd'
import { t } from '@/locales/zh-CN'

const props = withDefaults(
  defineProps<{
    x: number
    y: number
    scale?: number
    payoffs: Payoffs
  }>(),
  {
    scale: 1,
  },
)

const emit = defineEmits<{
  (e: 'change', next: Payoffs): void
}>()

function updatePayoff(key: keyof Payoffs, val: number) {
  const next: Payoffs = {
    ...props.payoffs,
    [key]: val,
  }
  emit('change', next)
}
</script>
