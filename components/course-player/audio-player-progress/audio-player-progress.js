const
  AUDIO = getApp().globalData.audio,
  OBSERVE = require('../../../utils/observe')
let
  AUDIO_STATUS,
  AUDIO_PROGRESS,
  AUDIO_CHANGE

/**
 * 进度条
 * 陈浩 2019/11/18
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    duration: {
      type: Number,
      value: 0
    }, // 总共时间
  },

  /**
   * 组件的初始数据
   */
  data: {
    drag: {
      status: false, // 状态
      time: 0, // 拖拽临时时间
    }, // 拖拽
    current: 0, // 当前进度
    disabled: false, // 禁用
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 设置进度
     */
    progress(current) {

      // 设置当前时间
      this.setData({
        current
      })
    },

    /**
     * 拖拽中
     */
    onChanging(e) {

      if (!this.data.status) {

        // 设置状态
        this.setData({
          drag: {
            time: e.detail.value,
            status: true
          },
        })
      }
    },

    /**
     * 拖拽完成
     */
    onChange(e) {

      // 弹出
      this.triggerEvent('seek', e.detail.value)
    },

    /**
     * 加载中
     */
    showLoading() {

      // 禁用
      this.setData({
        disabled: true
      })
    },

    /**
     * 加载完成
     */
    hideLoading() {

      // 获取参数
      const drag = this.data.drag

      // 启用
      this.setData({
        disabled: false,
      })

      // 设置拖拽状态
      this.setData({
        'drag.status': false,
        current: drag.time
      })
    },
  },

  /**
   * 生命周期
   */
  lifetimes: {}
})