const UTIL = require('../../utils/util')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		data_arr:[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.data_fuc();
	},
	//加载初始用户数据
	data_fuc: function () {
		var th = this;
    var uid = wx.getStorageSync('userInfo').id;
		wx.request({
      url: getApp().globalData.url.host + '/api/course/get_parent',
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
					data_arr: result,
				})
			}
		})
	},
})