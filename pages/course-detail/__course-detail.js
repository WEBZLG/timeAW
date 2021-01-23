const
  OBSERVE = require('../../utils/observe'),
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  WISH_SERVICE = require('../../service/wish.service'),
  COURSE_SERVICE = require('../../service/course.service'),
  STOCK_SERVICE = require('../../service/stock.service'),
  VIDEO = getApp().globalData.video,
  AUDIO = getApp().globalData.audio
let
  OPTIONS,
  PLAY_FAIL,
  USERINFO_OBSERVE
/**
 * 课程详情
 * 陈浩 2019/11/30
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainCourse: false, // 公开课
    course: {}, // 课程信息
    tutor: {}, // 导师信息
    comment: {
      list: [], // 列表
      count: 0 // 统计
    }, // 评论
    part: {
      list: [], // 列表
      index: -1, // 下标
    }, // 小节
    apply: {
      sender: {}, // 出卡人信息
      parent: {} // 推荐人信息
    }, // 申请信息
    userInfo: {},
    stock: 0,
    isShow: true
  },

  /**
   * 选项卡切换
   */
  tabChange(e) {
    this.selectAllComponents('.tab-item')[e.detail.contentIndex].init()
  },

  /**
   * 关闭弹框
   */
  popupClose() {
    this.selectAllComponents('.popup').forEach(item => item.close())
  },

  /**
   * 兑换cdkey
   */
  async openCdkey() {

    try {

      // 显示加载
      wx.showLoading({
        mask: true,
      })

      // 验证登录
      await AUTH.loginStatus()

      if(this.data.userInfo.group_id > 3) {
        await COURSE_SERVICE.unlock(wx.getStorageSync('userInfo').id, this.data.course.id)
        this.init()
      } else {
        // 打开CDKEY
        this.selectComponent('#cdkey').open()
      }
    } catch (e) {

      if (e.message == 'login:fail') {

        // 跳转登录
        wx.navigateTo({
          url: getApp().globalData.pages.auth,
        })
      }
    } finally {

      // 隐藏加载
      wx.hideLoading()
    }
  },

  /**
   * cdkey兑换成功
   */
  cdkeySuccess() {

    // 初始化数据
    this.init()
  },

  /**
   * 试听
   */
  async preview() {

    try {

      // 显示加载
      wx.showLoading({
        mask: true,
      })

      // 验证登录
      await AUTH.loginStatus()

      // 隐藏加载
      wx.hideLoading()

      // 获取参数
      const {
        course,
      } = this.data

      // 验证
      UTIL.check(course.test_num > 0, '暂无试听章节')
      UTIL.check(course.test_num < 1, `只能试听前${course.test_num}节`)
    } catch (e) {

      // 隐藏加载
      wx.hideLoading()

      if (e.message == 'login:fail') {

        // 跳转
        wx.navigateTo({
          url: getApp().globalData.pages.auth
        })
      } else {

        // 提示
        wx.showToast({
          title: e.message,
          duration: 2500
        })
      }
    }
  },

  /**
   * 申请学习
   */
  async apply() {

    try {

      // 显示加载
      wx.showLoading({
        mask: true,
      })

      // 验证登录
      await AUTH.loginStatus()

      // 获取参数
      const {
        group_id,
        author_id
      } = wx.getStorageSync('userInfo'), {
        mainCourse,
        course,
        tutor,
      } = this.data

      // 当前用户的导师ID等于课程的导师ID则无条件播放
      if (author_id != tutor.author_id) {

        // 是否是主营课  indexshow_id 
        if (course.is_package == 1) {

          // 用户未拥有，则申请课程
          UTIL.check(course.is_own == 1, 'own:fail')
        }
        // 非主营课
        else {

          // 非主营课(即为福利课)并且用户等级低于VIP，则提示升级VIP
          UTIL.check(group_id >= 2, 'vip:fail')
        }
      }

      // 解锁课程
      await COURSE_SERVICE.unlock(wx.getStorageSync('userInfo').id, course.id)

      // 设置数据
      this.setData({
        'course.is_own': true
      })

      // 隐藏加载
      wx.hideLoading()
    } catch (e) {

      // 隐藏加载
      wx.hideLoading()
      console.log(e)
      // 判断错误类型
      if (e.message == 'login:fail') {

        // 未登录则跳转登录
        wx.navigateTo({
          url: getApp().globalData.pages.auth
        })
      } else if (e.message == 'own:fail') {

        // 未拥有课程则申请课程
        this.selectComponent('#courseApply').open(this.data.course.id, 1)
        console.log(this.data.userInfo)
      } else if (e.message == 'vip:fail') {

        // 非VIP则申请VIP
        this.selectComponent('#vip-fail').open()
      } else {

        // 提示
        wx.showToast({
          title: e.message,
          icon: 'none'
        })
      }
    }
  },

  // 立即学习
  async promptlyStudy() {

    try {
      wx.showLoading({
        mask: true,
      })

      // 验证登录
      await AUTH.loginStatus()

      wx.hideLoading()

      // 用户等级 1用户，2会员 3 4
      const userGrade = wx.getStorageSync('userInfo').group_id
      // 1主营课
      if (this.data.course.is_package == 1) {
        if (userGrade > 3) {
          console.log(123)
          // 有库存扣库存，没库存弹出库存不足
          // if (this.data.stock == 0) {
          //   this.selectComponent('#not-stock').open()
          // } else if (this.data.stock > 0) {
          //   this.selectComponent('#use-stock').open()
          // }

          // 解锁课程 2020/09/04修改
          await COURSE_SERVICE.unlock(wx.getStorageSync('userInfo').id, this.data.course.id)
          this.init()
        }
        else if(userGrade == 3) {
          // 有库存扣库存，没库存弹出库存不足
          if (this.data.stock == 0) {
            this.selectComponent('#not-stock').open()
          } else if (this.data.stock > 0) {
            this.selectComponent('#use-stock').open()
          }
        }
        //  else if (userGrade == 1 && this.data.stock > 0) {
        //   this.selectComponent('#not-stock').open()
        // }
        // 非主营课
      } else {
        // 普通用户
        if (userGrade == 1) {
          this.selectComponent('#vip-fail').open()
          // 会员及以上级别
        } else {
          await COURSE_SERVICE.unlock(wx.getStorageSync('userInfo').id, this.data.course.id)
          // 设置数据
          this.setData({
            'course.is_own': true
          })
          this.selectAllComponents('.tab-item')[1].init()
          this.init()
          this.part()
        }

      }
    } catch (e) {
      wx.hideLoading({
        success: (res) => {},
      })
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

  //立即购买
  promptlyBuy() {
    this.selectComponent('#pay-atonce').open()
    // this.goPay()
  },
  // 去支付
  goPay() {
    wx.showLoading()
    const uid = wx.getStorageSync('userInfo').id
    const openid = wx.getStorageSync('userInfo').miniapp_openid
    const course_id = this.data.course.id
    wx.request({
      url: `${getApp().globalData.url.host}/api/course/course_pay_miniapp`,
      data: {
        course_id: course_id,
        uid: uid,
        openid: openid
      },
      success: async (res) => {
        try {
          const result = await UTIL.requestPayment(res.data)
          console.log(result)
          if (result.errMsg == "requestPayment:ok") {
            this.selectComponent('#not-stock').close()
            this.selectComponent('#pay-atonce').close()
            this.selectComponent('#pay-success').open()
            wx.hideLoading()
          }
          this.init()
        } catch (error) {
          this.selectComponent('#pay-atonce').close()
          this.selectComponent('#not-stock').close()
          wx.hideLoading()
          wx.showToast({
            title: error,
          })
        }

      }
    })
  },
  // 扣卡学习
  useStock() {
    const uid = wx.getStorageSync('userInfo').id
    const course_id = this.data.course.id
    wx.request({
      url: `${getApp().globalData.url.host}/api/course/reduce_card`,
      data: {
        uid: uid,
        course_id: course_id
      },
      success: res => {
        console.log(res)
        if (res.data.msg == '库存不足') {
          this.selectComponent('#not-stock').open()
        } else if (res.data.code == 1) {
          // 关闭弹框
          this.selectComponent('#use-stock').close()
          this.init()
        }
      }
    })
  },
  // 再想想
  thinkAgain() {
    this.selectComponent('#use-stock').close()
  },

  // 支付成功，完成按钮
  complete() {
    this.selectComponent('#pay-success').close()
  },

  // 去补卡
  goSupply() {
    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
    wx.navigateTo({
      url: "/pages/stock-replenish/stock-replenish",
      complete: () => {
        this.selectComponent('#not-stock').close()
      }
    })

  },
  /**
   * 播放第一小节
   */
  part(e) {

    const list = this.data.part.list
    const tutor = this.data.tutor
    const index = 0
    const course = this.data.course

    if (list[index].media == 'audio') {

      // 停止视频
      VIDEO.stop()

      // 初始化媒体并播放
      AUDIO.init({
        course,
        tutor,
        part: {
          list,
          index
        }
      })
    } else if (list[index].media == 'video') {

      // 停止音频
      AUDIO.stop()

      // 初始化媒体并播放
      VIDEO.init({
        course,
        tutor,
        part: {
          list,
          index
        }
      })
    }
  },

  /**
   * 评论添加
   */
  commentPost() {
    wx.navigateTo({
      url: `/pages/comment-post/comment-post?courseId=${OPTIONS.id}`,
      events: {
        init: () => this.init()
      }
    })
  },

  /**
   * 愿望单
   */
  async wish(e) {

    try {

      // 加载
      wx.showLoading({
        mask: true
      })

      // 验证登录
      await AUTH.loginStatus()

      // 获取参数
      const {
        is_want,
        id
      } = this.data.course

      // 发送数据
      const result = is_want ? await WISH_SERVICE.del(wx.getStorageSync('userInfo').id, id) : await WISH_SERVICE.post(wx.getStorageSync('userInfo').id, id)

      // 设置数据
      this.setData({
        'course.is_want': !is_want
      })

      // 隐藏加载
      wx.hideLoading()

      // 提示
      wx.showToast({
        title: result.msg,
      })
    } catch (e) {

      // 隐藏加载
      wx.hideLoading()

      if (e.message == 'login:fail') {

        // 跳转
        wx.navigateTo({
          url: getApp().globalData.pages.auth
        })
      } else {

        // 提示
        wx.showToast({
          title: e.message,
        })
      }
    }
  },

  /**
   * 初始化数据
   */
  async init() {

    // 获取容器
    const container = this.selectComponent('#container')

    try {

      // 设置参数
      const params = [
        OPTIONS.id
      ]

      try {

        // 获取登陆状态
        await AUTH.loginStatus()

        // 获取用户ID
        params.push(wx.getStorageSync('userInfo').id)

        // 获取用户信息
        this.setData({
          userInfo: wx.getStorageSync('userInfo')
        })

      } catch (e) {

        // 提示
        console.warn('未登录用户')
      }

      // 获取数据
      const course = await COURSE_SERVICE.get(...params)
      // 设置数据
      this.setData({
        mainCourse: getApp().globalData.system.maincourse == 1,
        course: course.data.course,
        tutor: course.data.author,
        'comment.list': course.data.comment,
        'comment.count': course.data.comment_count,
        'part.list': course.data.micro.reduce((part, item, list) => {

          // 媒体参数
          const options = {
            '2': 'audio',
            '1': 'video'
          }

          // 设置元素
          item = {
            id: item.id,
            media: options[item.is_video],
            audio: item.video_file,
            video: item.audio_file,
            title: item.name,
            duration: UTIL.minuteToSecond(item.time)
          }

          // 推入章节列表
          part.push(item)

          // 返回章节列表
          return part
        }, []),
      })
      // 获取数据
      const [count, list] = await Promise.all([STOCK_SERVICE.count(wx.getStorageSync('userInfo').id), STOCK_SERVICE.list(wx.getStorageSync('userInfo').id, this.data.currentTab, 1)])

      // 设置数据
      this.setData({
        stock: count.data
      })

      // 设置状态
      container.status('default')

      // 初始化tab
      this.selectComponent('#tab').init()

      // 监听错误
      PLAY_FAIL = OBSERVE.subscribe('play:fail', async message => {

        // 判断错误类型
        if (message == 'login:fail') {

          // 未登录则跳转登录
          wx.navigateTo({
            url: getApp().globalData.pages.auth
          })
        } else if (message == 'own:fail') {

          // 班长以上直接解锁课程
          if(this.data.userInfo.group_id > 3) {
            // console.log(123)
            await COURSE_SERVICE.unlock(wx.getStorageSync('userInfo').id, this.data.course.id)
            this.init()
          } else {
            // 未拥有课程则申请课程
            this.selectComponent('#courseApply').open(this.data.course.id, 1)
          }
        } else if (message == 'vip:fail') {

          // 非VIP则申请VIP
          this.selectComponent('#vip-fail').open()
        } else if (message == 'coach:fail') {

          // 非教练则申请教练
          this.selectComponent('#coach-fail').open()
        }
      })
    } catch (e) {

      //设置状态
      container.status('error', e.message)
    }
    // indexshow_id 
    if (this.data.course.is_package == 1) {
      if (this.data.userInfo.group_id == 1 || this.data.userInfo.group_id == 2) {
        this.setData({
          isShow: false
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    // 获取参数
    OPTIONS = options

    // 监听登录
    USERINFO_OBSERVE = OBSERVE.subscribe('userInfo', userInfo => {

      // 初始化数据
      this.init()
    }, {
      proxy: true
    })

    try {

      // 验证登录
      await AUTH.loginStatus()
    } catch (e) {

      // 初始化数据
      this.init()
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

    // 取消订阅
    OBSERVE.unsubscribe('userInfo', USERINFO_OBSERVE)
    OBSERVE.unsubscribe('play:fail', PLAY_FAIL)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {

    // 获取参数
    const element = this.selectAllComponents('.tab-item')[this.selectComponent('#tab').index().contentIndex]

    // 上拉加载
    // if (element.onPullDownRefresh) await element.onPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

    // 获取参数
    const {
      name: intro,
      top_thumb: cover,
      id
    } = this.data.course
    console.log(intro)
    console.log(cover)
    console.log(id)
    // 返回分享
    return UTIL.share({
      path: '/pages/course-detail/course-detail',
      params: {
        id,
      },
      intro,
      cover
    })
  }
})