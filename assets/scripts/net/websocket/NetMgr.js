var Code = require("Code");
var CommonNetMgr = require('CommonNetMgr');
cc.Class({
    extends: cc.Component,

    properties: {
        gate: {
            get: function () {
                return this._commonNetMgr.gate;
            }
        },

        dataList: []
    },

    close: function (isReconnect) {
        if (!this._commonNetMgr) {
            cc.log("_commonNetMgr is null");
            return
        }
        this._commonNetMgr.setIsReconnnect(isReconnect);
        this._commonNetMgr.close();
        this._commonNetMgr = null;
    },

    initData: function () {//初始化常用数据
        this._commonNetMgr = new CommonNetMgr();
        this._commonNetMgr.initData();
    },

    reconnect: function (flag) {
        cc.log("公共网络管理:", this._commonNetMgr)
        this._commonNetMgr.setIsReconnnect(flag);
    },

    gameServerIp: function () {
        this._commonNetMgr.getGameServerIp();
    },

    //应用退到后台
    onAppBack: function () {
        this.close(false)
    },

    //应用回到前台
    onAppFront: function () {
        if (null == this._commonNetMgr) {
            this.initData()
            this.login(this._loginBack)
        } else {
            cc.log("_commonNetMgr exists");
        }
    },

    //应用退到后台
    onAppLobbyBack: function () {
        this.close(false)
    },

    //应用回到前台
    onAppLobbyFront: function () {
        if (null == this._commonNetMgr) {
            this.initData()
        } else {
            cc.log("_commonNetMgr exists");
        }
    },

    // 发送网络请求
    request: function (name, msg, cb) {
        if (!this._commonNetMgr) {
            cc.log("_commonNetMgr closed");
            return
        }
        this._commonNetMgr.request(name, msg, cb)
    },

    setLoginCallBack: function (next) {
        this._loginBack = next;
    },


    login: function (next) {
        var self = this;
        if (next) {
            this.setLoginCallBack(next);
        }
        this._commonNetMgr.login(function (socket, code) {
            if (socket) {
                self.initNetHandlers(socket);
                if (self._loginBack) {
                    self._loginBack(true);
                }
            } else {
                if (self._loginBack) {
                    self._loginBack(false, code);
                }
            }
        });
    },

    // TODO:监听网络消息，dispatch消息
    initNetHandlers: function (socket) {
        if (!socket) {
            // TODO:
            return;
        }

        //响应解散房间
        socket.on("on_room_close_launch", function (ret) {
            this.pushData("on_room_close_launch", ret, function () {
                if (2 == ret.type) {
                    //房主在解散房间时，直接返回到游戏大厅。
                    if (cc.gameMgr.isRoomOwner()) {
                        cc.gameMgr.backToLobbyScene()
                    }
                    //在房主解散房间时，其他玩家的页面里应该弹出“房主已解散房间”的提示，点击“确定”后返回到游戏大厅
                    else {
                        cc.common.showMsgBox({
                            type: 2, msg: "房主已解散房间", okCb: function () {
                                cc.gameMgr.backToLobbyScene()
                            }
                        })
                    }
                }
                else if (1 == ret.type) {
                    var view = cc.gameMgr.view.openView("prefabs/dismissRoom/DismissRoomView")
                    view.setData(ret.room_close_info)
                }
                else if (3 == ret.type) {
                    if (cc.gameMgr.curJushu <= 1) {
                        cc.common.showMsgBox({
                            type: 2, msg: "解散房间成功", okCb: function () {
                                cc.gameMgr.backToLobbyScene()
                            }
                        })
                    }
                    else {
                        cc.common.showMsgBox({
                            type: 2, msg: "解散房间成功", okCb: function () {

                            }
                        })
                    }
                }
            })
        }.bind(this))

        //解散房间玩家选择
        socket.on("on_room_close_affirm", function (ret) {
            this.pushData("on_room_close_affirm", ret, function () {
                cc.eventMgr.emit("on_room_close_affirm", ret)
            })
        }.bind(this))

        //响应离开房间
        socket.on("on_room_leave", function (ret) {
            this.pushData("on_room_leave", ret, function () {
                cc.eventMgr.emit("on_room_leave", ret)
            })
        }.bind(this))

        //响应加入房间
        socket.on("on_room_join", function (ret) {
            this.pushData("on_room_join", ret, function () {
                cc.eventMgr.emit("on_room_join", ret)
            })
        }.bind(this))

        //踢出游戏(抢号)
        socket.on("on_user_kick", function (ret) {
            this.pushData("on_user_kick", ret, function () {
                cc.common.showMsgBox({
                    type: 2, msg: "您的账号已在其它设备登录！", okCb: function () {
                        this._commonNetMgr.setIsReconnnect(false);
                        cc.director.loadScene("LoginScene")
                        this.request("user_kick_ok", {}, function (ret) {
                            cc.log('测试发现有时候会在处理消息之前被关闭，所以这里有时候不会被执行。')
                            //GameToAppHelper.ExitGame()
                        })
                    }.bind(this)
                })    
            }.bind(this))
        }.bind(this))

        //游戏状态变化
        socket.on("on_room_game_status_change", function (ret) {
            this.pushData("on_room_game_status_change", ret, function () {
                cc.eventMgr.emit("on_room_game_status_change", ret)
            })
        }.bind(this))
    },

    //把协议缓存起来,因为游戏场景可能还没初始化成功，会丢失数据
    pushData: function (name, ret, cb) {
        this.dataList.push({ name: name, ret: ret, cb: cb })
    },

    //一帧处理一个
    handleData: function () {
        var data = this.dataList[0]
        if (data) {
            data.cb(data.name, data.ret)
            removeByIndex(this.dataList, 0)
        }
    },

    exec: function (ret, func) {
        if (ret.code == Code.OK) {
            func()
        }
        else {
            // 重复提示不显示
            if (cc.common.isRepetitionBar(ret.code)) {
                return
            }
            // 浏览器显示全部信息，方便调试
            if (cc.sys.isBrowser) {
                cc.common.showMsgBox({ type: 1, msg: Code.getCodeName(ret.code), codeNumber: ret.code })
            }
            // 真机显示部分信息，策划的需求
            else if (Code.isCanShow(ret.code)) {
                cc.common.showMsgBox({ type: 1, msg: Code.getCodeName(ret.code), codeNumber: ret.code })
            }
        }
    }

});
