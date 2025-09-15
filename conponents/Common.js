// 通用渲染功能
class Common {
  static async render(plugin, tpl, data, cfg) {
    try {
      const MiaoCommon = (await import("#miao").catch(() => null))?.Common
      if (MiaoCommon) {
        return MiaoCommon.render(plugin, tpl, data, cfg)
      }
    } catch (err) {
      logger.debug('Miao渲染不可用，使用默认渲染')
    }
    
    // 默认渲染逻辑
    logger.warn(`渲染功能需要miao插件支持: ${plugin}/${tpl}`)
    return null
  }
}

export { Common }