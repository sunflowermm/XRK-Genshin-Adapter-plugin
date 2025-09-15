export class gameHandlerApp extends plugin {
  constructor() {
    super({
      name: '游戏命令处理',
      dsc: '处理游戏相关命令',
      event: 'message',
      priority: 'extended',
      rule: []
    })
    this.srReg = /^#?(\*|星铁|星轨|穹轨|星穹|崩铁|星穹铁道|崩坏星穹铁道|铁道)+/
    this.zzzReg = /^#?(%|％|绝区零|绝区)+/
  }

  async accept(e) {
    // 设置游戏属性
    this.setupGameProperties(e)
    
    // 处理游戏命令
    this.handleGameCommands(e)
    
    return false // 继续执行其他插件
  }

  setupGameProperties(e) {
    const defineGameProperty = (propName, gameValue) => {
      if (!Object.prototype.hasOwnProperty.call(e, propName)) {
        Object.defineProperty(e, propName, {
          get: () => e.game === gameValue,
          set: v => (e.game = v ? gameValue : 'gs')
        })
      }
    }

    defineGameProperty('isSr', 'sr')
    defineGameProperty('isGs', 'gs')
    defineGameProperty('isZzz', 'zzz')
  }

  handleGameCommands(e) {
    if (this.srReg.test(e.msg)) {
      e.game = 'sr'
      e.msg = e.msg.replace(this.srReg, '#星铁')
    } else if (this.zzzReg.test(e.msg)) {
      e.game = 'zzz'
      e.msg = e.msg.replace(this.zzzReg, '#绝区零')
    }
  }
}