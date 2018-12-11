const app = getApp();
Page({

  data: {
    isId: ""
  },

  onLoad: function(e) {
    e && this.setData(e);
  },

  onShow: function() {
    app.bar({
      title: "身份认证",
      bgColor: "#b5cfff"
    });
  },

  /**
   * 选择图片
   */
  camera: function(e) {
    let self = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        self.setData({
          isId: res.tempFilePaths[0]
        });
      }
    });
  },

  /**
   * 身份证上传
   */
  upload: function() {

    if (!this.data.isId) return this.setData({
      toast: {
        text: '请拍摄或者选择一张身份证正面照片!',
        icon: 'error'
      }
    });

    // 如果为上传家庭成员身份证
    if (this.data.addFamily) return this.addFamily();


  },

  /**
   * 上传家庭成员身份证
   */
  addFamily: function() {

  },

  /**
   * 身份证错误信息翻译
   */
  idCardError: function(error) {
    let err = error;
    switch (error) {
      case "not a patient account":
        err = "不是病人的账号!";
        break;
      case "Unbound main system account":
        err = "未绑定的主系统账号!";
        break;
      case "no image file upload":
        err = "图片上传程序错误!";
        break;
      case "recognize error":
        err = "图片无法识别,请按要求拍摄!";
        break;
      case "Image type error":
        err = "图片类型错误,无法识别为身份证!";
        break;
      case "please upload face side":
        err = "请上传身份证正面的照片!";
        break;
      case "card number is empty":
        err = "卡号为空!";
        break;
    }
    return err;
  },

  uploadFile: function(callback) {

    let self = this,
      url = !this.data.addFamily ?
      app.globalData.ip + "api/SetIDCard?token=" + app.globalData.userInfo.token :
      app.globalData.ip + "api/addFamilyUserStep1?token=" + app.globalData.userInfo.token;

    wx.uploadFile({
      url,
      filePath: this.data.isId,
      name: "idcard",
      success: function(res) {
        let data = JSON.parse(res.data);
        if (data.error) {
          let err = this.idCardError(data.error);
          return self.setData({
            toast: {
              text: err,
              icon: 'error',
              hideTime: 4000
            }
          });
        } else callback(data);
      },
      fail: console.error
    });
  }
})