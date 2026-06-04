# XRK-Genshin-Adapter-Plugin

原神相关功能与锅巴配置的 XRK-Yunzai 适配插件，提供 Runtime 游戏扩展与锅巴配置同步。

## 功能

- **Runtime 游戏扩展**：注册原神相关扩展（`game`），将 `getMysApi` / `NoteUser` 等 TRSS 能力挂到 `e.runtime`。
- **多游戏前缀**：星铁（`*`/`#星铁` 等）、绝区零（`%`/`#绝区零` 等）由本体 `loader` 在 `Runtime.init` 前标准化，并设置 `e.game` / `e.isSr` / `e.isZzz`。
- **锅巴配置同步**：`#锅巴登录` 将本插件内的锅巴配置模板同步到 `guoba-plugin` 的配置模型中。

## 依赖

- [guoba-plugin](https://github.com/guoba-yunzai/guoba-plugin)（锅巴面板）
- 原神插件（如 [genshin](https://github.com/yoimiya-kokomi/miao-plugin) 相关能力），需安装在 `plugins/genshin` 或通过 `#guoba.adapter` 等提供 `hasGenshin`、`isTRSS`。

## 安装

在 **XRK-Yunzai** 项目内发送「向日葵妈咪妈咪哄」或「#向日葵妈咪妈咪哄」自动下载/更新本插件及向日葵插件（GitCode 失败会切 GitHub）。QQ 需主人权限；终端/stdin、Web 控制台、API 默认主人。不单独打依赖，用本体即可。装完重启 Bot。

## 使用

- 发送 **#锅巴登录**：根据当前 Bot 账号与端口，将本插件的锅巴配置模板写入锅巴插件的配置模型，写入后需重启 Bot 生效。
- 原神扩展由 Runtime 自动注册，无需单独指令。

## 目录结构

```
XRK-Genshin-Adapter-plugin/
├── apps/
│   ├── guoba.js        # 锅巴配置应用（#锅巴登录）
│   └── Genshin.js      # 原神 Runtime 扩展（NoteUser / MysApi）
├── conponents/
│   ├── guoba_common.js    # 锅巴配置模板（基础/群组/原神等）
│   └── guoba_supportxrk.js
├── index.js
├── package.json
├── README.md
└── LICENSE
```

## 配置

原神相关配置在锅巴面板中操作，包括米游社 Cookie、十连、签到等。配置写入路径依赖锅巴插件与 `data/server_bots/<port>/` 下的 YAML 文件。

## 许可证

MIT License，见 [LICENSE](./LICENSE) 文件。
