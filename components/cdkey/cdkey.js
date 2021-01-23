const COURSE_SERVICE = require('../../service/course.service')

/**
 * 兑换cdkey
 * 陈浩
 * 2019/8/2
 */
Component({
  options: {
    styleIsolation: 'apply-shared'
  },

  /**
   * 组件的属性列表
   */
  properties: {
    course: {
      type: Number
    }, // 课程
    codenum: {
      type: Number
    },
    keytype:{
      type:Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    status: false // 弹框状态
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 验证重复元素，有重复返回true；否则返回false
    isRepeat(arr) {
      let hash = {};
      for (let i in arr) {
        if (hash[arr[i]]) {
          return true;
        }
        // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
        hash[arr[i]] = true;
      }
      return false;
    },

    /**
     * 提交
     */
    async submit(e) {

      try {

        // 获取参数
        const course = this.data.course

        // 格式化cdkey
        let cdkeyList = []
        for (let i = 0; i < this.data.codenum; i++) {
          cdkeyList.push(e.detail.value[i])
          if (e.detail.value[i] == '') {
            wx.showToast({
              title: '请输入兑换码',
              icon: 'none',
              duration: 2000
            })
            return
          }
        }
        // 判断是否输入重复的兑换码
        if(this.isRepeat(cdkeyList)) {
          wx.showToast({
            title: '请勿重复输入兑换码',
            icon: 'none',
            duration: 2000
          })
          return
        }
        console.log(cdkeyList.length)
        console.log(cdkeyList.toString())
        const cdkey = cdkeyList.toString()

        // 显示加载
        wx.showLoading({
          mask: true,
        })
        console.log(this.data.keytype)
        // 发送数据
        let result;
        if(this.data.keytype=='0'){
          result = await COURSE_SERVICE.welfareCdkey(wx.getStorageSync('userInfo').id, course, cdkey)
        }else{
          result = await COURSE_SERVICE.cdkey(wx.getStorageSync('userInfo').id, course, cdkey)
        }
        
        // 关闭
        this.close()

        // 弹出事件
        this.triggerEvent('success', {
          cdkey
        })

        // 隐藏加载
        wx.hideLoading()

        // 提示
        wx.showToast({
          title: result.msg,
          icon: 'none'
        })
      } catch (e) {

        // 隐藏加载
        wx.hideLoading()

        // 提示
        wx.showToast({
          title: e.message,
          icon: 'none'
        })
      }
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
     * 打开
     */
    open() {
      this.setData({
        status: true
      })
    },
  }
})