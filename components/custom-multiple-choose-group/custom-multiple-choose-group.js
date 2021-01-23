/**
 * 自定义选择组
 * 陈浩
 * 2019/7/15
 */
Component({
  behaviors: ['wx://form-field'],
  relations: {
    '../custom-multiple-choose/custom-multiple-choose': {
      type: 'child',
      linked(target) {
        target.setData({
          index: this.getRelationNodes('../custom-multiple-choose/custom-multiple-choose').length - 1,
        })
      }
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: Array,
      value: []
    },
    max: {
      type: Number,
      value: Infinity
    }, // 最大选中数
    min: {
      type: Number,
      value: 0
    }, // 最小选中数
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
    change(customChooseIndex) {

      // 获取参数
      const {
        max,
        value
      } = this.data

      // 获取子元素
      const customChoose = this.getRelationNodes('../custom-multiple-choose/custom-multiple-choose')

      // 判断最大值
      if (max <= value.length && !customChoose[customChooseIndex].data._checked) return

      // 赋值
      customChoose[customChooseIndex].setData({
        _checked: !customChoose[customChooseIndex].data._checked
      })

      const newValue = customChoose.reduce((count, item, index) => {
        if (item.data._checked) count.push(index)
        return count
      }, [])

      // 设置数据
      this.setData({
        value: newValue
      })

      // 弹出变更
      this.triggerEvent('change', {
        value: newValue
      })
    },
  }
})