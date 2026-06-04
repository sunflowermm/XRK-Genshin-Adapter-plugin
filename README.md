# XRK-Genshin-Adapter-Plugin

锅巴配置同步插件。米游社 `e.runtime`（`getMysApi`、`NoteUser` 等）与星铁/绝区零前缀由本体 `lib/plugins/runtime.js`、`lib/plugins/loader.js` 按 TRSS-Yunzai 对齐实现。

## 功能

- **锅巴配置同步**：`#锅巴登录` 将 `conponents/` 下三个模板写入 `guoba-plugin/server/service/v3/config/model/`（`useConfig.js`、`guoba_supportxrk.js`、`guoba_globalxrk.js`；兼容旧版时同步 `useMiaoConfig.js`）。
- **XRK 全量字段**：端口级 `bot` / `group` / `other` / `server`、全局 `redis` / `device` / `monitor` / `notice` / `db` / `aistream`，路径与 `lib/config/config-constants.js` 一致。
- **向日葵插件**：在 `plugins/XRK-plugin/guoba.support.js` 中声明 `supportGuoba()`，由锅巴自动扫描；勿在适配器里重复写向日葵配置。

## 依赖

- [guoba-plugin](https://github.com/guoba-yunzai/guoba-plugin)（锅巴面板；未安装时 `#锅巴登录` 会提示改用 XRK 控制台 `/xrk`）
- 原神插件（可选）：`plugins/genshin` 存在时锅巴显示「原神配置」页

## 安装

在 **XRK-Yunzai** 内发送「向日葵妈咪妈咪哄」或「#向日葵妈咪妈咪哄」安装/更新本插件与 XRK-plugin。装完后重启 Bot，再发 **#锅巴登录** 同步锅巴模板。

## 使用

| 命令 | 说明 |
|------|------|
| `#锅巴登录` | 按当前端口写入锅巴配置模型，需重启后生效 |
| XRK 控制台 | 未装锅巴时，在 Web `/xrk` 编辑与 CommonConfig 相同的 YAML |

## 目录结构

```
XRK-Genshin-Adapter-plugin/
├── apps/guoba.js              # #锅巴登录
├── conponents/
│   ├── guoba_common.js        # 锅巴主模板（tabs + configFile）
│   ├── guoba_supportxrk.js    # bot/group/other 扩展字段
│   └── guoba_globalxrk.js     # 全局配置 tab
└── index.js
```

## 许可证

MIT License
