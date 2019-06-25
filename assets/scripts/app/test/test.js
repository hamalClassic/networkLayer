var NetMgr = require("NetMgr")
var Code = require('Code')
var http = require('Http')
cc.Class({
    extends: cc.Component,

    properties: {
    
    },

    start () {
      // socket.request("user_reconnect", msg, function (ret) {
      //   cc.log("用户重连返回:", ret)
      //   if (ret.code != Code.OK) {
      //     cc.log('用户重连失败')
      //   }
      // })
      cc.netMgr = new NetMgr()
      cc.netMgr.initData()
      cc.netMgr.login(function (socket, code) {
          cc.log("链接成功!")
          cc.netMgr.close(false);
          cc.log("关闭长链接")
      })
      
      var test = this.node.getChildByName("labelParent").getChildByName('label').getComponent(cc.Label)
        http.sendRequest("/game/fetch_sale_info",{account: '9UcltX'}, function (res) {
          let code = res.code
          cc.log(res)
          if(code == Code.OK) {
              test.string = res.account
          }
      }.bind(this))
    },

   
});
