import path from 'path'
import fs from 'fs'
import { pathToFileURL } from 'url'
import * as CfgAdapter from './guoba_supportxrk.js'
import { globalConfigTab, globalConfigFile } from './guoba_globalxrk.js'
import { serverSchemas } from './guoba_schema_xrk.js'

const root = process.cwd()
const configConstants = await import(pathToFileURL(path.join(root, 'lib/config/config-constants.js')).href)
const { default: loader } = await import(pathToFileURL(path.join(root, 'lib/plugins/loader.js')).href)
const { getServerConfigPath, getGlobalConfigPath } = configConstants
const hasGenshin = fs.existsSync(path.join(root, 'plugins/genshin'))

function resolveGuobaPort() {
  const p = global.serverPort ?? process.argv[3]
  return p != null && p !== '' ? p : null
}

const addGroupPromptProps = CfgAdapter.addGroupPromptProps

// 基础配置
const baseConfig = {
  key: 'base',
  title: '基础配置',
  cards: [
    {
      key: 'system.bot',
      title: '机器人配置',
      desc: '对机器人进行相关配置',
      schemas: [...(CfgAdapter.baseConfig?.bot ?? [])],
    },
    {
      key: 'system.server',
      title: 'server相关配置',
      desc: '对服务器进行相关配置',
      schemas: serverSchemas
    },
    {
      key: 'system.redis',
      title: 'Redis配置',
      desc: '对Redis服务器进行相关配置',
      schemas: [
        {
          field: 'host',
          label: 'Redis地址',
          required: true,
          component: 'Input',
          componentProps: {
            placeholder: '请输入Redis地址',
          },
        },
        {
          field: 'port',
          label: 'Redis端口',
          required: true,
          component: 'InputNumber',
          componentProps: {
            placeholder: '请输入Redis端口',
            min: 1,
            max: 65535,
          },
        },
        {
          field: 'username',
          label: 'Redis用户名',
          bottomHelpMessage: '没有用户名可以为空',
          component: 'Input',
          componentProps: {
            placeholder: '请输入Redis用户名',
          },
        },
        {
          field: 'password',
          label: 'Redis密码',
          bottomHelpMessage: '没有密码可以为空',
          component: 'InputPassword',
          componentProps: {
            placeholder: '请输入Redis密码',
          },
        },
        {
          field: 'db',
          label: 'Redis数据库',
          required: true,
          bottomHelpMessage: '一般不用改',
          component: 'InputNumber',
          componentProps: {
            placeholder: '请输入Redis数据库',
          },
        },
      ],
    },
  ],
}

const groupConfig = () => {
  const funOptions = []
  for (let item of loader.priority) {
    if (item.hasOwnProperty('name') && item.name) {
      if (!funOptions.find(i => i.value === item.name)) {
        funOptions.push({ value: item.name })
      }
    }
  }
  const funComponent = funOptions.length === 0 ? 'GTags' : 'Select'
  return {
    key: 'group',
    title: '群组配置',
    cards: [
      {
        key: 'system.group',
        type: 'keyFormCard',
        // 标题表达式
        title: `{{ form.key === 'default' ? '默认配置' : '群：' + (form?.values?.__GROUP_TIP_TEXT__ ?? form.key) }}`,
        desc: '默认配置对所有群聊生效',
        // 允许添加新的配置
        allowAdd: true,
        allowDel: true,
        // 新增按钮文本（默认“新增”）
        addBtnText: '新增群配置',
        promptProps: addGroupPromptProps,
        schemas: [
          ...(CfgAdapter.groupConfig?.group ?? []),
          {
            field: 'addPrivate',
            label: '私聊添加',
            component: 'Switch',
            bottomHelpMessage: '是否允许私聊添加',
            componentProps: {
              checkedValue: 1,
              unCheckedValue: 0,
            },
          },
          {
            field: 'enable',
            label: '功能白名单',
            component: funComponent,
            bottomHelpMessage: '配置后只有配置的功能才可以使用',
            componentProps: {
              allowAdd: true,
              allowDel: true,
              mode: 'multiple',
              options: funOptions,
            },
          },
          {
            field: 'disable',
            label: '功能黑名单',
            component: funComponent,
            bottomHelpMessage: '配置后配置的功能将不可以使用',
            componentProps: {
              allowAdd: true,
              allowDel: true,
              mode: 'multiple',
              options: funOptions,
            },
          },
        ],
      },
    ],
  }
}

const genshinConfig = {
  key: 'genshin',
  title: '原神配置',
  cards: [
    {
      key: 'genshin.mys.set',
      title: '米游社设置',
      desc: '',
      schemas: [
        {
          field: 'allowUseCookie',
          label: '使用用户ck',
          component: 'Switch',
          bottomHelpMessage: '公共查询是否使用用户ck',
          componentProps: {
            checkedValue: 1,
            unCheckedValue: 0,
          },
        },
        {
          field: 'cookieDoc',
          label: 'ck文档地址',
          component: 'Input',
          bottomHelpMessage: '默认cookie帮助文档链接地址',
          componentProps: {},
        },
        {
          field: 'isAutoSign',
          label: '开启自动签到',
          component: 'Switch',
          bottomHelpMessage: '是否开启米游社原神自动签到',
          componentProps: {
            checkedValue: 1,
            unCheckedValue: 0,
          },
        },
        {
          field: 'signTime',
          label: '签到定时任务',
          component: 'EasyCron',
          bottomHelpMessage: '米游社原神签到定时任务，Cron表达式，默认00:02开始执行，每10s签到一个',
          componentProps: {
            placeholder: '请输入或选择Cron表达式',
          },
        },
        {
          field: 'abbrSetAuth',
          label: '别名权限',
          component: 'RadioGroup',
          bottomHelpMessage: '别名设置权限',
          componentProps: {
            options: [
              { label: '所有群员都可以添加', value: 0 },
              { label: '群主和管理员才能添加', value: 1 },
              { label: '只有主人才能添加', value: 2 },
            ],
          },
        },
      ],
    },
    {
      key: 'genshin.mys.pubCk',
      title: '公共Cookie',
      desc: '米游社公共查询cookie，允许添加多个',
      // 数组form
      type: 'arrayFormCard',
      allowAdd: true,
      allowDel: true,
      addBtnText: '添加Cookie',
      lengthMin: 1,
      schemas: [],
    },
    {
      key: 'genshin.gacha',
      title: `十连配置（{{form.key === 'default' ? '默认' : form.key}}）`,
      desc: '十连次数、概率等相关配置',
      type: 'keyFormCard',
      allowAdd: true,
      allowDel: true,
      addBtnText: '新增群单独配置',
      promptProps: addGroupPromptProps,
      schemas: [
        {
          field: 'count',
          label: '每日抽卡数',
          bottomHelpMessage: '设置每天可以抽多少次',
          component: 'InputNumber',
          componentProps: {
            min: 1,
            placeholder: '请输入每日抽卡数',
          },
        },
        {
          field: 'delMsg',
          label: '自动撤回',
          bottomHelpMessage: '自动撤回未出货的抽卡消息，0-120 秒，0 = 不撤回',
          component: 'InputNumber',
          componentProps: {
            placeholder: '请输入自动撤回时间',
          },
        },
        {
          field: 'LimitSeparate',
          label: '分开计算',
          bottomHelpMessage: '角色池、武器池限制次数是否分开计算',
          component: 'Switch',
          componentProps: {
            checkedValue: 1,
            unCheckedValue: 0,
          },
        },
      ],
    },
  ],
}

const otherConfig = {
  key: 'other',
  title: '其他',
  cards: [
    {
      key: 'system.other',
      title: '其他配置',
      desc: '其他配置',
      schemas: [...(CfgAdapter.otherConfig?.other ?? [])],
    },
  ],
}

export function getConfigTabs() {
  const tabs = [baseConfig, groupConfig(), globalConfigTab]
  if (hasGenshin) tabs.push(genshinConfig)
  tabs.push(otherConfig)
  return tabs
}

export const configFile = {
  'system.bot': getServerConfigPath(resolveGuobaPort(), 'bot'),
  'system.group': getServerConfigPath(resolveGuobaPort(), 'group'),
  'system.redis': getGlobalConfigPath('redis'),
  'system.other': getServerConfigPath(resolveGuobaPort(), 'other'),
  'system.server': getServerConfigPath(resolveGuobaPort(), 'server'),
  ...globalConfigFile,

  'genshin.gacha': '/plugins/genshin/config/gacha.set.yaml',
  'genshin.mys.pubCk': '/plugins/genshin/config/mys.pubCk.yaml',
  'genshin.mys.set': '/plugins/genshin/config/mys.set.yaml',
  'genshin.role.name': '/plugins/genshin/config/role.name.yaml',
}