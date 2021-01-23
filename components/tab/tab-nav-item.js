Component({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared'
  },
  relations: {
    './tab-nav': {
      type: 'parent',
    },
    './tab': {
      type: 'ancestor',
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    activeBlock: {
      type: Boolean,
      value: false
    } // 是否有单独的激活区块
  },
  /**
   * 组件的初始数据
   */
  data: {
    active: 0,
    index: 0,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tap() {

      // 获取参数
      const
        itemIndex = this.data.index,
        navIndex = this.getRelationNodes('./tab-nav')[0].data.index
        
      // 通知tab变更
      this.getRelationNodes('./tab')[0].change(itemIndex, navIndex);
    }
  }
})