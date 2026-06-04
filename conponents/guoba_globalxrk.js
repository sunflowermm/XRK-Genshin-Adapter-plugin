/**
 * XRK 全局配置（device / monitor / notice / db / aistream）
 * 路径与 lib/config/config-constants.js GLOBAL_CONFIG_NAMES 一致
 */

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
        { field: 'command_timeout', label: '命令超时(ms)', component: 'InputNumber', componentProps: { min: 100 } },
        { field: 'batch_size', label: '批量发送数量', component: 'InputNumber', componentProps: { min: 1 } }
      ]
    },
    {
      key: 'system.monitor',
      title: '系统监控',
      desc: '浏览器与内存监控（data/server_bots/monitor.yaml）',
      schemas: [
        { field: 'enabled', label: '启用监控', component: 'Switch' },
        { field: 'interval', label: '检查间隔(ms)', component: 'InputNumber', componentProps: { min: 1000 } },
        { field: 'browser.enabled', label: '浏览器监控', component: 'Switch' },
        { field: 'browser.maxInstances', label: '最大浏览器实例', component: 'InputNumber', componentProps: { min: 1 } },
        { field: 'memory.enabled', label: '内存监控', component: 'Switch' },
        { field: 'memory.autoOptimize', label: '自动优化', component: 'Switch' }
      ]
    },
    {
      key: 'system.aistream',
      title: 'AI 工作流',
      desc: '工作流总开关与全局参数（data/server_bots/aistream.yaml）',
      schemas: [
        { field: 'enabled', label: '启用工作流', component: 'Switch' },
        { field: 'streamDir', label: '工作流目录', component: 'Input' },
        { field: 'global.maxTimeout', label: '最大超时(ms)', component: 'InputNumber', componentProps: { min: 1000 } },
        { field: 'global.debug', label: '调试日志', component: 'Switch' },
        { field: 'global.maxConcurrent', label: '最大并发', component: 'InputNumber', componentProps: { min: 1 } },
        { field: 'cache.enabled', label: '启用缓存', component: 'Switch' },
        { field: 'cache.ttl', label: '缓存 TTL(秒)', component: 'InputNumber', componentProps: { min: 1 } },
        { field: 'llm.Provider', label: 'LLM 提供商', component: 'Input', bottomHelpMessage: '如 gptgod、volcengine；详细参数见控制台或 *_llm.yaml' },
        { field: 'llm.timeout', label: 'LLM 超时(ms)', component: 'InputNumber', componentProps: { min: 1000 } },
        { field: 'asr.Provider', label: 'ASR 提供商', component: 'Input' },
        { field: 'tts.Provider', label: 'TTS 提供商', component: 'Input' },
        { field: 'mcp.enabled', label: '启用 MCP', component: 'Switch' }
      ]
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

/** 占位符在 guoba.js 中按端口/全局替换 */
export const globalConfigFile = {
  'system.device': '${globaldevice}',
  'system.monitor': '${globalmonitor}',
  'system.notice': '${globalnotice}',
  'system.db': '${globaldb}',
  'system.aistream': '${globalaistream}'
}
