/**
 * 日期时间
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
    status: false,
    scrollFlag: false,
    date: {
      year: [],
      month: [],
      day: [],
      value: []
    },
    time: {
      hour: [],
      minute: [],
      second: [],
      value: []
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 打开
     */
    open() {
      this.setData({
        status: true
      })
    },

    /**
     * 关闭
     */
    close() {
      this.setData({
        status: false
      })
    },

    /**
     * 确认
     */
    confirm() {

      if (this.data.scrollFlag) return

      // 获取参数
      const
        date = this.data.date,
        time = this.data.time

      // 弹出事件
      this.triggerEvent("confirm", {
        date: {
          year: date.year[date.value[0]],
          month: date.month[date.value[1]],
          day: date.day[date.value[2]]
        },
        time: {
          hour: time.value[0],
          minute: time.value[1],
        }
      })

      // 关闭窗口
      this.close()
    },

    dateChange(e) {
      const year = this.data.date.year[e.detail.value[0]]
      const month = this.data.date.month[e.detail.value[1]]

      this.setDay(year, month)

      this.setData({
        'date.value': e.detail.value
      })
    },

    timeChange(e) {
      this.setData({
        'time.value': e.detail.value
      })
    },

    start() {
      this.setData({
        scrollFlag: true
      })
    },
    end() {
      this.setData({
        scrollFlag: false
      })
    },

    /**
     * 根据年份与月份设置日期
     */
    setDay(year, month) {

      const maxDay = new Date(year, month, 0)
      const day = []

      // 设置日期
      for (let d = 1; d <= maxDay.getDate(); d++) {
        day.push(d)
      }

      this.setData({
        'date.day': day
      })
    }
  },
  lifetimes: {
    attached() {
      const date = new Date()

      // 设置年份
      const year = []
      for (let y = date.getFullYear(); y <= date.getFullYear() + 100; y++) {
        year.push(y)
      }

      // 设置月份
      const month = []
      for (let y = 1; y <= 12; y++) {
        month.push(y)
      }

      // 根据年份与月份设置日期
      this.setDay(date.getFullYear(), date.getMonth())

      // 设置日期
      const dataValue = [0, date.getMonth(), date.getDate() - 1]

      // 设置小时
      const hour = []
      for (let h = 0; h < 24; h++) {
        hour.push(h)
      }

      // 设置分钟
      const minute = []
      for (let m = 0; m < 60; m++) {
        minute.push(m)
      }

      // 设置秒
      const second = []
      for (let s = 0; s < 60; s++) {
        second.push(s)
      }

      // 设置时间
      const timeValue = [date.getHours(), date.getMinutes(), date.getSeconds()]

      // 设置数据
      this.setData({
        'date.year': year,
        'date.month': month,
        'date.value': dataValue,
        'time.hour': hour,
        'time.minute': minute,
        'time.second': second,
        'time.value': timeValue,
      })
    },
  },
})