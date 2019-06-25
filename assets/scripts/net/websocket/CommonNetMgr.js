var Code = require("Code");
var http = require("Http");
var Socket = require('Socket');
cc.Class({
    extends: cc.Component,

    properties: {
        gate: null,
        _connectTime: 0,
        _heatbeat: 5,//从服务端获取
        maxConnectTime: 2,
        reconnectSecond: 5,
        maxReconnectSecond: 5,
        // isReconnect: true,
        isReconnect: gIsReconnect,
    },

    setIsReconnnect: function (isReconnect) {//长链接断开时是否自动重新连接
        this.isReconnect = isReconnect;
    },

    getSocket: function () {
        return this.socket;
    },

    init: function () {
        //this.__instanceId = cc.ClassManager.getNewInstanceId();
    },

    initData: function () {//初始化常用数据

    },

    close: function () {//关闭长链接
        cc.log("close lang connect, socket:", this.socket)
        if (this.connectCb) {
            cc.director.getScheduler().unschedule(this.connectCb, this);
            this.connectCb = null
        }
        if (!this.socket) {
            return
        }
        this.socket.close();
        this.socket = null;
        this.stopHeatBeat();
    },
    //重新连接
    reconnect: function (next) {
        this.reconnectCb = next
        if (!this.isReconnect) {
            console.log("不重连");
            return;
        }
        this.reconnectSecond = this.reconnectSecond > this.maxReconnectSecond ? this.maxReconnectSecond : this.reconnectSecond;
        console.log(this.reconnectSecond + '秒后重新连接');
        var self = this;
        if (this.connectCb) {
            cc.director.getScheduler().unschedule(this.connectCb, this);
            this.connectCb = null
        }
        this.showMsgBoxConnectCb = function () {
           cc.log("断线重连.")
           self.login(self.reconnectCb, true)
        }
        cc.director.getScheduler().unschedule(this.showMsgBoxConnectCb, this);
        cc.director.getScheduler().schedule(this.showMsgBoxConnectCb, this, 0, 0, this.reconnectSecond, false);
        this.reconnectSecond += 5;
    },
    //开始发送心跳，不可外部调用
    startHeartBeat: function () {
        var self = this;
        this.heatBeatCallBack = function () {
            self.request("user_heartbeat", {}, function () { 
                console.log('发送心跳');
            });
        };
        cc.director.getScheduler().unschedule(this.heatBeatCallBack, this);
        cc.director.getScheduler().schedule(this.heatBeatCallBack, this, 5)
    },
    //停止发送心跳，不可外部调用
    stopHeatBeat: function () {
        this.unschedule(this.heatBeatCallBack);
    },

    // 发送网络请求
    request: function (name, msg, cb) {
        if (!this.socket) {
            cc.log("socket closed:", name, msg);
            return
        }
        this.socket.request(name, msg, cb)
    },

    //首先会进行一次http请求获取真正的gate地址，然后才进行长连接
    login: function (next, reconnect) {
        var self = this;
        var socket = new Socket();
        if (! self.socket)
        {
            reconnect = false
        }
        cc.log("login socket:", self.socket, ", reconnect:", reconnect)
        var onError = function (err) {
            cc.log("connect error %s", JSON.stringify(err));
        }

        var onClose = function () {
            cc.log("connect close");
            self.stopHeatBeat();
            self.socket = null;
            if (this.isReconnect) {
                self.reconnect(next);
            }
        }.bind(this)

        var onOpen = function () {
            cc.log("connect success");
            var msg = { uid: gUserData.uid, token: "" };
            
            if (reconnect != true)
            {
                cc.log("用户验证")
                // 断线重连的话就只验证，不登陆，因为登陆会触发顶号，自己顶自己...
                socket.request("user_auth", msg, function (ret) {
                    cc.log("用户验证返回:", ret)
                    if (ret.code != Code.OK) {
                        cc.common.showMsgBox({
                            type: 2, msg: "用户验证失败", okCb: function () {
                                this.setIsReconnnect(false)
                                cc.director.loadScene("LoginScene")
                            }
                        })
                        return next(null, ret.code);
                    }
                    self.socket = socket;
                    self.reconnectSecond = 0;
                    self._heatbeat = ret.heartbeat;
                    gUserData.playerInfo = ret.user_base_info
                    //玩家中途离线，获取结算信息
                    if (1 == ret.is_waybill_online_and_exit_game) {
                        //cc.eventMgr.emit("requestResultData")
                    }
                    next(socket);
                    self.startHeartBeat();
                })
            } else {
                cc.log("用户重连")
                socket.request("user_reconnect", msg, function (ret) {
                    cc.log("用户重连返回:", ret)
                    if (ret.code != Code.OK) {
                        cc.common.showMsgBox({
                            type: 2, msg: "用户重连失败", okCb: function () {
                                this.setIsReconnnect(false)
                                cc.director.loadScene("LoginScene")
                            }
                        })
                        return next(null, ret.code);
                    }
                    self.socket = socket;
                    self.reconnectSecond = 0;
                    self._heatbeat = ret.heartbeat;
                    gUserData.playerInfo = ret.user_base_info
                    //玩家中途离线，获取结算信息
                    if (1 == ret.is_waybill_online_and_exit_game) {
                       // cc.eventMgr.emit("requestResultData")
                    }
                    next(socket);
                    self.startHeartBeat();
                })
            }
        }.bind(this)

        var msg = { uid: gUserData.uid, hall_type: 1 };
        http.sendRequest("/game/fetch_gate", msg, function (ret, status) {
            if (ret != null) {
                if (Code.isSuc(ret.code)) {
                    self.gate = ret;
                    gUserData.rid = ret.rid
                    socket.on("onopen", onOpen);
                    socket.on("onclose", onClose);
                    socket.on("onerror", onError);
                    socket.connect(self.gate.ws);
                } else {
                    return next(null, ret.code);
                }
            } else {
                self.reconnect(next);
            }
        });
    },

    //获取游戏服务器地址
    getGameServerIp: function () {
        if (this.gate) {
            return "http://" + this.gate.ip + ":" + this.gate.port
        }
    },
});
