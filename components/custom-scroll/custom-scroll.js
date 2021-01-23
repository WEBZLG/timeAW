/**
 * 自定义滚动
 * 陈浩
 * 2019/6/22
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    refresh: {
      type: Boolean,
      value: true
    } // 是否可以下拉刷新
  },

  /**
   * 组件的初始数据
   */
  data: {
    loadend: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 监听用户下拉动作
     */
    onPullDownRefresh() {
      this.triggerEvent('PullDownRefresh')
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
      this.triggerEvent('ReachBottom')
    },

    /**
     * 停止下拉
     */
    stopPullDownRefresh() {
      this.setData({
        loadend: new Date().getTime()
      })
    },
  },
})