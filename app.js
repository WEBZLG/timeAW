const
  AUTH = require('./utils/auth'),
  UTIL = require('./utils/util'),
  Video = require('./components/course-player/controller').Video,
  Audio = require('./components/course-player/controller').Audio,
  USERINFO_SERVICE = require('./service/userInfo.service')

App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  async onLaunch() {

    // 音频实例
    this.globalData.audio = new Audio()

    // 视频实例
    this.globalData.video = new Video()

    // 重置手机倒计时计算
    UTIL.countdown('resetPhoneCountdown').calc()

    try {

      // 验证登录
      await AUTH.loginStatus()

      // 登录
      await USERINFO_SERVICE.login(wx.getStorageSync('userInfo').id)
    } catch (e) {

      console.warn('用户未登录')
    }
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow(options) {

    wx.onMemoryWarning(function () {
      console.log('onMemoryWarningReceive')
    })


    // 标记分享类型
    this.globalData.share.scene = options.scene

    // 公众号进入
    if ([1035].some(item => options.scene == item)) {

      // 获取公众号APPID
      this.globalData.share.appid = options.referrerInfo.appId
    }
    // 其他小程序进入
    else if ([1037].some(item => options.scene == item)) {

      // 获取分享者ID
      if (options.referrerInfo.extraData.share) wx.setStorageSync('share', options.referrerInfo.extraData.share)
    }
    // 普通分享进入
    else if ([1007, 1008, 1011, 1012, 1013, 1096].some(item => options.scene == item)) {

      // 获取分享者ID
      if (options.query.share) wx.setStorageSync('share', options.query.share)

      // 获取进入页面
      if (options.query.path) this.globalData.pages.enter = decodeURIComponent(options.query.path)
    }
    // 小程序码进入
    else if ([1047, 1048, 1049].some(item => options.scene == item)) {

      // 获取参数
      const scene = UTIL.scene(decodeURIComponent(options.query.scene))
      console.log(scene)
      // 获取分享者ID
      if (scene.s) wx.setStorageSync('share', scene.s)

      // 跳转分享页面
      if (scene.p) this.globalData.pages.enter = this.globalData.pages.map[scene.p] + (scene.i ? `?id=${scene.i}` : ``)
    }
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide() {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError(msg) {

  },

  /**
   * 全局变量
   */
  globalData: {
    url: {
      // host: 'https://ctc.chineseglory.cn/index.php', // 主机地址 
      host: 'https://tc.chineseglory.cn'
    }, // 服务地址
    share: {
      scene: '', // 分享类型
      appid: '', // 来自公众号或小程序的APPID
      cover: '', // 封面
      intro: '时间与崇尚学院', // 简介
    }, // 分享参数(分享者ID在本地存储中)
    system: {
      color: '#FF6600',
      logo: '/images/public/logo.png',
      title: '时间与崇尚学院',
      idCode: '6C9B096F76F1891DB84266F8B02554DE',
    }, // 系统信息
    pages: {
      enter: '/pages/home/home', // 进入页面
      auth: '/pages/login/login', // 授权页面
      index: '/pages/home/home', // 首页
      map: {
        'c': '/pages/course-detail/course-detail',
        'l': '/pages/login/login'
      } // 页面映射
    }, // 页面信息
    media: null, // 媒体控制器
    audio: null,
    video: null
  }
})