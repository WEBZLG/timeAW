/**
 * 2019/10/21
 * 菜单
 * 陈浩、于家辉
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    }, // 菜单列表
    mode: {
      type: String,
      value: 'vertical',
    } // 菜单类型 block/vertical
  },

  /**
   * 组件的初始数据
   */
  data: {
    mainCourse: false // 公开课
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 菜单执行
     */
    menu(e) {

      // 获取参数
      const {
        index,
      } = e.currentTarget.dataset

      // 获取元素
      const item = this.data.list[index]

      // 如果存在事件则优先执行事件，否则跳转
      if (item.event) {

        // 执行事件
        this.triggerEvent(item.event)
      } else if (item.url) {

        // 执行跳转
        wx.navigateTo({
          url: item.url,
        })
      }
    },
  },

  /**
   * 生命周期
   */
  lifetimes: {
    ready() {
      this.setData({
        mainCourse: getApp().globalData.system.maincourse == 1
      })
    }
  }
})