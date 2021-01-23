const app = getApp()
import { formatTime, formatTimeTwo } from '../../utils/util.js';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		currentTab: 1,
		sliderValue: 0,
		updateState: false,
		playStates: false,
		audiotime: '',
		data_arr: [],
		content: '',
		content2: '',
		content3: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var id = options.id;
		//console.log(id);
		this.daoshidata_fuc(id);
	},
	//初始数据
	daoshidata_fuc: function (id) {
    var uid = wx.getStorageSync('userInfo').id;
		var th = this;
		wx.request({
			url: getApp().globalData.url.host + '/api/course/author_info',
			method: 'post',
			data: {
				author_id: id,
				uid: uid
			},
			header: {
				'content-type': 'application/json'
			},
			success(res) {
				//console.log(res.data.data);
				var result = res.data.data;
				if (result != '') {
					th.setData({
						data_arr: result,
						audiotime: result.author.audiotime,
						content: result.author.content,
						content2: result.author.content2,
						content3: result.author.content3
					})
				} else {
					th.setData({
						data_arr: [],
					})
				}
			}
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.audioContext = wx.createAudioContext('myAudio');
		this.setData({
			updateState: true,
			//audiotime: '0:00'
		})
	},
	audioUpdate(e) {
		if (this.data.updateState) {
			let sliderValue = e.detail.currentTime / e.detail.duration * 100;
			let shijian = e.detail.duration - e.detail.currentTime;
			let shijian1 = parseInt(shijian/60);
			let shijian2 = parseInt(shijian % 60);
			if (shijian2 < 10) {
				shijian2 = '0' + shijian2;
			}
			let shijian3 = shijian1 + ':' +shijian2;
			this.setData({
				sliderValue,
				audiotime: shijian3,
				duration: e.detail.duration
			})
		}
	},
	sliderChanging(e) {
		this.setData({
			updateState: false //拖拽过程中，不允许更新进度条
		})
	},
	sliderChange(e) {
		if (this.data.duration) {
			this.audioContext.seek(e.detail.value / 100 * this.data.duration); //完成拖动后，计算对应时间并跳转到指定位置
      let shijian = this.data.duration - e.detail.value;
			let shijian1 = parseInt(shijian / 60);
			let shijian2 = parseInt(shijian % 60);
			if (shijian2<10){
				shijian2='0'+shijian2;
			}
      console.log(this.data.duration, e.detail)
			let shijian3 = shijian1 + ':' + shijian2;
			this.setData({
				sliderValue: e.detail.value,
				audiotime: shijian3,
				updateState: true //完成拖动后允许更新滚动条
			})
		}
	},
	audioOpreation() {
		this.data.playStates ? this.audioContext.pause() : this.audioContext.play();
		this.setData({
			playStates: !this.data.playStates
		})
	},
	//关注
	like_fuc: function (e) {
		var uid = wx.getStorageSync('userInfo').id;
		var id = e.currentTarget.dataset.id;
		var th = this;
		wx.request({
			url: getApp().globalData.url.host + '/api/course/author_like',
			method: 'post',
			data: {
				author_id: id,
				uid: uid
			},
			header: {
				'content-type': 'application/json'
			},
			success(res) {
				var code = res.data.code;
				if (code == 1) {
					th.setData({
						'data_arr.is_like': 1
					})
				}
			}
		})
	},
  onHide(){
    this.audioOpreation()
  },
	//取消关注
	unlike_fuc: function (e) {
		var uid = wx.getStorageSync('userInfo').id;
		var id = e.currentTarget.dataset.id;
		var th = this;
		wx.request({
			url: getApp().globalData.url.host + '/api/course/author_unlike',
			method: 'post',
			data: {
				author_id: id,
				uid: uid
			},
			header: {
				'content-type': 'application/json'
			},
			success(res) {
				var code = res.data.code;
				if (code == 1) {
					th.setData({
						'data_arr.is_like': 0
					})
				}
			}
		})
	}
})