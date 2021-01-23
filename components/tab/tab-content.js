Component({
  options: {
    styleIsolation: 'apply-shared',
    multipleSlots: true
  },
  relations: {
    './tab': {
      type: 'parent',
    },
    './tab-content-item': {
      type: 'child',
      linked(target) {
        target.setData({
          index: this.getRelationNodes('./tab-content-item').length - 1
        })
        this.setData({
          count: this.data.count + 1
        })
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 0,
    count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    change(index) {
      this.setData({
        active: index
      })
    }
  }
})