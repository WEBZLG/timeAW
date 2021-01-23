/**
 * 外框
 * 陈浩
 * 2018/12/10
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    /**
     * 状态码
     * init:初始化，canload:可加载，loading:加载中，complete:所有数据加载完成，default:缺省，error:错误，empty:空页面
     */
    status: 'init',
    text: {
      custom: '', // 当前自定义文字
      list: {
        init: '',
        canload: '上滑查看更多',
        loading: '加载中',
        complete: '我是有底线的',
        error: '网络错误',
        empty: './images/empty.png'
      }, // 提示文字列表
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 设置状态码或返回状态码
     */
    status(status, custom = '') {

      if (status) {

        // 设置状态
        this.setData({
          status,
          'text.custom': custom
        })
      } else {

        // 返回状态
        return this.data.status
      }
    },

    /**
     * 重试
     */
    retry() {

      // 初始化
      this.status('init')

      // 弹出
      this.triggerEvent('error')
    }
  }
})