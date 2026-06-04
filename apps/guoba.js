import path from 'path'
import { fileURLToPath } from 'url'
import { FileUtils } from '../../../lib/utils/file-utils.js'
import {
  getServerConfigPath,
  getGlobalConfigPath
} from '../../../lib/config/config-constants.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pluginRoot = path.resolve(__dirname, '..')

const GUOBA_USE_CONFIG = 'plugins/guoba-plugin/server/service/v3/config/model/useConfig.js'
const GUOBA_USE_MIAO = 'plugins/guoba-plugin/server/service/v3/config/model/useMiaoConfig.js'

function applyPathPlaceholders(content, port) {
  const p = port ?? global.serverPort ?? process.argv[3]
  return content
    .replace(/\$\{botbot\}/g, getServerConfigPath(p, 'bot'))
    .replace(/\$\{botqq\}/g, getServerConfigPath(p, 'qq'))
    .replace(/\$\{botgroup\}/g, getServerConfigPath(p, 'group'))
    .replace(/\$\{botother\}/g, getServerConfigPath(p, 'other'))
    .replace(/\$\{botserver\}/g, getServerConfigPath(p, 'server'))
    .replace(/\$\{botredis\}/g, getGlobalConfigPath('redis'))
    .replace(/\$\{globaldevice\}/g, getGlobalConfigPath('device'))
    .replace(/\$\{globalmonitor\}/g, getGlobalConfigPath('monitor'))
    .replace(/\$\{globalnotice\}/g, getGlobalConfigPath('notice'))
    .replace(/\$\{globaldb\}/g, getGlobalConfigPath('db'))
    .replace(/\$\{globalaistream\}/g, getGlobalConfigPath('aistream'))
}

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
      const configPath = path.join(process.cwd(), GUOBA_USE_CONFIG)
      const miaoConfigPath = path.join(process.cwd(), GUOBA_USE_MIAO)
      const commonPath = path.join(pluginRoot, 'conponents/guoba_common.js')
      const supportXrkPath = path.join(pluginRoot, 'conponents/guoba_supportxrk.js')

      if (!FileUtils.existsSync(configPath)) {
        await e.reply(
          '未安装 guoba-plugin，无法写入锅巴配置。请先安装锅巴，或使用 XRK 控制台（/xrk）编辑 data/server_bots 与 data/ai 下的 YAML。',
          true
        )
        return
      }

      const commonContent = await FileUtils.readFile(commonPath, 'utf8')
      const supportXrkContent = await FileUtils.readFile(supportXrkPath, 'utf8')
      if (!commonContent || !supportXrkContent) {
        await e.reply('读取锅巴模板失败，请检查适配器 conponents 目录是否完整', true)
        return
      }

      const newConfig = applyPathPlaceholders(commonContent, port)
      const newMiaoConfig = applyPathPlaceholders(supportXrkContent, port)

      let hasUpdates = false
      const oldConfig = await FileUtils.readFile(configPath, 'utf8').catch(() => '')
      if (newConfig !== oldConfig) {
        await FileUtils.writeFile(configPath, newConfig, 'utf8')
        hasUpdates = true
      }

      const oldMiaoConfig = await FileUtils.readFile(miaoConfigPath, 'utf8').catch(() => '')
      if (newMiaoConfig !== oldMiaoConfig) {
        await FileUtils.writeFile(miaoConfigPath, newMiaoConfig, 'utf8')
        hasUpdates = true
      }

      if (hasUpdates) {
        await e.reply(`锅巴配置已同步（XRK 系统字段）。账号 ${botUin}，请重启 Bot；向日葵插件配置在锅巴左侧「向日葵插件」或 XRK 控制台。`, true)
      } else {
        await e.reply('锅巴配置文件已是最新，无需更新', true)
      }
    } catch (error) {
      logger.error(`更新锅巴配置文件失败: ${error.stack}`)
      await e.reply(`更新锅巴配置文件失败: ${error.message}`, true)
    }
  }
}
