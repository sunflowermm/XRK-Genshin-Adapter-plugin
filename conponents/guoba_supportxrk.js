// XRK-Yunzai 锅巴字段（bot / group / other），与 commonconfig 对齐
import { botSchemas, groupExtraSchemas } from './guoba_schema_xrk.js'

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
  bot: botSchemas,
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
    ...groupExtraSchemas,
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
      field: 'autoFriend',
      label: '自动同意加好友',
      bottomHelpMessage: '1-同意 0-不处理',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '不处理', value: 0 },
          { label: '自动同意', value: 1 },
        ],
      },
    },
    {
      field: 'autoQuit',
      label: '自动退群人数',
      bottomHelpMessage: '被拉进群时人数小于此值自动退出，0 不处理',
      component: 'InputNumber',
      componentProps: { min: 0 },
    },
    {
      field: 'disableGuildMsg',
      label: '禁用频道消息',
      component: 'Switch',
    },
    {
      field: 'disablePrivate',
      label: '禁用私聊',
      bottomHelpMessage: '为 true 时私聊仅通行关键词或主人',
      component: 'Switch',
    },
    {
      field: 'disableMsg',
      label: '禁用私聊提示',
      component: 'Input',
      componentProps: { placeholder: '私聊功能已禁用' },
    },
    {
      field: 'qq',
      label: '不发送禁用提示的QQ',
      bottomHelpMessage: '0 表示不启用',
      component: 'InputNumber',
      componentProps: { min: 0 },
    },
    {
      field: 'disableAdopt',
      label: '私聊通行字符串',
      bottomHelpMessage: '消息包含任一词时不受私聊禁用限制',
      component: 'GTags',
      componentProps: { allowAdd: true, allowDel: true },
    },
    {
      field: 'whiteGroup',
      label: '白名单群',
      bottomHelpMessage: '配置后仅在这些群响应；空为不限制',
      component: 'GSelectGroup',
      componentProps: { placeholder: '请选择白名单群' },
    },
    {
      field: 'blackGroup',
      label: '黑名单群',
      component: 'GSelectGroup',
      componentProps: { placeholder: '请选择黑名单群' },
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
  ],
}
