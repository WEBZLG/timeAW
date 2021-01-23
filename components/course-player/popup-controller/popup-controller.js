const
  AUDIO = getApp().globalData.audio,
  OBSERVE = require('../../../utils/observe')

/**
 * 背景音乐播放器
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
    course: {}, // 课程信息
    part: {
      list: [],
      index: -1
    }, // 音频信息
    status: 'stop', // 播放状态
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 返回课程
     */
    course() {

      // 获取参数
      const {
        course,
      } = this.data

      // 跳转
      wx.navigateTo({
        url: `/pages/course-detail/course-detail?id=${course.id}`,
      })
    },

    /**
     * 播放
     */
    play() {
      AUDIO.play()
    },

    /**
     * 暂停
     */
    pause() {
      AUDIO.pause()
    },

    /**
     * 停止
     */
    stop() {
      AUDIO.stop()
    }
  },
  /**
   * 生命周期
   */
  lifetimes: {
    ready() {

      // 监听状态
      OBSERVE.subscribe('mediaStatus', media => {

        // 状态函数
        const statusFunction = {
          /**
           * 播放
           */
          play: () => {

            // 设置参数
            this.setData({
              course: media.data.course,
              part: media.data.part,
              status: 'play'
            })
          },

          /**
           * 暂停
           */
          pause: () => {

            // 设置参数
            this.setData({
              course: media.data.course,
              part: media.data.part,
              status: 'pause'
            })
          },

          /**
           * 停止
           */
          stop: () => {

            // 设置状态
            this.setData({
              status: 'stop'
            })
          },

          /**
           * 自然停止
           */
          ended: () => {

            // 设置状态
            this.setData({
              status: 'stop'
            })
          },
        }

        // 执行函数
        if (media.type == 'audio')
          if (statusFunction[media.status]) statusFunction[media.status]()
      }, {
        proxy: true
      })
    }
  },
})