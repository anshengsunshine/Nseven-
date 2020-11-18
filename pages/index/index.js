
var postData = require("../../data/post-data.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      post_key: postData.postList
    });
  },

  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    console.log(postId);
    wx.navigateTo({
      url: '../post-detail/post-detail?id=' + postId
    })
  },

  onSwiperTap: function (event) {
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: '../post-detail/post-detail?id=' + postId
    })
  }
})