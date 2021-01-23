const {
  list
} = require('../../service/message.service')
const
  UTIL = require('../../utils/util'),
  AUTH = require('../../utils/auth'),
  VIP_SERVICE = require('../../service/vip.service'),
  WISH_SERVICE = require('../../service/wish.service')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: {
      list: [] // 列表
    }, // 课程
    price: 0, // 价格
    user_stock: null, // 用户库存
    ownedList: [], // 已拥有
    notOwnList: [], // 为拥有
    shareopen: '1',
    dataList:[]
  },

  /**
   * 选中
   */
  checked(e) {

    // 获取参数
    const list = e.detail.value

    // 计算价格与统计课程数量
    let price = list.reduce((result, item) => result = item.checked ? result + Number(item.money) : result, 0)
    price = price.toFixed(2)

    // 设置数据
    this.setData({
      price,
    })
  },

  /**
   * 开通
   */
  obtain() {
    wx.createSelectorQuery().select('#vip-list').boundingClientRect(res => {
      wx.pageScrollTo({
        scrollTop: res.top - UTIL.rpx(40)
      })
    }).exec()
  },

  /**
   * 立即开通 
   */
  submit(e) {

    // 获取参数
    const list = e.detail.value.vipList

    // 获取课程ID
    const course = list.reduce((list, item) => {
      if (item.checked) list.push(item.id)
      return list
    }, [])
    if(course.length==0){
      wx.showToast({
        title: '请至少选择一门课程',
        icon:"none",
        mask:true
      })

      return false;
    }
    // 打开提示框
    this.selectComponent('#courseApply').open(course.join())
  },
  resetInit() {
    this.init()
  },

  /**
   * 初始化数据
   */
  async init() {
    console.log('reset')
    // 获取容器
    const container = this.selectComponent('#container')
    try {
      // 获取数据
      const result = await VIP_SERVICE.list(wx.getStorageSync('userInfo').id)
      // 初始化数据
      this.setData({
        'course.list': [],
        user_stock: null,
        shareopen: '1',
        ownedList: [],
        notOwnList: []
      })
      console.log(result)
      let _list = result.data.list
      // 设置数据
      this.setData({
        'course.list': result.data.list,
        user_stock: result.data.user_stock,
        shareopen: result.data.shareopen,
        dataList:result.data.list
      })
      // 1已拥有  0未拥有
      let owned = []; // 已拥有
      let notOwn = [] // 为拥有
      for (let i = 0; i < _list.length; i++) {
        if (_list[i].order_status == 1) {
          owned.push(_list[i])
        } else if (_list[i].order_status == 0) {
          notOwn.push(_list[i])
        }
      }
      this.setData({
        ownedList: owned,
        notOwnList: notOwn
      })
      // 如果已购买所有主营课提示
      if (result.data.list.length == 0) {
        this.selectComponent('.no-stock').open()
      }

      // 设置状态
      container.status('default')
    } catch (e) {

      // 设置状态
      container.status('error', e.message)
    }
  },

  // 关闭弹框
  confirm() {
    this.selectComponent('.no-stock').close()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let pid = options.pid
    if (pid) {
      wx.setStorageSync('share', pid)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let uid = wx.getStorageSync('userInfo').id
    console.log(uid)
    if (uid == undefined || typeof (uid) == undefined) {
      wx.navigateTo({
        url: '../login/login',
      })
    }else{
      this.init()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

    // 分享
    // return UTIL.share()
    return {
      title: '同学招募令',
      path: '/pages/vip/vip?pid=' + wx.getStorageSync('userInfo').id,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "转发成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})