import path from 'path'
import fs from 'fs/promises'

const getServerConfigPath = (port, filename) => `data/server_bots/${port}/${filename}`

export class guobaApp extends plugin {
  constructor() {
    super({
      name: '锅巴配置',
      dsc: '锅巴配置管理',
      event: 'message',
      priority: 'extended',
      rule: [
        {
          reg: /^#?锅巴登录$/,
          fnc: 'guobaLogin'
        }
      ]
    })
  }

  async guobaLogin(e) {
    await this.updateGuobaConfig(Bot.uin, e, 'standard', global.serverPort || process.argv[3])
    return true
  }

  async updateGuobaConfig(botUin, e, mode = 'standard', port = null) {
    try {
      const configPath = path.join(process.cwd(), 'plugins/guoba-plugin/server/service/v3/config/model/useConfig.js')
      const miaoConfigPath = path.join(process.cwd(), 'plugins/guoba-plugin/server/service/v3/config/model/useMiaoConfig.js')
      const commonPath = path.join(process.cwd(), 'plugins/XRK-Core/conponents/guoba_common.js')
      const supportXrkPath = path.join(process.cwd(), 'plugins/XRK-Core/conponents/guoba_supportxrk.js')

      if (!await fs.access(configPath).then(() => true).catch(() => false)) {
        e.reply('锅巴配置文件不存在，无法更新', true)
        return
      }

      let commonContent = await fs.readFile(commonPath, 'utf8')
      let supportXrkContent = await fs.readFile(supportXrkPath, 'utf8')

      const replacement = (content) => content
        .replace(/\$\{botbot\}/g, getServerConfigPath(port, 'bot.yaml'))
        .replace(/\$\{botqq\}/g, getServerConfigPath(port, 'qq.yaml'))
        .replace(/\$\{botgroup\}/g, getServerConfigPath(port, 'group.yaml'))
        .replace(/\$\{botredis\}/g, getServerConfigPath(port, 'redis.yaml'))
        .replace(/\$\{botother\}/g, getServerConfigPath(port, 'other.yaml'))
        .replace(/\$\{botserver\}/g, getServerConfigPath(port, 'server.yaml'))

      const newConfig = replacement(commonContent)
      const newMiaoConfig = replacement(supportXrkContent)

      let hasUpdates = false
      const oldConfig = await fs.readFile(configPath, 'utf8').catch(() => '')
      if (newConfig !== oldConfig) {
        await fs.writeFile(configPath, newConfig, 'utf8')
        hasUpdates = true
      }

      const oldMiaoConfig = await fs.readFile(miaoConfigPath, 'utf8').catch(() => '')
      if (newMiaoConfig !== oldMiaoConfig) {
        await fs.writeFile(miaoConfigPath, newMiaoConfig, 'utf8')
        hasUpdates = true
      }

      if (hasUpdates) {
        e.reply(`锅巴配置文件已更新，当前账号: ${botUin}，请重启Bot生效`, true)
      } else {
        e.reply('锅巴配置文件无需更新', true)
      }
    } catch (error) {
      logger.error(`更新锅巴配置文件失败: ${error.stack}`)
      e.reply(`更新锅巴配置文件失败: ${error.message}`, true)
    }
  }
}