/**
 * XRK-Core 插件主入口
 * 整合原神相关功能和运行时扩展
 */

// 导入应用模块
import { guobaApp } from './apps/guoba.js'
import { gameHandlerApp } from './apps/game-handler.js'

// 导入运行时和扩展
import Runtime from '../../lib/plugins/runtime.js'
import GenshinExtension, { createCompatibilityProxy } from './apps/Genshin.js'

// 导出应用集合
export const apps = {
  guoba: guobaApp,
  gameHandler: gameHandlerApp
}

/**
 * 初始化运行时扩展
 */
function initRuntimeExtension() {
  if (!Runtime.registerExtension) {
    logger.warn('[XRK-Core] 当前版本的Runtime不支持扩展机制')
    return false
  }

  // 注册游戏扩展
  Runtime.registerExtension('game', GenshinExtension)
  
  // 包装原始的init方法
  const originalInit = Runtime.init
  Runtime.init = async function(e) {
    try {
      // 调用原始的init方法
      const runtime = await originalInit.call(this, e)
      
      // 如果有game扩展，创建兼容性代理
      if (runtime && runtime.getExtension && runtime.getExtension('game')) {
        e.runtime = createCompatibilityProxy(runtime)
      } else {
        e.runtime = runtime
      }
      
      return e.runtime
    } catch (error) {
      logger.error('[XRK-Core] Runtime初始化失败:', error)
      throw error
    }
  }
  
  return true
}

/**
 * 插件初始化函数
 */
export function init() {
  
  // 初始化运行时扩展
  const extensionInitialized = initRuntimeExtension()
  
  // 加载应用模块
  const loadedApps = Object.keys(apps).filter(appName => {
    if (apps[appName]) {
      return true
    }
    return false
  })
  
  return {
    apps,
    extensionInitialized,
    loadedApps
  }
}

if (process.env.AUTO_INIT !== 'false') {
  init()
}

// 默认导出
export default {
  apps,
  init
}