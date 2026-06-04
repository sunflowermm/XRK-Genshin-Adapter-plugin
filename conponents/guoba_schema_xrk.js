/**
 * XRK 锅巴表单字段（与 system-plugin/commonconfig/system.js、config/default_config 对齐）
 * 使用点路径绑定嵌套 YAML；复杂数组（domains/redirects）建议在 XRK 控制台编辑
 */

function sw(field, label, help = '') {
  return { field, label, ...(help ? { bottomHelpMessage: help } : {}), component: 'Switch' }
}

function num(field, label, opts = {}) {
  return {
    field,
    label,
    ...(opts.help ? { bottomHelpMessage: opts.help } : {}),
    component: 'InputNumber',
    componentProps: {
      min: opts.min,
      max: opts.max,
      step: opts.step,
      placeholder: opts.placeholder,
    },
  }
}

function inp(field, label, opts = {}) {
  return {
    field,
    label,
    ...(opts.help ? { bottomHelpMessage: opts.help } : {}),
    component: opts.password ? 'InputPassword' : 'Input',
    componentProps: { placeholder: opts.placeholder },
  }
}

function sel(field, label, options, help = '') {
  return {
    field,
    label,
    ...(help ? { bottomHelpMessage: help } : {}),
    component: 'Select',
    componentProps: {
      options: options.map(o =>
        typeof o === 'string' ? { label: o, value: o } : o
      ),
      placeholder: '请选择',
    },
  }
}

function tags(field, label, help = '') {
  return {
    field,
    label,
    ...(help ? { bottomHelpMessage: help } : {}),
    component: 'GTags',
    componentProps: { allowAdd: true, allowDel: true },
  }
}

/** bot.yaml 全字段 */
export const botSchemas = [
  sw('debug', '调试输出', '是否输出调试信息（如错误堆栈）'),
  sel(
    'log_level',
    '日志等级',
    ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark', 'success', 'tip'],
    '全局最低输出级别；Mark 时只显示执行命令'
  ),
  inp('log_align', '日志头内容', { help: '每条日志行首标识，如 XRKYZ', placeholder: 'XRKYZ' }),
  sel(
    'log_color',
    '日志头颜色方案',
    [
      { label: '默认蓝系', value: 'default' },
      { label: '红橙黄绿蓝', value: 'scheme1' },
      { label: '粉色系', value: 'scheme2' },
      { label: '蓝绿色系', value: 'scheme3' },
      { label: '紫色系', value: 'scheme4' },
      { label: '天空渐变', value: 'scheme5' },
      { label: '火焰渐变', value: 'scheme6' },
      { label: '绿野渐变', value: 'scheme7' },
    ]
  ),
  num('log_max_days', '主日志保留天数', { min: 1, help: '主日志文件保留天数' }),
  num('log_trace_days', 'trace 日志保留天数', { min: 1 }),
  num('log_id_length', '日志 ID 长度', { min: 1, max: 64 }),
  sel('log_id_filler', 'ID 填充字符', ['.', '·', '─', '•', '═', '»', '→']),
  num('log_object.depth', '日志对象-检查深度', { min: 1 }),
  sw('log_object.colors', '日志对象-彩色输出'),
  sw('log_object.showHidden', '日志对象-显示隐藏属性'),
  sw('log_object.showProxy', '日志对象-显示代理对象'),
  sw('log_object.getters', '日志对象-显示 getters'),
  num('log_object.breakLength', '日志对象-换行长度', { min: 1 }),
  num('log_object.maxArrayLength', '日志对象-最大数组长度', { min: 1 }),
  num('log_object.maxStringLength', '日志对象-最大字符串长度', { min: 1 }),
  sw('ignore_self', '过滤自己的消息', '群聊和频道中是否过滤自己发的消息'),
  sw('/→#', '斜杠转井号', '是否自动把 / 换成 #'),
  sw('file_watch', '监听文件变化', '插件/配置变更时热重载'),
  inp('chromium_path', 'Chromium 路径', { help: '可执行文件绝对路径，留空用默认', placeholder: '' }),
  inp('puppeteer_ws', 'Puppeteer 接口地址', { placeholder: '' }),
  num('puppeteer_timeout', 'Puppeteer 截图超时(ms)', { min: 0 }),
  num('online_msg_exp', '上线推送冷却(秒)', { min: 0, help: 'Bot 上线后在此时间内不重复推送' }),
  num('file_to_url_time', '文件 URL 有效时间(分钟)', { min: 1 }),
  num('file_to_url_times', '文件 URL 访问次数', { min: 1 }),
  sw('cache_group_member', '缓存群成员列表'),
]

/** group 默认项扩展（违禁词等） */
export const groupExtraSchemas = [
  sw('bannedWords.enabled', '启用违禁词检测'),
  num('bannedWords.muteTime', '违禁词禁言时间(分钟)', { min: 0, help: '触发禁言时长' }),
  sw('bannedWords.warnOnly', '违禁词仅警告', '为 true 时只警告不禁言'),
  tags('bannedWords.exemptRoles', '违禁词免检角色', '如 owner、admin'),
]

/** server.yaml 常用字段（点路径） */
export const serverSchemas = [
  inp('server.name', '服务器名称', { placeholder: 'XRK Server' }),
  inp('server.host', '监听地址', { help: '0.0.0.0 或 127.0.0.1', placeholder: '0.0.0.0' }),
  inp('server.url', '外部访问 URL', { help: '留空自动检测' }),
  sw('proxy.enabled', '启用反向代理'),
  num('proxy.httpPort', '反向代理 HTTP 端口', { min: 1, max: 65535 }),
  num('proxy.httpsPort', '反向代理 HTTPS 端口', { min: 1, max: 65535 }),
  sw('proxy.healthCheck.enabled', '启用健康检查'),
  num('proxy.healthCheck.interval', '健康检查间隔(ms)', { min: 1000 }),
  num('proxy.healthCheck.maxFailures', '健康检查最大失败次数', { min: 1 }),
  num('proxy.healthCheck.timeout', '健康检查超时(ms)', { min: 1000 }),
  num('proxy.healthCheck.cacheTime', '健康检查结果缓存(ms)', { min: 0 }),
  sw('https.enabled', '启用 HTTPS'),
  inp('https.certificate.key', 'SSL 私钥路径', { placeholder: '/path/to/key.pem' }),
  inp('https.certificate.cert', 'SSL 证书路径', { placeholder: '/path/to/cert.pem' }),
  inp('https.certificate.ca', 'CA 证书链路径'),
  sel('https.tls.minVersion', '最低 TLS 版本', ['TLSv1.0', 'TLSv1.1', 'TLSv1.2', 'TLSv1.3']),
  sw('https.tls.http2', '启用 HTTP/2'),
  sw('https.hsts.enabled', '启用 HSTS'),
  num('https.hsts.maxAge', 'HSTS 有效期(秒)', { min: 0 }),
  sw('https.hsts.includeSubDomains', 'HSTS 包含子域名'),
  sw('https.hsts.preload', 'HSTS 允许预加载'),
  sw('static.extensions', '静态文件自动扩展名'),
  num('static.cache.static', '静态资源缓存(秒)', { min: 0 }),
  num('static.cache.images', '图片缓存(秒)', { min: 0 }),
  inp('static.cacheTime', '静态默认缓存时长', { help: '如 1d、1h', placeholder: '1d' }),
  sw('security.helmet.enabled', '启用 Helmet 安全头'),
  tags('security.hiddenFiles', '隐藏文件模式', '匹配则返回 404'),
  sw('cors.enabled', '启用 CORS'),
  tags('cors.origins', 'CORS 允许来源'),
  tags('cors.methods', 'CORS 允许方法'),
  tags('cors.headers', 'CORS 允许请求头'),
  sw('cors.credentials', 'CORS 允许凭证'),
  num('cors.maxAge', 'CORS 预检缓存(秒)', { min: 0 }),
  sw('auth.apiKey.enabled', '启用 API Key 认证'),
  inp('auth.apiKey.file', 'API Key 存储文件', { placeholder: 'config/server_config/api_key.json' }),
  num('auth.apiKey.length', 'API Key 长度', { min: 16, max: 128 }),
  sw('auth.uiCookie.enabled', '同源 UI Cookie 免认证'),
  inp('auth.uiCookie.pathPrefix', 'UI Cookie 路径前缀', { placeholder: '/xrk' }),
  inp('auth.uiCookie.name', 'UI Cookie 名称'),
  inp('auth.uiCookie.value', 'UI Cookie 值'),
  sw('auth.uiCookie.allowPublicSameOrigin', '同源 Cookie 免 API Key'),
  sw('auth.uiCookie.httpOnly', 'UI Cookie HttpOnly'),
  inp('auth.uiCookie.sameSite', 'UI Cookie SameSite', { placeholder: 'lax' }),
  num('auth.uiCookie.maxAgeMs', 'UI Cookie 有效期(ms)', { min: 0 }),
  tags('auth.whitelist', '认证白名单路径'),
  sw('rateLimit.enabled', '启用速率限制'),
  num('rateLimit.global.windowMs', '全局限流窗口(ms)', { min: 1000 }),
  num('rateLimit.global.max', '全局限流最大请求数', { min: 1 }),
  inp('rateLimit.global.message', '全局限流提示'),
  num('rateLimit.api.windowMs', 'API 限流窗口(ms)', { min: 1000 }),
  num('rateLimit.api.max', 'API 限流最大请求数', { min: 1 }),
  inp('rateLimit.api.message', 'API 限流提示'),
  inp('limits.urlencoded', 'URL 编码体大小限制', { placeholder: '10mb' }),
  inp('limits.json', 'JSON 体大小限制', { placeholder: '10mb' }),
  inp('limits.raw', '原始体大小限制', { placeholder: '50mb' }),
  inp('limits.text', '文本体大小限制', { placeholder: '10mb' }),
  inp('limits.fileSize', '文件上传大小限制', { placeholder: '100mb' }),
  sw('compression.enabled', '启用响应压缩'),
  num('compression.level', '压缩级别', { min: 0, max: 9, help: '0 最快，9 最小体积' }),
  num('compression.threshold', '最小压缩大小(字节)', { min: 0 }),
  sw('logging.requests', '记录请求日志'),
  sw('logging.errors', '记录错误日志'),
  sw('logging.debug', '服务器调试日志'),
  tags('logging.quiet', '静默路径（不记日志）'),
  sw('cdn.enabled', '启用 CDN'),
  inp('cdn.domain', 'CDN 域名'),
  inp('cdn.staticPrefix', 'CDN 静态前缀', { placeholder: '/static' }),
  sw('cdn.https', 'CDN 使用 HTTPS'),
  num('cdn.cacheControl.static', 'CDN 静态缓存(秒)', { min: 0 }),
  num('cdn.cacheControl.images', 'CDN 图片缓存(秒)', { min: 0 }),
  num('cdn.cacheControl.default', 'CDN 默认缓存(秒)', { min: 0 }),
  sw('performance.keepAlive.enabled', '启用 Keep-Alive'),
  num('performance.keepAlive.initialDelay', 'Keep-Alive 初始延迟(ms)', { min: 0 }),
  num('performance.keepAlive.timeout', 'Keep-Alive 超时(ms)', { min: 1000 }),
  sw('performance.http2Push.enabled', '启用 HTTP/2 Push'),
  tags('performance.http2Push.criticalAssets', 'HTTP/2 推送资源列表'),
  num('performance.connectionPool.maxSockets', '连接池最大 Socket', { min: 1 }),
  num('performance.connectionPool.maxFreeSockets', '连接池最大空闲 Socket', { min: 1 }),
  num('performance.connectionPool.timeout', '连接池超时(ms)', { min: 1000 }),
  sw('misc.detectPublicIP', '自动检测公网 IP'),
  inp('misc.defaultRoute', '404 默认重定向', { placeholder: '/' }),
  {
    field: 'proxy.domains',
    label: '反向代理域名列表',
    bottomHelpMessage: '复杂域名/负载均衡建议在 XRK 控制台（commonconfig）用 ArrayForm 编辑；此处可留空由 YAML 手改',
    component: 'Textarea',
    componentProps: { rows: 4, placeholder: '[]' },
  },
  {
    field: 'redirects',
    label: 'HTTP 重定向规则',
    bottomHelpMessage: 'JSON 数组；复杂规则建议在 XRK 控制台编辑',
    component: 'Textarea',
    componentProps: { rows: 3, placeholder: '[]' },
  },
]

/** monitor.yaml 全字段 */
export const monitorSchemas = [
  sw('enabled', '监控总开关'),
  num('interval', '检查间隔(ms)', { min: 1000 }),
  sw('browser.enabled', '浏览器监控'),
  num('browser.maxInstances', '最大浏览器实例', { min: 1 }),
  num('browser.memoryThreshold', '浏览器内存阈值(%)', { min: 0, max: 100 }),
  sw('browser.reserveNewest', '清理时保留最新实例'),
  sw('memory.enabled', '内存监控'),
  num('memory.systemThreshold', '系统内存阈值(%)', { min: 0, max: 100 }),
  num('memory.nodeThreshold', 'Node 堆内存阈值(%)', { min: 0, max: 100 }),
  sw('memory.autoOptimize', '自动优化内存'),
  num('memory.gcInterval', 'GC 最小间隔(ms)', { min: 1000 }),
  sw('memory.leakDetection.enabled', '启用内存泄漏检测'),
  num('memory.leakDetection.threshold', '泄漏阈值', { min: 0, max: 1, step: 0.01, help: '增长率阈值' }),
  num('memory.leakDetection.checkInterval', '泄漏检测间隔(ms)', { min: 1000 }),
  sw('cpu.enabled', 'CPU 监控'),
  num('cpu.threshold', 'CPU 阈值(%)', { min: 0, max: 100 }),
  num('cpu.checkDuration', 'CPU 持续时长(ms)', { min: 1000 }),
  sw('optimize.aggressive', '激进优化模式'),
  sw('optimize.autoRestart', '严重时自动重启'),
  num('optimize.restartThreshold', '重启阈值(%)', { min: 0, max: 100 }),
  sw('report.enabled', '启用监控报告'),
  num('report.interval', '报告间隔(ms)', { min: 1000 }),
  sw('disk.enabled', '磁盘优化'),
  sw('disk.cleanupTemp', '清理临时文件'),
  sw('disk.cleanupLogs', '清理日志文件'),
  num('disk.tempMaxAge', '临时文件最大年龄(ms)', { min: 0 }),
  num('disk.logMaxAge', '日志文件最大年龄(ms)', { min: 0 }),
  num('disk.maxLogSize', '单日志最大大小(字节)', { min: 0 }),
  sw('network.enabled', '网络优化'),
  num('network.maxConnections', '最大连接数阈值', { min: 1 }),
  sw('network.cleanupIdle', '清理空闲连接'),
  sw('process.enabled', '进程优化'),
  sel('process.priority', '进程优先级', ['low', 'normal', 'high']),
  num('process.nice', 'Linux nice 值', { min: -20, max: 19 }),
  sw('system.enabled', '系统级优化'),
  sw('system.clearCache', '清理系统缓存'),
  sw('system.optimizeCPU', '优化 CPU 调度'),
]

/** aistream.yaml 全字段 */
export const aistreamSchemas = [
  sw('enabled', '启用工作流'),
  inp('streamDir', '工作流目录', { help: '兼容保留；实际从各插件 stream/ 加载' }),
  num('global.maxTimeout', '最大执行超时(ms)', { min: 1000 }),
  sw('global.debug', '工作流调试日志'),
  num('global.maxConcurrent', '最大并发', { min: 1 }),
  sw('cache.enabled', '启用工作流缓存'),
  num('cache.ttl', '缓存 TTL(秒)', { min: 1 }),
  num('cache.maxSize', '最大缓存条数', { min: 1 }),
  inp('llm.Provider', 'LLM 运营商', { help: 'gptgod、volcengine 或兼容工厂 key' }),
  num('llm.timeout', 'LLM 超时(ms)', { min: 1000 }),
  num('llm.temperature', '默认 temperature', { min: 0, max: 2, step: 0.1 }),
  num('llm.maxTokens', '默认 max_tokens', { min: 1 }),
  num('llm.topP', '默认 top_p', { min: 0, max: 1, step: 0.05 }),
  num('llm.presencePenalty', '默认 presence_penalty', { min: -2, max: 2, step: 0.1 }),
  num('llm.frequencyPenalty', '默认 frequency_penalty', { min: -2, max: 2, step: 0.1 }),
  sw('llm.retry.enabled', 'LLM 启用重试'),
  num('llm.retry.maxAttempts', 'LLM 最大重试次数', { min: 1, max: 10 }),
  num('llm.retry.delay', 'LLM 重试延迟(ms)', { min: 100 }),
  tags('llm.retry.retryOn', 'LLM 重试条件', 'timeout / network / 5xx / all'),
  sel('asr.Provider', 'ASR 运营商', ['volcengine']),
  sel('tts.Provider', 'TTS 运营商', ['volcengine']),
  sw('tts.onlyForASR', 'TTS 仅 ASR 触发'),
  sw('mcp.enabled', '启用 MCP'),
  num('mcp.port', 'MCP 端口', { min: 1024, max: 65535, help: '留空则用 HTTP API 端口' }),
  sw('mcp.autoRegister', 'MCP 自动注册工具'),
  sw('mcp.remote.enabled', '启用远程 MCP'),
  tags('mcp.remote.selected', '已选远程 MCP 服务器'),
  {
    field: 'mcp.remote.servers',
    label: '远程 MCP 服务器定义',
    bottomHelpMessage: '复杂 MCP 建议在 XRK 控制台编辑；可填 JSON 数组',
    component: 'Textarea',
    componentProps: { rows: 4, placeholder: '[]' },
  },
]
