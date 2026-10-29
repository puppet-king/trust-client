<script setup lang="ts">
import { onLaunch, onHide, onShow } from '@dcloudio/uni-app'
import { soundManager } from '@/core/sound'

onLaunch(() => {
  checkForUpdate()
})

onShow(() => {
  soundManager.resumeBgmIfNeeded()
})

onHide(() => {
  soundManager.pauseBgm()
})

const checkForUpdate = () => {
  // #ifdef MP-WEIXIN
  const startParamObj = uni.getEnterOptionsSync()
  if (uni.canIUse('getUpdateManager') && startParamObj.scene !== 1154) {
    const updateManager = uni.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          uni.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启当前应用？',
            confirmColor: '#4089DD',
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            },
          })
        })
      }
    })
  }
  // #endif
}
</script>
<style lang="scss">
@use '@/style/index.scss';

page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #ffffff;
  font-family:
    -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'MiSans', 'HarmonyOS Sans', 'Microsoft YaHei',
    sans-serif;
}

/* 核心布局与主题兜底样式，确保小程序任何渲染环境下 100% 生效 */
.absolute {
  position: absolute;
}
.relative {
  position: relative;
}
.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.flex {
  display: flex;
}
.flex-row {
  flex-direction: row;
}
.flex-col {
  flex-direction: column;
}
.flex-1 {
  flex: 1 1 0%;
}
.flex-shrink-0 {
  flex-shrink: 0;
}
.items-center {
  align-items: center;
}
.items-start {
  align-items: flex-start;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.text-left {
  text-align: left;
}
.font-bold {
  font-weight: 700;
}
.select-none {
  user-select: none;
}
.pointer-events-none {
  pointer-events: none;
}
.pointer-events-auto {
  pointer-events: auto;
}
.overflow-hidden {
  overflow: hidden;
}
.w-screen {
  width: 100vw;
}
.h-screen {
  height: 100vh;
}
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}

@keyframes trust-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-fade-in {
  animation: trust-fade-in 0.35s ease-out;
}

.tft {
  color: #4089dd;
  font-weight: 600;
}
.all_d {
  color: #52537f;
  font-weight: 600;
}
.all_c {
  color: #ff75ff;
  font-weight: 600;
}
.grudge {
  color: #d4af00;
  font-weight: 600;
}
.prober {
  color: #f6b24c;
  font-weight: 600;
}
.tf2t {
  color: #88a8ce;
  font-weight: 600;
}
.pavlov {
  color: #86c448;
  font-weight: 600;
}
.random {
  color: #ff5e5e;
  font-weight: 600;
}

/*  #ifdef  H5  */
svg {
  display: initial;
}
/*  #endif  */
</style>
