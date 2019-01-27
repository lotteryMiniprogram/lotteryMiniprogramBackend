//app.js
App({
  onLaunch: function () {
    // TODO: 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // TODO: 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              console.log(res);
              this.globalData.userInfo = res.userInfo;
              // TODO: 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回, 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) this.userInfoReadyCallback(res);
              this.wxLogin(res)
            }
          })
        }
      }
    })
  },
  wxLogin: function (getResult) {
    var self = this;
    // TODO: 用户登录微信，后端获取 openid 作为用户唯一标识
    wx.login({
      success: res => {
        // TODO：发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          // TODO: 若果成功返回并且有 code 参数，向后端发起网络请求
          wx.request({
            url: this.globalData.backend + '/wx_user/log_in',
            data: {
              code: res.code,
              rawData: getResult.rawData,
              signature: getResult.signature,
            },
            success: res => { self.loginCallBack(res); }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  loginCallBack: function (res) {
    console.log(res);
    if (res.data.code === 0) {
      this.globalData.userInfo.openid = res.data.data.openid;
    }
  },
  globalData: {
    userInfo: null,
    backend: "http://localhost:8000"
  }
});