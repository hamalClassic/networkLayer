var Code = {
    OK : 200,                               // 成功
    UNKNOWN : 400,                          // 未知错误
    FORBIDDEND : 403,                       // 禁止访问
    NOT_FOUND : 404,                        // 请求未找到
    INTERNAL_SERVER_ERROR : 500,            // 服务器内部错误
    SERVICE_UNAVAILABLE : 503,              // 服务不可用

    CLIENT_ERROR_OPERATION : 1000,          // 客户端非法操作
    ROOM_ALREAY_CREATE : 1001,              // 房间已创建
    ROOM_GAME_NOT_START : 1002,             // 游戏未开始
    ROOM_ALREAY_IN_ANOTHER_ROOM : 1003,     // 已经在其他房间
    ROOM_ALREAY_USE_FULL : 1004,            // 房间已经使用完
    ROOM_ALREAY_IN_ROOM : 1005,             // 已经在房间
    ROOM_NOT_EXIST : 1006,                  // 房间不存在
    ROOM_PLAYER_NOT_IN_ROOM : 1007,         // 玩家不在房间
    ROOM_NOT_ALLOWED_MIDWAY_JOIN : 1008,    // 不允许中途加入
    ROOM_REPEAT_LAUNCH_CLOSE_ROOM : 1009,   // 重复发起关闭房间
    ROOM_NOT_GROUP_MEMBERS : 1010,			// 不是群成员
	ROOM_NOT_PERMISSION	: 1011,				// 没有权限

    USER_USER_EXIST : 1101,                 // 用户已存在
    USER_USER_NOT_EXIST : 1102,             // 用户不存在
    USER_AUTH_FAIL : 1103,                  // 用户验证失败
    USER_FETCH_BASE_INFO_FAIL : 1104,       // 获取玩家基础信息失败
    USER_ALREAY_IN_OTHER_GAME : 1105,       // 用户已经在其他游戏中

    SEAT_ALREAY_SIT_DOWN : 1201,            // 玩家已经坐下
    SEAT_NOT_SIT_DOWN : 1202,               // 玩家还未坐下
    SEAT_ALREAY_FULL : 1203,                // 座位已用完
    SEAT_ALREAY_HAVE_PLAYER : 1204,         // 座位上已经有玩家
    SEAT_ALL_SEAT_BEEN_EMPTY : 1205,        // 所有座位为空

    DATABASE_FETCH_ROOM_NUM_FAIL : 1301,    // 获取房间号失败
    DATABASE_FETCH_ROOM_ID_FAIL : 1302,     // 获取房间id失败
    DATABASE_RECORD_INFO_NOT_EXIST : 1303,  // 战绩信息不存在

    DIAMOND_NOT_FULL : 1401,                // 钻石数量不足
    ROOM_CARD_NOT_FULL : 1402,              // 房卡数量不足

    ROOM_INFO_NOT_EXIST : 1501,     		// 房间信息不存在
    ROOM_CONFIG_CHANGE : 1502,              // 房间配置信息改变
    ROOM_CARD_CONFIG_CHANGE : 1503,         // 房卡配置是否要改变

    ERROR_CONFIG_NOT_FOUND : 10001,         // 配置未找到
    ERROR_BIND_BANK_CARD_NOT_FOUND : 10002,             //银行卡未找到,无法提现
    ERROR_GOLD_CION_INSUFFICIENT : 10003,               //金币不足,无法提现
    ERROR_BANK_CARD_NOT_BIND : 10004,                   //银行卡未绑定
    ERROR_ACCOUNT_NOT_EXISTS : 10005,                   //用户名不存在
    ERROR_BANK_CARD_ALREADY_BIND : 10006,               //该银行卡已经绑定,请联系客服!
    ERROR_TUTORIAL_NOT_EXISTS : 10007,                  //教程不存在
    ERROR_MAY_EXTRACT_COMMISSION_INSUFFICIENT : 10008,  //可提取佣金不足
    ERROR_RECORDS_NOT_EXISTS : 10009,                   //记录未找到

    RETURN_SUCCEED_DRAWING : 20001,                     //操作成功,提现中
    RETURN_SUCCEED_FETCH_BANK_LIST : 20002,             //获取银行卡列表成功
    RETURN_SUCCEED_BIND_BANK : 20003,                   //绑定银行卡成功
    RETURN_SUCCEED_MAY_EXTRACT_COMMISSION : 20004,      //提取佣金成功
    RETURN_SUCCEED_REMOVE_BANK_CARD : 20005,            //删除银行卡成功
    ERROR_CUSTOMER_SERVICES_NOT_EXISTS : 10010,           //客服信息不存在!



    codeInfoMap : {     
                        "200":{'name':'成功'},
                        "400":{'name':'未知错误'},
                        "401":{'name':'未认证'},
                        "403":{'name':'禁止访问'},
                        "404":{'name':'请求未找到'},
                        "500":{'name':'服务器内部错误'},
                        "503":{'name':'服务不可用'},
                        "1000":{'name':'客户端非法操作'},
                        "1001":{'name':'房间已创建'},
                        "1002":{'name':'游戏未开始'},
                        "1003":{'name':'已经在其他房间'},
                        "1004":{'name':'房间已经使用完'},
                        "1005":{'name':'已经在房间'},
                        "1006":{'name':'房间不存在'},
                        "1007":{'name':'玩家不在房间'},
                        "1008":{'name':'不允许中途加入'},
                        "1009":{'name':'重复发起关闭房间'},
                        "1010":{'name':'请先加群'},
                        "1011":{'name':'无权限加入,请联系群主'},
                        "1101":{'name':'用户已存在'},
                        "1102":{'name':'用户不存在'},
                        "1103":{'name':'用户验证失败'},
                        "1104":{'name':'获取玩家基础信息失败'},
                        "1201":{'name':'玩家已经坐下'},
                        "1202":{'name':'玩家还未坐下'},
                        "1203":{'name':'房间已满员'},
                        "1204":{'name':'座位上已经有玩家'},
                        "1205":{'name':'不足2人，无法开始游戏'},
                        "1301":{'name':'获取房间号失败'},
                        "1302":{'name':'获取房间id失败'},
                        "1303":{'name':'已无更多战绩'},
                        "1401":{'name':'钻石数量不足'},
                        "1402":{'name':'房卡数量不足'},
                        "1501":{'name':'房间信息不存在'},
                        "10001":{'name':'配置未找到'},

                        "10002":{'name':'银行卡未找到,无法提现!'},
                        "10003":{'name':'金币不足,无法提现!'},
                        "10004":{'name':'银行卡未绑定!'},
                        "10005":{'name':'用户名不存在!'},
                        "10006":{'name':'该银行卡已经绑定,请联系客服!'},
                        "10007":{'name':'教程不存在!'},
                        "10008":{'name':'可提取佣金不足!'},
                        "10009":{'name':'记录未找到!'},

                        "20001":{'name':'操作成功,提现中!'},
                        "20002":{'name':'获取银行卡列表成功!'},
                        "20003":{'name':'绑定银行卡成功!'},
                        "20004":{'name':'提取佣金成功!'},
                        "20005":{'name':'删除银行卡成功'},
                        "10010":{'name':'客服信息不存在!'},
                },

    //这里是要显示到客户端的错误码
    canShowList : [
        500,
        503,
        1003,
        1004,
        1005,
        1006,
        1008,
        1010,
        1011,
        1203,
        1205,
        1401,
        1402,
        10003,
        10004,
        10006,
        10008,
        20003,
        20004,
    ]
};

Code.isCanShow = function (code) {
    return -1 != Code.canShowList.indexOf(code)
}

Code.getCodeName = function(code){
    var object = Code.codeInfoMap[code];
    if(object){
        return object.name;
    }else{
        return "非法参数 "+code;
    }
    
},            

Code.isSuc = function(code){
    return (code == Code.OK);
}

module.exports = Code;