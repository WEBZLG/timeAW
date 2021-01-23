/**
 * vip列表
 * 陈浩
 * 2019/7/12
 */
Component({
  behaviors: ['wx://form-field'],
  /**
   * 组件的属性列表
   */
  properties: {
    owned: {
      type: Array
    },
    list: {
      type: Array,
      observer(value) {

        if (value.length) {

          // 默认选中第一个
          value[0].checked = true

          // 设置数据
          this.setData({
            value
          })

          // 弹出选择
          this.triggerEvent('checked', {
            value
          })
        }
      }
    }, // 列表
    value: {
      type: Array,
      value: []
    } // 数据
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 选择课程
     */
    selectCourse(e) {

      try {

        // 获取下标
        const index = e.currentTarget.dataset.index

        // 获取列表
        const value = this.data.value

        // 统计选中
        if (value[index].checked && value.reduce((count, item) => item.checked ? count + 1 : count, 0) <= 1) throw new Error('至少选择一项课程')

        // 选中/取消
        value[index].checked = !value[index].checked

        // 设置数据
        this.setData({
          value
        })

        // 弹出选择
        this.triggerEvent('checked', {
          value
        }) 
      } catch (e) {

        // 提示
        wx.showToast({
          title: e.message,
          icon: 'none'
        })
      }
    },

    /**
     * 进入课程
     */
    enterCourse(e) {
      console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: `/pages/course-detail/course-detail?id=${e.currentTarget.dataset.id}`,
      })
    },

    /**
     * 进入导师
     */
    enterTutor(e) {
      wx.navigateTo({
        url: `/pages/tutor-home/tutor-home?id=${e.currentTarget.dataset.id}&panel=2`,
      })
    },
  }
})