/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

/**
 * 标准版本更新 (SemVer) — 支持 pnpm version 与 npm version
 * pnpm version patch / npm version patch  1.0.0 → 1.0.1  Bug 修复
 * pnpm version minor / npm version minor  1.0.0 → 1.1.0  新增向下兼容的功能
 * pnpm version major / npm version major  1.0.0 → 2.0.0  不兼容的重大变更
 *
 * 预发布版本 (Pre-release)
 * pnpm version prepatch    1.0.0 → 1.0.1-0
 * pnpm version preminor    1.0.0 → 1.1.0-0
 * pnpm version premajor    1.0.0 → 2.0.0-0
 * pnpm version prerelease  1.0.1-0 → 1.0.1-1
 *
 * 直接指定版本号
 * pnpm version 2.1.5-beta.3
 */

// 1. 优先从已更新的 package.json 文件读取最新版本号（兼容 pnpm version / npm version / 手动执行）
const pkgPath = path.join(process.cwd(), 'package.json')
if (!fs.existsSync(pkgPath)) {
  console.error('❌ 未找到 package.json 文件')
  process.exit(1)
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
const newVersion = pkg.version || process.env.npm_package_version

if (!newVersion) {
  console.error('❌ 无法获取版本号，请检查 package.json 中的 version 字段')
  process.exit(1)
}

console.log(`📦 检测到目标版本号: ${newVersion}`)

// 2. 同步更新 src/configs/constant.ts 中的 VERSION
const constantPath = path.join(process.cwd(), 'src', 'configs', 'constant.ts')
if (fs.existsSync(constantPath)) {
  const content = fs.readFileSync(constantPath, 'utf8')
  const updatedContent = content.replace(
    /(export\s+const\s+VERSION\s*=\s*['"])(.*?)(['"])/,
    `$1${newVersion}$3`
  )
  fs.writeFileSync(constantPath, updatedContent, 'utf8')
  console.log(`✅ 已同步更新 src/configs/constant.ts -> VERSION = '${newVersion}'`)
} else {
  console.error('❌ 未找到 src/configs/constant.ts 文件')
  process.exit(1)
}

// 3. 同步更新 src/manifest.json 中的 versionName 与 versionCode
const manifestPath = path.join(process.cwd(), 'src', 'manifest.json')
if (fs.existsSync(manifestPath)) {
  const manifestContent = fs.readFileSync(manifestPath, 'utf8')
  const [major = 0, minor = 0, patch = 0] = newVersion
    .split('-')[0]
    .split('.')
    .map((n) => parseInt(n, 10) || 0)
  const versionCode = String(major * 10000 + minor * 100 + patch || 100)

  const updatedManifest = manifestContent
    .replace(/("versionName"\s*:\s*")(.*?)(")/, `$1${newVersion}$3`)
    .replace(/("versionCode"\s*:\s*")(.*?)(")/, `$1${versionCode}$3`)

  fs.writeFileSync(manifestPath, updatedManifest, 'utf8')
  console.log(
    `✅ 已同步更新 src/manifest.json -> versionName = "${newVersion}", versionCode = "${versionCode}"`
  )
}
