const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  POSTER_SERVICE = require('../../service/poster.service'),
  COURSE_SERVICE = require('../../service/course.service'),
  USERINFO_SERVICE = require('../../service/userInfo.service')
let OPTIONS

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poster: {
      list: [], // 列表
      current: '', // 连接
    }, // 海报
  },

  /**
   * 保存海报
   */
  async savePoster(e) {

    try {

      // 获取下标
      const index = this.selectComponent('#tab').index().contentIndex

      // 获取详情
      const detail = this.selectAllComponents('.poster-detail')[index].selectComponent('.container')

      // 如果正在加载，则不允许保存
      if (detail.status() == 'init') return

      // 显示加载
      wx.showLoading({
        mask: true,
      })

      // 获取图片信息
      const image = this.data.poster.current

      // 获取权限
      const result = await AUTH.getAuth('writePhotosAlbum')

      // 获取文件路径
      const filePath = await UTIL.downloadFile(image)

      // 保存文件
      await UTIL.saveImageToPhotosAlbum(filePath.tempFilePath)

      // 隐藏加载
      wx.hideLoading()

      // 提示
      wx.showToast({
        title: '下载成功',
      })
    } catch (e) {

      // 隐藏加载
      wx.hideLoading()

      if (e.message == 'writePhotosAlbum:reject') {

        // 如果未授权
        wx.showModal({
          content: '未授权保存权限',
          confirmText: '授权',
          success: res => {
            if (res.confirm) wx.openSetting()
          },
        })
      } else {

        // 接口报错
        wx.showModal({
          content: e.message,
          showCancel: false,
        })
      }
    }
  },

  /**
   * tab更改
   */
  tabChange(e) {
    console.log(e)
    // 获取参数
    const data = this.data.poster.list[e.detail.contentIndex]

    // 初始化数据
    this.selectAllComponents('.poster-detail')[e.detail.contentIndex].init(OPTIONS.type, data)
  },

  /**
   * 获取海报
   */
  getPoster(e) {
    
    // 设置数据
    this.setData({
      'poster.current': e.detail
    })
  },

  /**
   * 初始化数据
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 检测登录
      await AUTH.loginStatus()

      // 设置模式
      const mode = {
        invite: async() => {

          // 获取数据
          const data = (await POSTER_SERVICE.list()).data

          // 返回数据
          return data.reduce((invite, item) => {
            invite.push({
              id: item.id,
              background: item.poster_image,
            })
            return invite
          }, [])
        }, // 邀请海报
        course: async() => {

          // 获取数据
          const data = (await COURSE_SERVICE.get(OPTIONS.id, wx.getStorageSync('userInfo').id)).data.course

          // 返回数据
          return data.poster.reduce((course, item) => {
            course.push({
              id: data.id,
              title: data.name,
              cover: data.thumb,
              type: item.type,
              background: item.thumb,
            })
            return course
          }, [])
        }, // 课程海报
        userInfo: async() => {

          // 获取数据
          const data = (await USERINFO_SERVICE.poster()).data

          // 返回数据
          return data.reduce((userInfo, item) => {
            userInfo.push({
              id: item.id,
              background: item.thumb,
            })
            return userInfo
          }, [])
        } // 用户海报
      }

      // 设置数据
      this.setData({
        'poster.list': await mode[OPTIONS.type]()
      })

      // 设置状态
      container.status('default')

      // 初始化tab
      // this.selectComponent('#tab').init()
      this.selectAllComponents('.poster-detail')[0].init(OPTIONS.type, this.data.poster.list[0])
    } catch (e) {

      if (e.message == 'login:fail') {

        // 跳转登录
        wx.redirectTo({
          url: getApp().globalData.pages.auth,
        })
      } else {

        // 设置状态
        container.status('error', e.message)
      }
    }
       
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // 设置参数
    OPTIONS = options

    // 初始化数据
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

    // 分享
    return UTIL.share()
  }
})