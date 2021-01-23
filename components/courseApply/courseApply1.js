const
  AUTH = require('../../utils/auth'),
  SENDCARD_SERVICE = require('../../service/sendcard.service'),
  WISH_SERVICE = require('../../service/wish.service'),
  USERINFO_SERVICE = require('../../service/userInfo.service'),
  SYSTEM_SERVICE = require('../../service/system.service')

/**
 * 课程申请
 * 陈浩
 * 2019/10/9
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    course: '', // 课程id
    count: 0, // 统计卡数
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 关闭
     */
    close() {
      this.selectAllComponents('.form-popup').forEach(item => item.close())
    },

    /**
     * 打开
     */
    async open(course) {

      try {

        // 显示加载
        wx.showLoading({
          mask: true
        })

        // 验证登录
        await AUTH.loginStatus()

        // 获取出卡人信息
        const sender = await SENDCARD_SERVICE.list(wx.getStorageSync('userInfo').id)

        // 设置数据
        this.setData({
          sender: sender.data,
          course,
          count: course.toString().split(',').length
        })

        // 打开申请
        this.selectComponent('.course-apply').open()
      } catch (e) {

        // 判断错误类型
        if (e.message == 'login:fail') {

          // 跳转
          wx.navigateTo({
            url: getApp().globalData.pages.auth
          })
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
     * 提交申请
     */
    async submit(e) {

      try {

        // 显示加载
        wx.showLoading({
          mask: true,
        })

        // 获取数据
        const result = await WISH_SERVICE.apply(wx.getStorageSync('userInfo').id, this.data.course, e.detail.formId)

        // 获取数据
        await USERINFO_SERVICE.get(wx.getStorageSync('userInfo').id)

        // 打开成功
        this.selectComponent('.form-success').open()
      } catch (e) {

        // 打开失败
        this.selectComponent('.form-fail').open()
      } finally {

        // 隐藏加载
        wx.hideLoading()

        // 关闭申请
        this.selectComponent('.course-apply').close()
      }
    }
  }
})