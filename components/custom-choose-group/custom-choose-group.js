/**
 * 自定义选择组
 * 陈浩
 * 2019/7/15
 */
Component({
  behaviors: ['wx://form-field'],
  relations: {
    '../custom-choose/custom-choose': {
      type: 'child',
      linked(target) {
        target.setData({
          index: this.getRelationNodes('../custom-choose/custom-choose').length - 1,
        })
      }
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: Number,
      value: 0
    },
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
     * 更改点击
     */
    change(value) {

      // 获取元素
      const customChoose = this.getRelationNodes('../custom-choose/custom-choose')

      // 设置数据
      this.setData({
        value
      })

      customChoose.forEach((item, index) => {
        // 设置数据
        item.setData({
          _checked: index == value
        })
      })

      // 弹出变更
      this.triggerEvent('change', {
        value
      })
    },
  }
})