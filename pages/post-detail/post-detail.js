var postsData = require("../../data/post-data.js")
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayMusic: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    var postId = option.id;
    this.data.currentPostId = postId;
    console.log(postId);
    var postData = postsData.postList[postId];
    console.log(postData);
    //如果在onLoad中，不是异步的去执行一个数据绑定
    //则不需要this.setData方法
    //只需要对this.data赋值即可，但在微信0.12版本后，this.data方法失效
    this.setData({
      postData,
    });

    var postsCollected = wx.getStorageSync("posts_collected")
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("posts_collected", postsCollected);
    }
    if (app.globalData.g_isPlayMusic && app.globalData.g_currentMusicPostId === postId){
      this.setData({
        isPlayMusic:true
      })
    }
   this.setMusicMonitor();
  },

  setMusicMonitor:function(){
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayMusic: true
      })
      app.globalData.g_isPlayMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayMusic: false
      })
      app.globalData.g_isPlayMusic = false;
      app.globalData.g_currentMusicPostId = null;
    })
  },


  onCollectionTap: function(event) {
    var postsCollected = wx.getStorageSync("posts_collected");
    var postCollected = postsCollected[this.data.currentPostId];
    //收藏便成未收藏，未收藏变成收藏。
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    //更新文章是否的缓存值
    wx.setStorageSync("posts_collected", postsCollected);
    //更新数据绑定文章，从而实现切换图片
    this.setData({
      collected: postCollected,
    })

    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success",
    })
  },

  onShareTap: function(event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博",
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#4b5f80",
      success: function(res) {
        //res.cancel  用户是否点击了取消
        //res.tapIndex  数组元素的序号，从0开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户是否取消?' + res.cancel + "很抱歉，小程序暂时未开启此功能",
        })
      }
    })
  },

  onMusicTap: function() {
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId];
    var isPlayMusic = this.data.isPlayMusic;
    if (isPlayMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayMusic:false,
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg,
      })
      this.setData({
        isPlayMusic:true,
      })
    }
  }

})