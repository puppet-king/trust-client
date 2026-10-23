<template>
  <view
    class="absolute inset-0 select-none pointer-events-none"
    style="position: absolute; left: 0px; top: 0px; width: 960px; height: 540px; pointer-events: none"
  >
    <!-- 左侧控制按钮：开始/停止、单步、重置 -->
    <view style="pointer-events: auto">
      <TrustButton
        :x="172"
        :y="135"
        size="short"
        :text-id="isAutoPlaying ? 'label_stop' : 'label_start'"
        @click="$emit('toggleAutoPlay')"
      />
      <TrustButton
        :x="172"
        :y="205"
        size="short"
        text-id="label_step"
        @click="$emit('step')"
      />
      <TrustButton
        :x="172"
        :y="275"
        size="short"
        text-id="label_reset"
        @click="$emit('reset')"
      />
    </view>

    <!-- 右侧三页签面板 (500x470) -->
    <view
      class="absolute pointer-events-auto"
      style="position: absolute; left: 460px; top: -10px; width: 500px; height: 470px; pointer-events: auto"
    >
      <!-- 页签背景雪碧图 (3 frames x 500 = 1500 x 470) -->
      <view style="position: absolute; left: 0px; top: 0px; width: 500px; height: 470px; pointer-events: none">
        <SpriteImage
          src="/pages-sandbox/static/sandbox_tabs.png"
          :view-width="500"
          :view-height="470"
          :sheet-width="1500"
          :sheet-height="470"
          :offset-x="-activeTab * 500"
          :offset-y="0"
        />
      </view>

      <!-- 三个页签点击热区 -->
      <view
        class="absolute cursor-pointer font-bold flex items-center justify-center"
        style="position: absolute; left: 30px; top: 22px; width: 120px; height: 38px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 21px"
        @tap="onSelectTab(0)"
      >
        {{ t('label_population') }}
      </view>
      <view
        class="absolute cursor-pointer font-bold flex items-center justify-center"
        style="position: absolute; left: 205px; top: 22px; width: 120px; height: 38px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 21px"
        @tap="onSelectTab(1)"
      >
        {{ t('label_payoffs') }}
      </view>
      <view
        class="absolute cursor-pointer font-bold flex items-center justify-center"
        style="position: absolute; left: 356px; top: 22px; width: 120px; height: 38px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 21px"
        @tap="onSelectTab(2)"
      >
        {{ t('label_rules') }}
      </view>

      <!-- 页签内容区域 (433 x 385) -->
      <view
        class="absolute"
        style="position: absolute; left: 33px; top: 80px; width: 433px; height: 385px"
      >
        <!-- Tab 0: 人口分布 -->
        <template v-if="activeTab === 0">
          <view style="font-size: 18px; color: #333333">
            {{ t('sandbox_population') }}
          </view>

          <view
            v-for="(item, idx) in gameStore.initialAgents"
            :key="item.strategy"
            class="absolute"
            :style="{
              position: 'absolute',
              left: (idx % 2) * 220 + 'px',
              top: 40 + Math.floor(idx / 2) * 80 + 'px',
              width: '200px',
              height: '70px',
            }"
          >
            <!-- 角色帽子图标 (40x40, 8 frames = 320x40) -->
            <view
              class="absolute"
              style="position: absolute; left: 0px; top: 0px; width: 40px; height: 40px"
            >
              <SpriteImage
                src="/static/ui/sandbox_hats.png"
                :view-width="40"
                :view-height="40"
                :sheet-width="320"
                :sheet-height="40"
                :offset-x="-PEEP_METADATA[item.strategy].frame * 40"
                :offset-y="0"
              />
            </view>
            <!-- 角色名称 -->
            <view
              class="absolute font-bold"
              :style="{
                position: 'absolute',
                left: '48px',
                top: '8px',
                width: '120px',
                fontWeight: 700,
                fontSize: '17px',
                color: PEEP_METADATA[item.strategy].color,
              }"
            >
              {{ t('label_short_' + item.strategy) }}
            </view>
            <!-- 人数 -->
            <view
              class="absolute font-bold text-right"
              :style="{
                position: 'absolute',
                left: '140px',
                top: '8px',
                width: '55px',
                textAlign: 'right',
                fontWeight: 700,
                fontSize: '18px',
                color: PEEP_METADATA[item.strategy].color,
              }"
            >
              {{ item.count }}
            </view>
            <!-- 人口滑块 -->
            <TrustSlider
              :x="0"
              :y="36"
              :width="200"
              :min="0"
              :max="25"
              :step="1"
              :model-value="item.count"
              @select="onAnchorPopulation()"
              @change="onAdjustPopulation(item.strategy, $event)"
            />
          </view>
        </template>

        <!-- Tab 1: 收益矩阵 -->
        <template v-else-if="activeTab === 1">
          <view style="font-size: 18px; color: #333333">
            {{ t('sandbox_payoffs') }}
          </view>
          <PayoffsUI
            :x="75"
            :y="35"
            :scale="0.88"
            :payoffs="gameStore.payoffs"
            @change="onPayoffsChange"
          />
          <TrustButton
            :x="240"
            :y="305"
            text-id="sandbox_reset_payoffs"
            @click="onResetPayoffs"
          />
        </template>

        <!-- Tab 2: 规则设置 -->
        <template v-else-if="activeTab === 2">
          <!-- 规则 1：每场回合数 -->
          <view
            class="absolute"
            style="position: absolute; left: 0px; top: 0px; width: 433px; font-size: 18px"
          >
            {{ t('sandbox_rules_1', { N: gameStore.turns }) }}
          </view>
          <TrustSlider
            :x="0"
            :y="35"
            :width="430"
            :min="1"
            :max="50"
            :step="1"
            :model-value="gameStore.turns"
            @change="onRuleTurnsChange"
          />

          <!-- 规则 2：淘汰与繁殖人数 -->
          <view
            class="absolute"
            style="position: absolute; left: 0px; top: 105px; width: 433px; font-size: 18px"
          >
            {{ t('sandbox_rules_2', { N: gameStore.selection }) }}
          </view>
          <TrustSlider
            :x="0"
            :y="160"
            :width="430"
            :min="1"
            :max="10"
            :step="1"
            :model-value="gameStore.selection"
            @change="onRuleSelectionChange"
          />

          <!-- 规则 3：失误率 -->
          <view
            class="absolute"
            style="position: absolute; left: 0px; top: 225px; width: 433px; font-size: 18px"
          >
            {{ t('sandbox_rules_3', { N: Math.round(gameStore.noise * 100) }) }}
          </view>
          <TrustSlider
            :x="0"
            :y="280"
            :width="430"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="gameStore.noise"
            @change="onRuleNoiseChange"
          />
        </template>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SpriteImage from './SpriteImage.vue'
import TrustButton from './TrustButton.vue'
import TrustSlider from './TrustSlider.vue'
import PayoffsUI from './PayoffsUI.vue'
import {
  adjustSandboxPopulation,
  type Payoffs,
  PEEP_METADATA,
  type StrategyId,
} from '@/core/pd'
import { soundManager } from '@/core/sound'
import { t } from '@/locales/zh-CN'
import { useGameStore } from '@/stores/game'

defineProps<{
  isAutoPlaying: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleAutoPlay'): void
  (e: 'step'): void
  (e: 'reset'): void
}>()

const gameStore = useGameStore()
const activeTab = ref<0 | 1 | 2>(0)
let anchorSnapshot: number[] = gameStore.initialAgents.map((c) => c.count)

function onSelectTab(tab: 0 | 1 | 2) {
  soundManager.playRandomButton()
  activeTab.value = tab
}

function onAnchorPopulation() {
  anchorSnapshot = gameStore.initialAgents.map((c) => c.count)
}

function onAdjustPopulation(strategy: StrategyId, val: number) {
  gameStore.initialAgents = adjustSandboxPopulation(
    gameStore.initialAgents,
    anchorSnapshot,
    strategy,
    val,
  )
  emit('reset')
}

function onPayoffsChange(next: Payoffs) {
  gameStore.payoffs = next
  emit('reset')
}

function onResetPayoffs() {
  gameStore.resetDefaultPayoffs()
  emit('reset')
}

function onRuleTurnsChange(val: number) {
  gameStore.turns = val
  emit('reset')
}

function onRuleSelectionChange(val: number) {
  gameStore.selection = val
  emit('reset')
}

function onRuleNoiseChange(val: number) {
  gameStore.noise = val
  emit('reset')
}
</script>
