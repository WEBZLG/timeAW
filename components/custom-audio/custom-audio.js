const InnerAudioContext = wx.createInnerAudioContext()
/**
 * 自定义音频
 * 陈浩
 * 2019/8/23
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      observer(src) {
        InnerAudioContext.src = src
      }
    }, // 路径
    duration: {
      type: String
    } // 长度
  },

  /**
   * 组件的初始数据
   */
  data: {
    status: 'pause', // 播放状态
    time: 0, // 播放时间
    timeChange: {
      time: 0, // 拖拽时间
      status: false // 拖拽状态
    } // 时间拖拽
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 播放
     */
    play() {
      this.setData({
        status: 'play',
      })
      InnerAudioContext.play()
    },

    /**
     * 暂停
     */
    pause() {
      this.setData({
        status: 'pause'
      })
      InnerAudioContext.pause()
    },

    /**
     * 进度更改中
     */
    progressChanging(e) {
      this.setData({
        'timeChange.time': e.detail.value,
        'timeChange.status': true
      })
    },

    /**
     * 进度更改
     */
    progressChange(e) {
      this.setData({
        'timeChange.status': true
      })
      InnerAudioContext.seek(e.detail.value)
    }
  },
  lifetimes: {
    ready() {
      InnerAudioContext.onTimeUpdate((e) => {
        this.setData({
          time: Math.floor(InnerAudioContext.currentTime),
          duration: InnerAudioContext.duration
        })
      })
      InnerAudioContext.onSeeked((e) => {
        this.setData({
          'timeChange.status': false
        })
      })
    }
  }
})