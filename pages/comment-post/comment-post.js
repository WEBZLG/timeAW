const
  COMMENT_SERVICE = require('../../service/comment.service')
let OPTIONS
/**
 * 评论回复
 * 陈浩 2020/1/16
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 提交
   */
  async post(e) {
    try {

      // 获取参数
      const {
        comment
      } = e.detail.value
      let result

      // 评论
      if (OPTIONS.commentId) {

        // 提交数据
        result = await COMMENT_SERVICE.reply(wx.getStorageSync('userInfo').id, OPTIONS.commentId, comment)
      } else if (OPTIONS.courseId) {

        // 提交数据
        result = await COMMENT_SERVICE.post(wx.getStorageSync('userInfo').id, OPTIONS.courseId, comment)
      }

      // 提示
      wx.showModal({
        content: result.msg,
        showCancel: false,
        success: () => {

          // 返回
          wx.navigateBack()
        }
      })
    } catch (e) {
      // 提示
      wx.showModal({
        content: e.message,
        showCancel: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // 获取参数
    OPTIONS = options
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
    // 返回分享
    return UTIL.share()
  }
})