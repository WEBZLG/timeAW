const UTIL = require('../../utils/util')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		currentTab: 0,
		count_arr: [],
		empty: false
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.countdata_fuc();
	},
	//加载初始数据
	countdata_fuc: function () {
		var th = this;
		var uid = wx.getStorageSync('userInfo').id;
		wx.request({
			url: getApp().globalData.url.host + '/api/course/stock_statistics',
			method: 'post',
			data: {
				uid: uid
			},
			header: {
				'content-type': 'application/json'
			},
			success(res) {
				console.log(res.data.data);
				var result = res.data.data;
				th.setData({
					count_arr: result,
				})
				if (th.count_arr.take.length == 0) {
					th.setData({
						empty: true
					})
				}
			}
		})
	},
	/**
	 * 切换事件
	 */
	stockTab: function (e) {
		var that = this;
		if (this.data.currentTab === e.target.dataset.id) {
			return false;
		} else {
			that.setData({
				currentTab: e.target.dataset.id,
			})
		}
		if (e.target.dataset.id == 0) {
			if (that.data.count_arr.take.length == 0) {
				this.setData({
					empty: true
				})
			} else {
				this.setData({
					empty: false
				})
			}
		} else if (e.target.dataset.id == 1) {
			if (that.data.count_arr.get.length == 0) {
				this.setData({
					empty: true
				})
			} else {
				this.setData({
					empty: false
				})
			}
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

		// 分享
		return UTIL.share()
	}
})