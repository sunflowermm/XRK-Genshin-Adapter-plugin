/**
 * 原神游戏运行时扩展
 */
import lodash from "lodash"

let gsCfg, MysApi, MysInfo, NoteUser, MysUser, Version

// 动态导入原神相关模块
async function loadGenshinModules() {
  try {
    gsCfg = (await import("../../genshin/model/gsCfg.js")).default
    MysApi = (await import("../../genshin/model/mys/mysApi.js")).default
    MysInfo = (await import("../../genshin/model/mys/mysInfo.js")).default
    NoteUser = (await import("../../genshin/model/mys/NoteUser.js")).default
    MysUser = (await import("../../genshin/model/mys/MysUser.js")).default

    try {
      Version = (await import("#miao")).Version
    } catch {
    }
    
    return true
  } catch (error) {
    logger.error(`[GenshinExtension] 加载原神模块失败: ${error.message}`)
    return false
  }
}

/**
 * 原神游戏扩展类
 */
export default class GenshinExtension {
  constructor(e, runtime) {
    this.e = e
    this.runtime = runtime
    this._mysInfo = {}
    this.modulesLoaded = false
  }

  /**
   * 初始化
   */
  async init() {
    // 确保模块已加载
    if (!this.modulesLoaded) {
      this.modulesLoaded = await loadGenshinModules()
    }
    
    if (this.modulesLoaded && NoteUser) {
      await this.initUser()
    }
  }

  /**
   * 静态缓存初始化
   */
  static async initCache() {
    const loaded = await loadGenshinModules()
    if (loaded && MysInfo?.initCache) {
      await MysInfo.initCache()
    }
  }

  get uid() {
    return this.user?.uid
  }

  get hasCk() {
    return this.user?.hasCk
  }

  get user() {
    return this.e.user
  }

  get gsCfg() {
    return gsCfg
  }

  get MysInfo() {
    return MysInfo
  }

  get NoteUser() {
    return NoteUser
  }

  get MysUser() {
    return MysUser
  }

  /**
   * 初始化用户
   */
  async initUser() {
    if (!NoteUser) return
    
    let e = this.e
    let user = await NoteUser.create(e)
    
    if (user) {
      e.user = new Proxy(user, {
        get(self, key, receiver) {
          let game = e.game
          let fnMap = {
            uid: "getUid",
            uidList: "getUidList",
            mysUser: "getMysUser",
            ckUidList: "getCkUidList"
          }
          
          if (fnMap[key]) {
            return self[fnMap[key]](game)
          }
          
          if (key === "uidData") {
            return self.getUidData("", game)
          }
          
          if (["getUid", "getUidList", "getMysUser", "getCkUidList", "getUidMapList", "getGameDs"].includes(key)) {
            return (_game, arg2) => {
              return self[key](_game || game, arg2)
            }
          }
          
          if (["getUidData", "hasUid", "addRegUid", "delRegUid", "setMainUid"].includes(key)) {
            return (uid, _game = "") => {
              return self[key](uid, _game || game)
            }
          }
          
          return self[key]
        }
      })
    }
  }

  /**
   * 获取MysInfo实例
   * @param targetType all: 所有用户均可， cookie：查询用户必须具备Cookie
   * @returns {Promise<boolean|MysInfo>}
   */
  async getMysInfo(targetType = "all") {
    if (!MysInfo) return false
    
    if (!this._mysInfo[targetType]) {
      this._mysInfo[targetType] = await MysInfo.init(this.e, targetType === "cookie" ? "detail" : "roleIndex")
    }
    return this._mysInfo[targetType]
  }

  /**
   * 获取UID
   */
  async getUid() {
    if (!MysInfo) return false
    return await MysInfo.getUid(this.e)
  }

  /**
   * 获取MysApi实例
   * @param targetType all: 所有用户均可， cookie：查询用户必须具备Cookie
   * @param option MysApi option
   * @param isSr 是否为星穹铁道
   * @returns {Promise<boolean|MysApi>}
   */
  async getMysApi(targetType = "all", option = {}, isSr = false) {
    if (!MysApi) return false
    
    let mys = await this.getMysInfo(targetType)
    if (mys.uid && mys?.ckInfo?.ck) {
      if (isSr) option.game = "sr"
      return new MysApi(mys.uid, mys.ckInfo.ck, option)
    }
    return false
  }

  /**
   * 生成MysApi实例
   * @param uid
   * @param ck
   * @param option
   * @param isSr 是否为星穹铁道
   * @returns {MysApi}
   */
  createMysApi(uid, ck, option, isSr = false) {
    if (!MysApi) return null
    
    if (isSr) option.game = "sr"
    return new MysApi(uid, ck, option)
  }

  /**
   * 增强渲染数据（用于miao-plugin兼容）
   */
  async enhanceRenderData(data, plugin, path) {
    // 计算miao相关路径
    let paths = lodash.filter(path.split("/"), (p) => !!p)
    let miaoResPath = `../../../${lodash.repeat("../", paths.length)}plugins/miao-plugin/resources/`
    const layoutPath = process.cwd() + "/plugins/miao-plugin/resources/common/layout/"
    
    return {
      ...data,
      /** miao 相关参数 **/
      copyright: Version ? `Created By TRSS-Yunzai<span class="version">${Version.yunzai}</span> ` : '',
      _miao_path: miaoResPath,
      _tpl_path: process.cwd() + "/plugins/miao-plugin/resources/common/tpl/",
      defaultLayout: layoutPath + "default.html",
      elemLayout: layoutPath + "elem.html"
    }
  }
}

/**
 * 创建向后兼容的代理
 * 使得 e.runtime 可以直接访问原神扩展的属性
 */
export function createCompatibilityProxy(runtime) {
  return new Proxy(runtime, {
    get(target, prop) {
      // 先检查runtime自身的属性
      if (prop in target) {
        return target[prop]
      }
      
      // 再检查game扩展的属性
      const gameExt = target.getExtension('game')
      if (gameExt && prop in gameExt) {
        // 如果是方法，绑定正确的this
        const value = gameExt[prop]
        if (typeof value === 'function') {
          return value.bind(gameExt)
        }
        return value
      }
      
      return undefined
    }
  })
}