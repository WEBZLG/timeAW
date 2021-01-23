const
  AUTH = require('../../utils/auth'),
  UTIL = require('../../utils/util'),
  WISH_SERVICE = require('../../service/wish.service')

/**
 * 愿望单
 * 陈浩
 * 2019/7/17
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wish: {
      list: [] //列表
    }, // 愿望单
    count: 0, // 课程统计
    price: 0, // 价格统计
    isShow: true, //按钮显示隐藏
  },

  /**
   * 提交
   */
  submit(e) {
    this[e.detail.target.dataset.formType](e)
  },

  /**
   * 申请
   */
  apply(e) {

    // 提示
    wx.showModal({
      content: '确认申请学习这些课程吗？',
      success: async res => {

        // 判断确认
        if (!res.confirm) return

        try {

          // 获取列表
          const list = e.detail.value.wishList

          // 循环统计ID
          const course = list.reduce((id, categoryItem) => {
            return id.concat(categoryItem.courses.reduce((id, courseItem) => {
              if (courseItem.checked == true) id.push(courseItem.course_id)
              return id
            }, []))
          }, []).join()

          // 验证数据
          UTIL.check(course, '请至少选择一项课程')

          // 显示加载
          wx.showLoading({
            mask: true,
          })

          // 获取数据
          const result = await WISH_SERVICE.apply(wx.getStorageSync('userInfo').id, course)

          // 初始化数据
          this.init()

          // 隐藏加载
          wx.hideLoading()

          // 提示
          wx.showToast({
            title: result.msg,
            icon: 'none'
          })
        } catch (e) {

          // 隐藏加载
          wx.hideLoading()

          // 提示
          wx.showToast({
            title: e.message,
            icon: 'none'
          })
        }
      }
    })
  },

  /**
   * 删除
   */
  delete(e) {

    // 提示
    wx.showModal({
      content: '确认移除这些课程吗？',
      success: async res => {

        // 判断确认
        if (!res.confirm) return

        try {

          // 获取列表
          const list = e.detail.value.wishList

          // 循环统计ID
          const course = list.reduce((id, categoryItem) => {
            return id.concat(categoryItem.courses.reduce((id, courseItem) => {
              if (courseItem.checked == true) id.push(courseItem.course_id)
              return id
            }, []))
          }, []).join()

          // 验证数据
          UTIL.check(course, '请至少选择一项课程')

          // 显示加载
          wx.showLoading({
            mask: true,
          })

          // 获取数据
          const result = await WISH_SERVICE.delete(wx.getStorageSync('userInfo').id, course)

          // 初始化数据
          this.init()

          // 隐藏加载
          wx.hideLoading()

          // 提示
          wx.showToast({
            title: "删除成功",
            icon: 'none'
          })
        } catch (e) {

          // 隐藏加载
          wx.hideLoading()

          // 提示
          wx.showToast({
            title: e.message,
            icon: 'none'
          })
        }
      }
    })
  },

  /**
   * 全部取消
   */
  uncheckedAll() {
    this.selectComponent('#wish-list').unchecked('all') 
    this.setData({
      isShow: true
    })
  },

  /**
   * 全选
   */
  checkedAll() {
    this.selectComponent('#wish-list').checked('all')
    this.setData({
      isShow: false
    })
  },

  /**
   * 统计
   */
  count(e) {

    // 获取列表
    const list = e.detail.value

    // 循环统计价格与计数
    const {
      price,
      count
    } = list.reduce((result, categoryItem) => {

      // 统计课程价格与计数
      const course = categoryItem.courses.reduce((result, courseItem) => {
        if (courseItem.checked == true) {
          result.price += Number(courseItem.course.money)
          result.count += 1
        }
        return result
      }, {
        price: 0,
        count: 0
      })

      // 统计所有价格与技术
      result.price += course.price
      result.count += course.count

      // 返回价格与计数
      return result
    }, {
      price: 0,
      count: 0
    })

    // 设置价格
    this.setData({
      price,
      count
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

      // 获取数据
      const result = await WISH_SERVICE.list(wx.getStorageSync('userInfo').id)

      // 设置数据
      this.setData({
        'wish.list': result.data
      })

      // 设置状态
      container.status(...(result.data.length ? ['complete'] : ['empty', '/images/wish/empty.png']))
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