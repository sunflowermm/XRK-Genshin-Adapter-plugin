// XRK-Yunzai 锅巴字段扩展（与 config/default_config、system-plugin/commonconfig 对齐）

export const addGroupPromptProps = {
  content: '请输入群号：',
  placeholder: '请输入群号',
  okText: '添加',
  rules: [
    { required: true, message: '群号得填上才行哦~' },
    [{ min: 5, message: '真的有这么短的群号吗？' }],
  ],
}

export const addUserPromptProps = tip => ({
  content: `请输入${tip}QQ号：`,
  placeholder: '请输入QQ号',
  okText: '添加',
  rules: [
    { required: true, message: 'QQ号得填上才行哦~' },
    { min: 5, message: '真的有这么短的QQ号吗？' },
  ],
})

export const baseConfig = {
  bot: [
    {
      field: 'debug',
      label: '调试输出',
      bottomHelpMessage: '是否输出调试信息（如错误堆栈）',
      component: 'Switch',
    },
    {
      field: 'ignore_self',
      label: '过滤自己',
      bottomHelpMessage: '群聊和频道中是否过滤自己的消息',
      component: 'Switch',
    },
    {
      field: '/→#',
      label: '斜杠转井号',
      bottomHelpMessage: '是否自动把 / 换成 #',
      component: 'Switch',
    },
    {
      field: 'file_watch',
      label: '监听文件变化',
      bottomHelpMessage: '插件/配置变更时热重载',
      component: 'Switch',
    },
    {
      field: 'cache_group_member',
      label: '缓存群成员',
      component: 'Switch',
    },
    {
      field: 'log_max_days',
      label: '主日志保留天数',
      component: 'InputNumber',
      componentProps: { min: 1 },
    },
    {
      field: 'log_trace_days',
      label: 'trace 日志保留天数',
      component: 'InputNumber',
      componentProps: { min: 1 },
    },
    {
      field: 'log_id_length',
      label: '日志 ID 长度',
      component: 'InputNumber',
      componentProps: { min: 1, max: 64 },
    },
    {
      field: 'log_id_filler',
      label: 'ID 填充字符',
      component: 'Select',
      componentProps: {
        options: [
          { label: '.', value: '.' },
          { label: '·', value: '·' },
          { label: '─', value: '─' },
          { label: '•', value: '•' },
          { label: '═', value: '═' },
          { label: '»', value: '»' },
          { label: '→', value: '→' },
        ],
      },
    },
    {
      field: 'file_to_url_time',
      label: '文件 URL 有效时间(分钟)',
      component: 'InputNumber',
      componentProps: { min: 1 },
    },
    {
      field: 'file_to_url_times',
      label: '文件 URL 访问次数',
      component: 'InputNumber',
      componentProps: { min: 1 },
    },
  ],
}

export const groupConfig = {
  group: [
    {
      field: 'groupGlobalCD',
      label: '整体冷却时间',
      component: 'InputNumber',
      bottomHelpMessage: '群聊中所有指令冷却（毫秒），0 无限制',
      componentProps: { placeholder: '毫秒', min: 0 },
    },
    {
      field: 'singleCD',
      label: '个人冷却时间',
      component: 'InputNumber',
      bottomHelpMessage: '群聊中个人操作冷却（毫秒）',
      componentProps: { placeholder: '毫秒', min: 0 },
    },
    {
      field: 'onlyReplyAt',
      label: '只关注At',
      component: 'RadioGroup',
      bottomHelpMessage: '0-否 1-是 2-非主人仅@',
      componentProps: {
        options: [
          { label: '关闭', value: 0 },
          { label: '开启', value: 1 },
          { label: '开启、主人关闭', value: 2 },
        ],
      },
    },
    {
      field: 'botAlias',
      label: '机器人别名',
      component: 'GTags',
      componentProps: { allowAdd: true, allowDel: true },
    },
    {
      field: 'addLimit',
      label: '添加表情权限',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '所有群员', value: 0 },
          { label: '群主和管理员', value: 1 },
          { label: '仅主人', value: 2 },
        ],
      },
    },
    {
      field: 'addReply',
      label: '添加好友回复',
      component: 'Switch',
      componentProps: { checkedValue: true, unCheckedValue: false },
    },
    {
      field: 'addAt',
      label: '添加时 @ 对方',
      component: 'Switch',
    },
    {
      field: 'addRecall',
      label: '添加回复撤回(秒)',
      component: 'InputNumber',
      componentProps: { min: 0 },
    },
  ],
}

export const otherConfig = {
  other: [
    {
      field: 'masterQQ',
      label: '主人QQ',
      bottomHelpMessage: '主人 QQ，可多个',
      component: 'GSelectFriend',
      componentProps: { placeholder: '请选择主人QQ号' },
    },
    {
      field: 'disableGuildMsg',
      label: '禁用频道消息',
      component: 'Switch',
    },
    {
      field: 'qq',
      label: '不发送禁用提示的QQ',
      bottomHelpMessage: '0 表示不启用',
      component: 'InputNumber',
      componentProps: { min: 0 },
    },
    {
      field: 'blackQQ',
      label: '黑名单QQ',
      component: 'GTags',
      componentProps: {
        allowAdd: true,
        allowDel: true,
        showPrompt: true,
        promptProps: addUserPromptProps('黑名单'),
        valueFormatter: ((value) => Number.parseInt(value)).toString(),
      },
    },
    {
      field: 'whiteQQ',
      label: '白名单QQ',
      component: 'GTags',
      componentProps: {
        allowAdd: true,
        allowDel: true,
        showPrompt: true,
        promptProps: addUserPromptProps('白名单'),
        valueFormatter: ((value) => Number.parseInt(value)).toString(),
      },
    },
  ],
}
