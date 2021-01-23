const
  UTIL = require('../../utils/util'),
  OBSERVE = require('../../utils/observe'),
  AUTH = require('../../utils/auth'),
  USERINFO_SERVICE = require('../../service/userInfo.service'),
  LEVEL_SERVICE = require('../../service/system.service')
  
/**
 * 我的页面
 * 陈浩 2019/11/30
 * 于家辉 2019/11/30
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:'',
    userInfo: {}, // 用户信息
    mainCourse: false, // 公开课
    buttons: {},
    tenBig: null, // 十大权益
    menu: {
      user: [{
        title: '成长计划',
        content: '-',
        field: 'login_times',
        url: '/pages/poster/poster?type=userInfo'
      }, {
        title: '我的关注',
        content: '-',
        field: 'attention',
        url: '/pages/follow/follow'
      }, {
        title: '我的课程',
        content: '-',
        field: 'my_course',
        url: '/pages/course-own/course-own'
      }], // 用户
      block: [{
        title: '我的钱包',
        icon: '/images/mine/package.png',
        red_dot: 0,
        // event: 'dean',
        url: '/pages/profit/profit'
      },{
        title: '卡包管理',
        icon: '/images/mine/stock.png',
        red_dot: 0,
        event: 'stock',
      }, {
        title: '课程门票',
        icon: '/images/mine/ticket.png',
        red_dot: 0,
        // event: 'piece'
        // url: '/offline/pages/offline-ticket/offline-ticke'
        url: '/offline/pages/offline-ticket/offline-ticket'
      },{
        title: '邀请同学',
        icon: '/images/mine/invitation.png',
        red_dot: 0,
        url: '/pages/poster/poster?type=invite'
      }], 
      // 板块
      vertical: [{
        title: '我的收藏',
        icon: '/images/mine/material.png',
        url: '/pages/material/material'
      }, 
      {
        title: '优选商品',
        icon: '/images/mine/optimization.png',
        // url: '/shopping/pages/commodity-list/commodity-list',
        event: 'select',
        mainCourse: true
      }, 
        // 新增2020.10.28
        // {
        //   title: '优选商品',
        //   icon: '/images/mine/optimization.png',
        //   url: '/shopping/pages/supply-chain/supply-chain',
        //   mainCourse: true
        // }, 
        {
          title: '购物车',
          icon: '/images/mine/cart.png',
          // url: '/shopping/pages/shopping-cart/shopping-cart',
          event:'cartSelect',
          mainCourse: true
        }, 
      {
        title: '我的订单',
        icon: '/images/mine/order.png',
        // url: '/pages/my-order/my-order',
        // url: '/shopping/pages/my-order/my-order',
        event:'orderSelect',
        mainCourse: true
      }, 



      // {
      //   title: '收益明细',
      //   icon: '/images/mine/profit.png',
      //   url: '/pages/profit/profit',
      //   mainCourse: true
      // }, 
      {
        title: '我的想学',
        icon: '/images/mine/wish.png',
        url: '/pages/wish/wish'
      }, {
        title: '我的拼课',
        icon: '/images/mine/mine-piece.png',
        event: 'piece',
        mainCourse: true
      }, 
      // {
      //   title: '线下课门票',
      //   icon: '/images/mine/mine-offlineCourse.png',
      //   // url: '/pages/mine-offlineCourse/mine-offlineCourse',
      //   url: '/offline/pages/offline-ticket/offline-ticket',
      //   mainCourse: true
      // }, 
      {
        title: '地址管理',
        icon: '/images/mine/address.png',
        url: '/pages/address/address',
        mainCourse: true
      }, {
        title: '在线客服',
        icon: '/images/mine/service.png',
        // openType: 'contact'
        url: '/pages/online/online',
        mainCourse: true
      }, {
        title: '扫一扫',
        icon: '/images/mine/scanner.png',
        event: 'getScancode',
        hide: true
      }] // 垂直
    } // 菜单
  },

  /**
   * 扫一扫
   */
  async getScancode() {
    const that = this;
    // 弹窗提示
    wx.showModal({
      content: '是否开启扫一扫功能',
      async success(res) {
        if (res.confirm) {
          try {
            const result = await USERINFO_SERVICE.check(wx.getStorageSync('userInfo').id)

            // 点击确认 开启扫一扫
            wx.scanCode({
              // 只允许相机扫码
              onlyFromCamera: true,
              async success(res) {

                // 获取二维码参数
                let result = res.result;
                console.log(result)

                // 通过 & 分割
                const strs = result.split("&");

                // 新数组 存课程id 分享者id 密码
                var obj = [];
                for (let i = 0; i < strs.length; i++) {
                  // 获取index为1 的str
                  let str = strs[i].toString()
                  // 取 = 后的参数
                  let index = str.lastIndexOf("\=");
                  // 获取到参数
                  let needs = str.substring(index + 1, str.length);
                  // 添加数组
                  obj.push(needs)
                }
                console.log(obj)

                // 密码正确
                if (obj[3] == "cm123456") {

                  try {
                    // 核销接口
                    // const result = await USERINFO_SERVICE.ver(wx.getStorageSync('userInfo').id, obj[3] == 'online' ? obj[1] : '', obj[3] == 'downline' ? obj[1] : '', obj[0])

                    // 2020/09/04 修改 核销接口新加参数time_id obj[1]
                    const result = await USERINFO_SERVICE.ver(wx.getStorageSync('userInfo').id, obj[4] === 'online' ? obj[2] : '', obj[4] === 'downline' ? obj[2] : '', obj[0], obj[1])
                    // 弹出信息
                    wx.showModal({
                      content: result.msg,
                      showCancel: false,
                    })
                  } catch (e) {
                    wx.showModal({
                      content: e.message,
                      showCancel: false,
                    })
                  }
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '核销失败, 二维码格式错误',
                    showCancel: false,
                  })
                }
              }
            })
          } catch (e) {
            wx.showModal({
              content: e.message,
              showCancel: false,
            })
          }
        }
      }
    })
  },

  /**
   * 卡包管理
   */
  stock(e) {

    try {

      // 获取参数
      const {
        userInfo,
      } = this.data

      // 验证
      UTIL.check(userInfo, 'login:fail')
      UTIL.check(userInfo.group_id >= 3, '您暂无权限')

      // 跳转
      wx.navigateTo({
        url: '/pages/stock/stock'
      })
    } catch (e) {

      if (e.message == 'login:fail') {

        // 跳转登录
        wx.navigateTo({
          url: getApp().globalData.pages.auth
        })
      } else {

        // 提示
        wx.showToast({
          title: e.message,
          image: '/images/public/lock.png'
        })
      }
    }
  },

  // 十大权益跳哪？
  jumpWhere() {
    // 1跳十大权益
    if(this.data.tenBig == '1') {
      wx.navigateTo({
        url: '/pages/privilege/privilege',
      })
    } else {
      wx.navigateTo({
        url: '/pages/vip/vip',
      })
    }
  },
  // 跳转立即提现
  jumpImmediately() {
    try {

      // 获取参数
      const {
        userInfo,
      } = this.data

      // 验证
      UTIL.check(userInfo, 'login:fail')
      UTIL.check(userInfo.group_id >= 3, '您暂无权限')

      // 去app提现
      wx.showToast({
        title: '请去App提现',
        icon: 'none',
        duration: 2000
      })
    } catch (e) {

      if (e.message == 'login:fail') {

        // 跳转登录
        wx.navigateTo({
          url: getApp().globalData.pages.auth
        })
      } else {

        // 提示
        wx.showToast({
          title: e.message,
          image: '/images/public/lock.png'
        })
      }
    }
  },
  // 跳转提现记录
  jumpRecord() { 
    try {

      // 获取参数
      const {
        userInfo,
      } = this.data

      // 验证
      UTIL.check(userInfo, 'login:fail')
      UTIL.check(userInfo.group_id >= 3, '您暂无权限')

      // 跳转
      wx.navigateTo({
        url: '/pages/record/record'
      })
    } catch (e) {

      if (e.message == 'login:fail') {

        // 跳转登录
        wx.navigateTo({
          url: getApp().globalData.pages.auth
        })
      } else {

        // 提示
        wx.showToast({
          title: e.message,
          image: '/images/public/lock.png'
        })
      }
    }
  },

  /**
   * 发起拼课
   */
  piece() {
    wx.showToast({
      title: '即将开放',
      image: '/images/public/coming-soon.png'
    })
  },

  /**
   * 优选商品
   */
  select() {
    // 1开 0关
    const isShow = this.data.buttons.button4 == 1
    if(isShow) {
      wx.navigateTo({
        url: '/shopping/pages/supply-chain/supply-chain',
      })
    } else {
      wx.showToast({
        title: '即将开放',
        image: '/images/public/coming-soon.png'
      })
    }
  },
  cartSelect() {
    // 1开 0关
    const isShow = this.data.buttons.button4 == 1
    if(isShow) {
      wx.navigateTo({
        url: '/shopping/pages/shopping-cart/shopping-cart',
      })
    } else {
      wx.showToast({
        title: '即将开放',
        image: '/images/public/coming-soon.png'
      })
    }
  },
  orderSelect() {
    // 1开 0关
    const isShow = this.data.buttons.button4 == 1
    if(isShow) {
      wx.navigateTo({
        url: '/shopping/pages/my-order/my-order',
      })
    } else {
      wx.showToast({
        title: '即将开放',
        image: '/images/public/coming-soon.png'
      })
    }
  },
  
  /**
   * 院长专属
   */
  dean() {
    wx.showToast({
      title: '即将开放',
      image: '/images/public/coming-soon.png'
    })
  },

  /**
   * 初始化信息
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 设置数据
      this.setData({
        mainCourse: getApp().globalData.system.maincourse == 1
      })

      // 验证登录
      await AUTH.loginStatus()

      try {

        // 获取用户信息
        const result = await USERINFO_SERVICE.get(wx.getStorageSync('userInfo').id)
        this.setData({
          userInfo: result.data
        })

        // 优选商品
        const buttonResult = await LEVEL_SERVICE.showButton()
        console.log(buttonResult)
        this.setData({
          buttons: buttonResult.data
        })

        // 控制十大权益跳转
        const res = await LEVEL_SERVICE.controlTenBig()
        console.log(res)
        this.setData({
          tenBig: res.data
        })

        // 设置状态
        container.status('default')
      } catch (e) {

        // 设置状态
        container.status('error')
      }
    } catch (e) {

      // 判断登录
      if (e.message == 'login:fail') {

        // 获取菜单信息
        const menu = this.data.menu

        // 设置用户信息
        menu.user.forEach(item => item.content = '-')

        // 设置卡包管理未读
        menu.block.forEach(item => item.unread = 0)

        // 设置扫一扫
        menu.vertical[menu.vertical.findIndex(item => item.event == 'getScancode')].hide = true

        // 设置数据
        this.setData({
          userInfo: {},
          menu
        })
      }

      // 设置状态
      container.status('default')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    // 订阅用户信息
    OBSERVE.subscribe('userInfo', userInfo => {

      // 获取菜单信息
      const menu = this.data.menu

      // 设置用户信息
      menu.user = menu.user.reduce((result, item, index, array) => {
        item.content = userInfo.data[item.field]
        result.push(item)
        return result
      }, [])

      // 设置卡包管理未读
      menu.block[menu.block.findIndex(item => item.event == 'stock')].unread = userInfo.data.red_dot;

      // 设置扫一扫
      menu.vertical[menu.vertical.findIndex(item => item.event == 'getScancode')].hide = userInfo.data.ver_auth == 0

      // 设置数据
      this.setData({
        userInfo: userInfo.data,
        menu,
      })
    })

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
  async onShow() {
    this.setData({
      isShow:this.data.buttons.button4
    })
    try {

      // 验证登录
      await AUTH.loginStatus()

      // 获取信息
      UTIL.message()
      // 控制等级
      LEVEL_SERVICE.levelControl(wx.getStorageSync('userInfo').id)
    } catch (e) {}
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
    await this.init()

    // 停止下拉
    wx.stopPullDownRefresh()
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