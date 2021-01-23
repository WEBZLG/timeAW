// shopping/components/order-item/order-item.js
const ORDER_SERVICE = require('../../service/order.service')
const UTIL = require('../../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    order: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusObj: {
      '0': {
        statusContent: '待付款',
        statusColor: 'red'
      },
      '-1': {
        statusContent: '取消订单',
        statusColor: 'violet'
      },
      '1': {
        statusContent: '待配送',
        statusColor: 'yellow'
      },
      '2': {
        statusContent: '待签收',
        statusColor: 'green'
      },
      '6': {
        statusContent: '已完成',
        statusColor: 'blue'
      },
      '4': {
        statusContent: '退货中',
        statusColor: 'yellow'
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 取消订单
    cancelOrder() {
      let that = this
      wx.showModal({
        title: '确定取消订单',
        async success(res) {
          if (res.confirm) {
            try {
              wx.showLoading({
                title: '加载中',
              })
              // console.log(that.data.order)
              const result = await ORDER_SERVICE.cancelOrder(that.data.order.id)
              that.reset()
              wx.hideLoading()
            } catch (e) {
              wx.hideLoading()
              wx.showToast({
                title: e.message,
                icon: 'none',
                duration: 3000
              })
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    // 确认收货
    confirmReceipt() {
      const that = this
      wx.showModal({
        title: '是否确认收货',
        async success(res) {
          if (res.confirm) {
            try {
              wx.showLoading({
                title: '加载中',
              })
              const result = await ORDER_SERVICE.confirmReceipt(that.data.order.id)
              that.reset()
              wx.hideLoading()
            } catch (e) {
              wx.hideLoading()
              wx.showToast({
                title: e.message,
                icon: 'none',
                duration: 3000
              })
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    // 立即支付
    async payNow() {
      try {
        wx.showLoading({
          title: '加载中'
        })
        const openid = wx.getStorageSync('userInfo').miniapp_openid
        const result = await ORDER_SERVICE.orderPay(this.data.order.id, openid)
        console.log(result)
        const res = await UTIL.requestPayment(result)
        // console.log(res)
        wx.hideLoading()

      } catch (e) {
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          duration: 2000
        })
      }
    },
    // 查看物流
    checkLogistics() {
      console.log(this.data.order)
      const number = this.data.order.virtual_sn
      const order_id = this.data.order.order_id
      const virtual_name = this.data.order.virtual_name
      wx.navigateTo({
        url: `/shopping/pages/check-logistics/check-logistics?number=${number}&order_id=${order_id}&virtual_name=${virtual_name}`
      })
    },
    // 查看订单
    checkOrder() {
      const id = this.data.order.id
      wx.navigateTo({
        url: `/shopping/pages/order-details/order-details?id=${id}`
      })
    },
    reset() {
      this.triggerEvent('reset')
      console.log('调用父组件方法')
    }
  }
})