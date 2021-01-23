const
  AUTH = require('../../utils/auth'),
  UTIL = require('../../utils/util'),
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
    stock: {
      type: Number, //类型
      value: 0 //默认值
    }
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

        const user = wx.getStorageSync('userInfo')
        // 设置数据
        this.setData({
          sender: sender.data,
          course,
          count: course.toString().split(',').length
        })
        // 判断用户等级
        if (user.group_id == 1 || user.group_id == 2) {
          console.log('普通用户-时间与崇尚会员')
          this.selectComponent('.pay-now').open()
        } else if (user.group_id == 3) {
          console.log('时间与崇尚教练-时间与崇尚院长')
          if (this.data.stock == 0) {
            this.selectComponent('.no-stock').open()
          } else if (this.data.stock > 0) {
            this.selectComponent('.deduction-card').open()
          }

        } else if (user.group_id >= 4) {
          wx.showToast({
            title: '您的等级过高，无需购买',
            icon: 'none',
            duration: 2000
          })
        }
        // 打开申请
        // this.selectComponent('.course-apply').open()
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
        setTimeout(() => {
          wx.hideLoading()
        }, 2000)
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
    },

    /**
     * 扣卡弹窗 确认学习
     */
    async confirmDeduction(event) {
      try {
        wx.showLoading({
          mask: true
        })

        const res = await SENDCARD_SERVICE.useStock(wx.getStorageSync('userInfo').id, this.data.course)

        wx.hideLoading()
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        this.selectComponent('.deduction-card').close()
      } catch (error) {
        wx.hideLoading()
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

        // 关闭申请
        this.selectComponent('.course-apply').close()
      }

    },

    /**
     * 立即支付弹框 确认学习
     */
    confirmPayNow() {
      this.purchase()
      this.selectComponent('.pay-now').close()
    },
    /**
     * 支付成功完成
     */
    complete(event) {
      // 关闭弹框
      this.selectComponent('.pay-success').close()
    },

    /**
     * 去补卡
     */
    replacement() {
      wx.navigateTo({
        url: `/pages/stock-replenish/stock-replenish`,
        success: () => {
          this.selectComponent('.no-stock').close()
        }
      })
    },
    /**
     * 原价购买
     */
    async purchase() {
      wx.showLoading({
        title: '加载中',
      })
      let id = wx.getStorageSync('userInfo').id
      let openid = wx.getStorageSync('userInfo').miniapp_openid
      this.selectComponent('.no-stock').close()
      wx.request({

        url: `${getApp().globalData.url.host}/api/course/minicourse_submit_pay`,
        data: {
          uid: id,
          openid: openid,
          course_ids: this.data.course
        },
        success: async res => {
          console.log(res)
          wx.hideLoading()
          if (res.statusCode == 200) {
            const result = await UTIL.requestPayment(res.data)
            console.log(result)
            this.selectComponent('.pay-success').open()
            if (result.errMsg == 'requestPayment:ok') {
              this.selectComponent('.pay-success').open()
              this.triggerEvent('reset')
            }
          }
        }
      })
    },

  }
})