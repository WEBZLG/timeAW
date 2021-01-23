const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  SHARE_SERVICE = require('../../service/share.service'),
  USERINFO_SERVICE = require('../../service/userInfo.service'),
  LEVEL_SERVICE = require('../../service/system.service')


/**
 * 分享
 * 陈浩 2019/7/16
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainCourse: false, // 时间与崇尚主营课
    tag: {
      list: [], // 列表
      index: 0 // 选中
    }, // 标签
  },

  /**
   * 动态发布
   */
  async postShare() {

    try {

      // 显示加载
      wx.showLoading({
        mask: true,
      })

      // 验证登录
      await AUTH.loginStatus()

      // 获取分享权限
      const share = await USERINFO_SERVICE.share(wx.getStorageSync('userInfo').id)

      // 验证权限
      UTIL.check(share.data, 'group:fail')

      // 跳转
      wx.navigateTo({
        url: '/pages/share-post/share-post',
      })
    } catch (e) {

      if (e.message == 'login:fail') {

        // 跳转登录
        wx.navigateTo({
          url: getApp().globalData.pages.auth,
        })
      } else if (e.message == 'group:fail') {

        // 打开弹窗（用户级别不够）
        this.selectComponent('#form-failed').open()
      } else {

        // 提示
        wx.showModal({
          content: e.message,
          showCancel: false
        })
      }
    } finally {

      // 隐藏加载
      wx.hideLoading()
    }
  },

  /**
   * tab更改
   */
  tabChange(e) {
    this.selectAllComponents('.share-list')[e.detail.contentIndex].init()
  },

  /**
   * 关闭弹窗
   */
  closePopup() {
    this.selectAllComponents('.form-popup').forEach(item => item.close())
  },

  /**
   * 获取初始数据
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    // 设置状态
    container.status('init')

    try {

      // 获取分类标签
      const result = await SHARE_SERVICE.tag()

      // 设置数据
      this.setData({
        mainCourse: getApp().globalData.system.maincourse == 1, // 时间与崇尚主营课
        'tag.list': result.data
      })

      // 设置状态
      container.status('default')

      // tab初始化
      this.selectComponent('#tab').init()
    } catch (e) {

      // 设置状态
      container.status('error', e.message)
    }
  },
   initnew() {
    
    // 获取容器
    const container = this.selectComponent('#container')

    try {
    

      // 请求队列
      const request = [HOME_SERVICE.detail(wx.getStorageSync('userInfo').id), SYSTEM_SERVICE.get()]

      try {

        // 判断登录
         AUTH.loginStatus()

        // 获取用户信息
        request.push(USERINFO_SERVICE.get(wx.getStorageSync('userInfo').id))
      } catch (e) {

        // 警告信息
        console.warn('用户未登录')
      }

      // 获取数据
      const [result, system] =  Promise.all(request)

      // 获取系统信息
      system.data.forEach(item => {
        getApp().globalData.system[item.name] = item.value
      })

      // getApp().globalData.system.maincourse = 1

      // 设置数据
      this.setData({
        mainCourse: getApp().globalData.system.maincourse == 1,
        'swiper.list': result.data.banner,
        'nav.list': result.data.nav,
        panel: result.data.list,
        groupId: wx.getStorageSync('userInfo').group_id||''
      })
      // console.log(this.data.groupId)

      // 
      if (getApp().globalData.system.maincourse == 1) {

        // 设置状态
        container.status('default')
      } else {
        setTimeout(() => {
          // 切换tab
          wx.switchTab({
            url: '/pages/share/share',
          })
        }, 1000);
      }
    } catch (e) {

      // 设置状态
      container.status('error', e.message)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // 获取初始数据
    this.init()
        // 隐藏TAB
        wx.hideTabBar()

        // 初始化数据
       this.initnew()
    
        // 主营课
        if (getApp().globalData.system.maincourse == 1) {
    
          // 显示TAB
          wx.showTabBar()
        }
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
     let value = JSON.parse(wx.getStorageSync('a'))
     if(value) {
       wx.getStorageSync('a',JSON.parse(true))
       return
     }
    } catch (error) {
      
    }
    this.init()
    try {

      // 验证登录
      await AUTH.loginStatus()

      // 获取信息
      UTIL.message()

      // 控制等级
      LEVEL_SERVICE.levelControl(wx.getStorageSync('userInfo').id)
    } catch (e) { }
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

    // 初始化数据
    await this.selectAllComponents('.share-list')[this.selectComponent('#tab').index().contentIndex].init()

    // 停止下拉
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.selectAllComponents('.share-list')[this.selectComponent('#tab').index().contentIndex].onReachBottom()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(ops) {
    let title = ''
    if(ops.from == 'button') {
      title = ops.target.dataset.content
    }
    console.log(ops)
    var shareObj = {
      title: title,        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/share/share',        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      }
    };
    // 来自页面内的按钮的转发
    // 　　if( options.from == 'button' ){
    // 　　　　var eData = options.target.dataset;
    // 　　　　console.log( eData.name );     // shareBtn
    // 　　　　// 此处可以修改 shareObj 中的内容
    // 　　　　shareObj.path = '/pages/btnname/btnname?btn_name='+eData.name;
    // 　　}
    // 返回shareObj
    return shareObj;
  }
})