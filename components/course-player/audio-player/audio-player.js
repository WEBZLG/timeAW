const
  AUDIO = getApp().globalData.audio,
  OBSERVE = require('../../../utils/observe')
let
  MEDIA_STATUS,
  MEDIA_PROGRESS,
  MEDIA_LOAD

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
    course: {}, // 
    part: {
      list: [], // 列表
      index: 0, // 下标
    }, // 章节
    status: 'stop', // 播放状态
  },

  /**
   * 组件的方法列表
   */
  methods: {

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
    },

    /**
     * 上一曲
     */
    prev() {
      AUDIO.prev()
    },

    /**
     * 下一曲
     */
    next() {
      AUDIO.next()
    },

    /**
     * 更改进度
     */
    seek(e) {
      AUDIO.seek(e.detail)
    }
  },

  /**
   * 生命周期
   */
  lifetimes: {
    detached() {

      // 停止监听状态
      OBSERVE.unsubscribe('mediaStatus', MEDIA_STATUS)
      OBSERVE.unsubscribe('mediaLoad', MEDIA_LOAD)
      OBSERVE.unsubscribe('mediaProgress', MEDIA_PROGRESS)
    },
    ready() {
      
      if (AUDIO.status != 'stop') {

        // 设置音频信息
        this.setData({
          status: AUDIO.status,
          course: AUDIO.data.course,
          part: AUDIO.data.part
        })

        // 设置进度
        this.selectComponent('#audio-player-progress').progress(AUDIO.data.current)
      }

      // 监听进度
      MEDIA_PROGRESS = OBSERVE.subscribe('mediaProgress', media => {
        
        // 设置进度
        this.selectComponent('#audio-player-progress').progress(media.data.current)
      })

      // 监听加载
      MEDIA_LOAD = OBSERVE.subscribe('mediaLoad', media => {

        if (media.status == 'loading') {

          // 设置状态
          this.selectComponent('#audio-player-progress').showLoading()
        } else if (media.status == 'loadend') {

          // 设置状态
          this.selectComponent('#audio-player-progress').hideLoading()
        }
      })

      // 监听状态
      MEDIA_STATUS = OBSERVE.subscribe('mediaStatus', media => {

        // 状态函数
        const statusFunction = {
          /**
           * 播放
           */
          play: () => {

            // 设置音频信息
            this.setData({
              status: 'play',
              course: media.data.course,
              part: media.data.part
            })
          },

          /**
           * 暂停
           */
          pause: () => {

            // 设置状态
            this.setData({
              status: 'pause',
              course: media.data.course,
              part: media.data.part
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
      })
    },
  },
})