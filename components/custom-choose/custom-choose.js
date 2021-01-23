/**
 * 自定义选择组
 * 陈浩
 * 2019/7/15
 */
Component({
  options: {
    multipleSlots: true
  },
  relations: {
    '../custom-choose-group/custom-choose-group': {
      type: 'parent',
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    checked: {
      type: Boolean,
      value: false,
      observer(value) {
        wx.nextTick(() => {
          this.change()
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tap(e) {

      // 改变
      this.change()
    },
    change() {

      // 获取选择组
      const customChooseGroup = this.getRelationNodes('../custom-choose-group/custom-choose-group')[0]

      // 更改选中
      customChooseGroup.change(this.data.index);
    }
  },

  lifetimes: {
    /**
     * 在组件在视图层布局完成后执行
     */
    ready() {

      // 获取父组件
      const customChooseGroup = this.getRelationNodes('../custom-choose-group/custom-choose-group')[0]
    },
  },
})