<template>
  <view
    class="absolute inset-0 pointer-events-none"
    style="position: absolute; left: 0px; top: 0px; width: 960px; height: 540px; overflow: visible; pointer-events: none; z-index: 1"
  >
    <!-- 连线层 -->
    <view
      v-for="(edge, idx) in edges"
      :key="'e-' + idx"
      class="absolute"
      :style="{
        position: 'absolute',
        left: edge.x + 'px',
        top: edge.y + 'px',
        width: edge.dist + 'px',
        height: '1.5px',
        backgroundColor: '#CCCCCC',
        transform: `rotate(${edge.angleDeg}deg)`,
        transformOrigin: '0 50%',
      }"
    />

    <!-- 漂浮小人层 -->
    <view
      v-for="peep in peeps"
      :key="peep.id"
      class="absolute"
      :style="{
        position: 'absolute',
        left: peep.x - 45.3 + 'px',
        top: peep.y - 60.3 + 'px',
        width: '90.6px',
        height: '120.6px',
        transform: `rotate(${peep.rotDeg}deg) scaleX(${peep.flip})`,
      }"
    >
      <SpriteImage
        src="/static/splash/splash_peep.png"
        :view-width="90.6"
        :view-height="120.6"
        :sheet-width="153.6"
        :sheet-height="307.2"
        :offset-x="-3"
        :offset-y="blush ? -126.6 : -3"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import SpriteImage from './SpriteImage.vue'

const props = withDefaults(
  defineProps<{
    blush?: boolean
  }>(),
  {
    blush: false,
  },
)

interface PeepNode {
  id: number
  initX: number
  initY: number
  x: number
  y: number
  initRot: number
  rotDeg: number
  radius: number
  swing: number
  angle: number
  speed: number
  flip: number
}

const peeps = ref<PeepNode[]>([])
const connectedPairs = ref<[number, number][]>([])
let timer: ReturnType<typeof setInterval> | null = null

function initSplash() {
  const list: PeepNode[] = []
  let idCounter = 1
  const rings = [
    { rad: 400, count: 20 },
    { rad: 520, count: 25 },
  ]

  for (const ring of rings) {
    const xRadius = ring.rad
    const yRadius = xRadius * (350 / 400)
    const inc = (Math.PI * 2) / ring.count + 0.0001
    for (let ang = 0; ang < Math.PI * 2; ang += inc) {
      const a = ang - Math.PI / 2
      const initX = 480 + Math.cos(a) * xRadius
      const initY = 270 + Math.sin(a) * yRadius
      const initRot = (Math.random() - 0.5) * (Math.PI - 0.4)
      const angle = Math.random() * Math.PI * 2
      const radius = 5 + Math.random() * 16
      const swing = 0.05 + Math.random() * 0.35
      list.push({
        id: idCounter++,
        initX,
        initY,
        x: initX + Math.cos(angle) * radius,
        y: initY + Math.sin(angle) * radius,
        initRot,
        rotDeg: ((initRot + Math.cos(angle) * swing) * 180) / Math.PI,
        radius,
        swing,
        angle,
        speed: 0.04 + Math.random() * 0.08,
        flip: Math.random() < 0.5 ? -1 : 1,
      })
    }
  }

  const pairs: [number, number][] = []
  const maxDistSq = 250 * 250
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const dx = list[j].initX - list[i].initX
      const dy = list[j].initY - list[i].initY
      if (dx * dx + dy * dy < maxDistSq) {
        pairs.push([i, j])
      }
    }
  }

  peeps.value = list
  connectedPairs.value = pairs
}

const edges = computed(() => {
  const p = peeps.value
  return connectedPairs.value.map(([i, j]) => {
    const p1 = p[i]
    const p2 = p[j]
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI
    return {
      x: p1.x,
      y: p1.y,
      dist,
      angleDeg,
    }
  })
})

onMounted(() => {
  initSplash()
  timer = setInterval(() => {
    for (const p of peeps.value) {
      p.angle += p.speed
      p.x = p.initX + Math.cos(p.angle) * p.radius
      p.y = p.initY + Math.sin(p.angle) * p.radius
      p.rotDeg = ((p.initRot + Math.cos(p.angle) * p.swing) * 180) / Math.PI
    }
  }, 80)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>
