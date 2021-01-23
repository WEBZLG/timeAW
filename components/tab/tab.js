Component({
  options: {
    multipleSlots: true
  },
  relations: {
    './tab-nav': {
      type: 'child',
      linked(target) {
        target.setData({
          index: this.getRelationNodes('./tab-nav').length - 1
        })
      }
    },
    './tab-content': {
      type: 'child',
      linked(target) {
        target.setData({
          index: this.getRelationNodes('./tab-content').length - 1
        })
      }
    },
    './tab-nav-item': {
      type: 'descendant',
    },
    './tab-content-item': {
      type: 'descendant',
    },
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
    navIndex: [0],
    contentIndex: 0,
    prevIndex: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 更改tab
     */
    change(navItemIndex, navCategoryIndex = 0) {

      // 获取参数
      const
        navIndex = this.data.navIndex,
        prevIndex = this.data.contentIndex

      // 设置下标
      navIndex[navCategoryIndex] = navItemIndex

      // 获取内容下标
      const contentIndex = navIndex.reduce((result, item, index, array) => {
        return array[index + 1] != undefined ? item * this.getRelationNodes('./tab-nav')[index + 1].getRelationNodes('./tab-nav-item').length + array[index + 1] : result
      })

      // 执行子元素变更
      this.getRelationNodes('./tab-nav')[navCategoryIndex].change(navItemIndex)
      this.getRelationNodes('./tab-content')[0].change(contentIndex)

      // 设置当前下标
      this.setData({
        navIndex,
        contentIndex,
        prevIndex
      })

      // 弹出变更
      this.triggerEvent('change', {
        navIndex,
        contentIndex,
        prevIndex
      })
    },

    /**
     * 获取下标
     */
    index() {
      return {
        navIndex: this.data.navIndex,
        contentIndex: this.data.contentIndex,
        prevIndex: this.data.prevIndex
      }
    },

    /**
     * 初始化
     */
    init(index = 1) {

      // 设置初始下标
      this.setData({
        navIndex: new Array(this.getRelationNodes('./tab-nav').length).fill(0)
      })

      // 初始化时将tab变更为第index个元素
      this.change(index)
    }
  }
})