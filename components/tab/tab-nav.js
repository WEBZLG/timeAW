Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  relations: {
    './tab': {
      type: 'parent',
    },
    './tab-nav-item': {
      type: 'child',
      linked(target) {
        target.setData({
          index: this.getRelationNodes('./tab-nav-item').length - 1,
        })
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    x: {
      type: Boolean,
      value: true
    }, // x轴滚动
    y: {
      type: Boolean,
      value: false
    }, // y轴滚动
  },

  /**
   * 组件的初始数据
   */
  data: {
    left: 0,
    width: 0,
    index: 1,
    active: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 变更item
     */
    change(index) {
      this.setData({
        active: index
      })

      // this.createSelectorQuery().select('#scroll-view').scrollOffset((res) => {
      //   this.getRelationNodes('./tab-nav-item')[index].createSelectorQuery().select('.tab-nav-item').boundingClientRect((rects) => {
      //     const width = rects.width;
      //     const left = res.scrollLeft + rects.left;

      //     this.setData({
      //       width,
      //       left
      //     })
      //   }).exec();
      // }).exec();

      this.getRelationNodes('./tab-nav-item').forEach(target => {
        target.setData({
          active: index,
        })
      })
    },
  }
})