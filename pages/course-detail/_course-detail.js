const
  OBSERVE = require('../../utils/observe'),
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  WISH_SERVICE = require('../../service/wish.service'),
  COURSE_SERVICE = require('../../service/course.service')
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
  },

  /**
   * 选项卡切换
   */
  tabChange(e) {
    console.log(this.selectAllComponents('.tab-item'))
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

      // 打开CDKEY
      this.selectComponent('#cdkey').open()
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

        // 是否是主营课
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

      // 判断错误类型
      if (e.message == 'login:fail') {

        // 未登录则跳转登录
        wx.navigateTo({
          url: getApp().globalData.pages.auth
        })
      } else if (e.message == 'own:fail') {

        // 未拥有课程则申请课程
        this.selectComponent('#courseApply').open(this.data.course.id, 1)
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

      // 设置状态
      container.status('default')

      // 初始化tab
      this.selectComponent('#tab').init()

      // 监听错误
      PLAY_FAIL = OBSERVE.subscribe('play:fail', message => {

        // 判断错误类型
        if (message == 'login:fail') {

          // 未登录则跳转登录
          wx.navigateTo({
            url: getApp().globalData.pages.auth
          })
        } else if (message == 'own:fail') {

          // 未拥有课程则申请课程
          this.selectComponent('#courseApply').open(this.data.course.id, 1)
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