/**
 * XRK-Genshin-Adapter 插件入口
 * 注册 game Runtime 扩展；星铁/绝区零前缀由本体 loader 处理
 */
import { guobaApp } from './apps/guoba.js'
import Runtime from '../../lib/plugins/runtime.js'
import GenshinExtension from './apps/Genshin.js'

export const apps = {
  guoba: guobaApp
}

if (Runtime.registerExtension) {
  Runtime.registerExtension('game', GenshinExtension)
} else {
  logger.warn('[XRK-Genshin-Adapter] 当前 Runtime 不支持扩展机制')
}

export default { apps }
