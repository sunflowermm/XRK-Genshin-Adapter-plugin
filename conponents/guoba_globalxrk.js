/**
 * XRK 全局配置（device / monitor / notice / db / aistream / redis）
 * 路径与 lib/config/config-constants.js GLOBAL_CONFIG_NAMES 一致
 */
import path from 'path'
import { pathToFileURL } from 'url'
import { monitorSchemas, aiWorkflowSchemas } from './guoba_schema_xrk.js'

const { getGlobalConfigPath } = await import(
  pathToFileURL(path.join(process.cwd(), 'lib/config/config-constants.js')).href
)

export const globalConfigTab = {
  key: 'xrkGlobal',
  title: 'XRK 全局',
  cards: [
    {
      key: 'system.device',
      title: '设备管理',
      desc: '设备心跳、容量与命令（data/server_bots/device.yaml）',
      schemas: [
        { field: 'heartbeat_interval', label: '心跳间隔(秒)', component: 'InputNumber', componentProps: { min: 1 } },
        { field: 'heartbeat_timeout', label: '心跳超时(秒)', component: 'InputNumber', componentProps: { min: 1 } },
        { field: 'max_devices', label: '最大设备数', component: 'InputNumber', componentProps: { min: 1 } },
        { field: 'max_logs_per_device', label: '每设备最大日志条数', component: 'InputNumber', componentProps: { min: 1 } },
        { field: 'max_data_per_device', label: '每设备最大数据条数', component: 'InputNumber', componentProps: { min: 1 } },
        { field: 'command_timeout', label: '命令超时(ms)', component: 'InputNumber', componentProps: { min: 100 } },
        { field: 'batch_size', label: '批量发送数量', component: 'InputNumber', componentProps: { min: 1 } }
      ]
    },
    {
      key: 'system.monitor',
      title: '系统监控',
      desc: '浏览器与内存监控（data/server_bots/monitor.yaml）',
      schemas: monitorSchemas
    },
    {
      key: 'system.aistream',
      title: 'AI 工作流',
      desc: '工作流总开关与全局参数（data/server_bots/ai-workflow.yaml）',
      schemas: aiWorkflowSchemas
    },
    {
      key: 'system.notice',
      title: '通知推送',
      desc: 'Webhook 密钥（data/server_bots/notice.yaml）',
      schemas: [
        { field: 'iyuu', label: 'IYUU Token', component: 'Input' },
        { field: 'sct', label: 'Server酱 SendKey', component: 'Input' },
        { field: 'feishu_webhook', label: '飞书 Webhook', component: 'Input' }
      ]
    },
    {
      key: 'system.db',
      title: '数据库',
      desc: 'Sequelize（data/server_bots/db.yaml）',
      schemas: [
        { field: 'dialect', label: '数据库类型', component: 'Input', bottomHelpMessage: 'sqlite / mysql / postgres 等' },
        { field: 'storage', label: 'SQLite 路径', component: 'Input' },
        { field: 'logging', label: 'SQL 日志', component: 'Switch' }
      ]
    }
  ]
}

export const globalConfigFile = {
  'system.device': getGlobalConfigPath('device'),
  'system.monitor': getGlobalConfigPath('monitor'),
  'system.notice': getGlobalConfigPath('notice'),
  'system.db': getGlobalConfigPath('db'),
  'system.aistream': getGlobalConfigPath('ai-workflow')
}
