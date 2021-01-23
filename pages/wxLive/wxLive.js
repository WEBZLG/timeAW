const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  LIVE_SERVICE = require('../../service/live.service'),
  POSTER_SERVICE = require('../../service/poster.service')
let PAGE = 1
/**
 * 直播主页
 * 2020/9/28
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    live: {
      list: [] // 列表
    }, // 直播
    poster: {
      options: {},
      params: []
    },
    isOpen:true//直播开关
  },

  /**
   * 申请直播权限
   */
  async applicationAuthority() {

    try {

      // 加载
      wx.showLoading({
        mask: true,
      })

      // 获取权限
      const auth = await LIVE_SERVICE.auth(wx.getStorageSync('userInfo').id)

      // 判断权限
      if (auth.data.result == 4) {
        wx.navigateTo({
          url: '/wxLive/pages/applicationAuthority/applicationAuthority',
          events: {
            init: () => {
              this.init()
            }
          }
        })
      } else if (auth.data.result == 0) {
        wx.showModal({
          content: '您已提交申请，请等待审核',
          showCancel: false
        })
      } else if (auth.data.result == 1) {
        wx.showModal({
          content: '直播权限已审核通过，可申请直播场次哦！',
          showCancel: false
        })
      } else if (auth.data.result == 2) {
        wx.showModal({
          content: `直播权限审核失败，${auth.data.note}`,
          showCancel: false,
          success: (res) => {
            wx.navigateTo({
              url: '/wxLive/pages/applicationAuthority/applicationAuthority',
            })
          }
        })
      } else if (auth.data.result == 6) {
        wx.showModal({
          content: '直播权限已审核通过，可申请直播场次哦！',
          showCancel: false
        })
      } else if (auth.data.result == 7) {
        wx.showModal({
          content: `直播权限已审核通过，可申请直播场次哦！`,
          showCancel: false
        })
      }
    } catch (e) {
      wx.showModal({
        content: e.message,
        showCancel: false
      })
    } finally {
      wx.hideLoading()
    }
  },

  /**
   * 申请直播场次
   */
  async applicationSession() {

    try {

      // 加载
      wx.showLoading({
        mask: true,
      })

      // 获取权限
      const auth = await LIVE_SERVICE.auth(wx.getStorageSync('userInfo').id)

      // 判断权限
      if (auth.data.result == 0) {
        wx.showModal({
          content: `直播权限审核中，请耐心等待`,
          showCancel: false,
        })
      } else if (auth.data.result == 1) {
        wx.navigateTo({
          url: '/wxLive/pages/applicationSession/applicationSession'
        })
      } else if (auth.data.result == 2) {
        wx.showModal({
          content: `直播权限审核失败，${auth.data.note}`,
          showCancel: false,
          success: (res) => {
            wx.navigateTo({
              url: '/wxLive/pages/applicationAuthority/applicationAuthority',
            })
          }
        })
      } else if (auth.data.result == 4) {
        wx.showModal({
          content: `请选申请直播权限`,
          showCancel: false
        })
      } else if (auth.data.result == 6) {
        wx.showModal({
          content: `直播场次审核中，请耐心等待`,
          showCancel: false,
        })
      } else if (auth.data.result == 7) {
        wx.showModal({
          content: `直播场次审核失败，${auth.data.note}`,
          success: (res) => {
            wx.navigateTo({
              url: '/wxLive/pages/applicationSession/applicationSession',
            })
          }
        })
      }
    } catch (e) {
      wx.showModal({
        content: e.message,
        showCancel: false
      })
    } finally {
      wx.hideLoading()
    }
  },

  /**
   * 分享海报
   */
  poster() {
    this.selectComponent("#poster").open()
    wx.nextTick(() => {
      this.selectComponent(".poster-detail").draw()
    })
  },

  /**
   * 初始化数据
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 获取数据
      const [result, qrcode, poster] = await Promise.all([LIVE_SERVICE.list(1), LIVE_SERVICE.qrcode(), POSTER_SERVICE.live()])

      // 设置数据
      this.setData({
        'live.list': result.data
      })

      PAGE = 1

      this.setData({
        poster: {
          options: {
            width: `${UTIL.rpx(1500)}px`,
            height: `${UTIL.rpx(2662)}px`
          },
          params: [{
            type: 'image',
            src: poster.data.shareimage,
            sx: 0,
            sy: 0,
            sWidth: UTIL.rpx(1500),
            mode: 'poster'
          }, {
            type: 'image',
            src: wx.getStorageSync('userInfo').avatar,
            sx: UTIL.rpx(110),
            sy: UTIL.rpx(2090),
            sWidth: UTIL.rpx(110),
            sHeight: UTIL.rpx(110)
          }, {
            type: 'image',
            src: qrcode.data,
            sx: UTIL.rpx(990),
            sy: UTIL.rpx(2130),
            sWidth: UTIL.rpx(320),
            sHeight: UTIL.rpx(320)
          }, {
            type: 'text',
            sx: UTIL.rpx(248),
            sy: UTIL.rpx(2116),
            fontSize: UTIL.rpx(64),
            baseline: 'top',
            content: wx.getStorageSync('userInfo').nickname,
          }]
        }
      })

      // 设置状态
      if (result.data.length <= 0) container.status('default')
      else container.status(result.data.length < 5 ? 'complete' : 'canload')
    } catch (e) {

      // 设置状态
      container.status('error', e.message)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    try {
      const result = await LIVE_SERVICE.changer()

      if(result.data=='0'){
        this.setData({
          isOpen:false
        })
        return false;
      }else{
        this.setData({
          isOpen:true
        })
      }
      // 验证登录
      await AUTH.loginStatus()
      // 获取信息
      UTIL.message()
      // 初始化数据
      this.init()
    } catch (e) {

      if (e.message == 'login:fail') {

        setTimeout(() => {
          // 跳转登录
          wx.reLaunch({
            url: getApp().globalData.pages.auth+'?type=live',
          })
        }, 0);
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {

    await this.init()

    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {

    // 获取容器
    const container = this.selectComponent('#container')

    // 判断加载
    if (container.status() != 'canload') return

    try {

      // 设置状态
      container.status('loading')

      // 获取数据
      const result = await LIVE_SERVICE.list(PAGE + 1)

      // 设置数据
      this.setData({
        'live.list': this.data.live.list.concat(result.data)
      })

      // 设置页号
      PAGE++

      // 设置状态
      container.status(result.data.length > 0 ? 'canload' : 'complete')
    } catch (e) {

      // 设置状态
      container.status('error', e.message)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(e) {

    if (e.from == "button") {

      // 分享
      return UTIL.share({
        intro: e.target.dataset.detail.name,
        cover: e.target.dataset.detail.share_img,
        path: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${e.target.dataset.detail.roomid}`
      })
    } else {

      // 分享
      return UTIL.share()
    }
  }
})