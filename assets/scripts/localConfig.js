var messageNameInLogFilterList = function (name) {
    var filterList = new Array("user_ntp_net_time","user_heartbeat")
    return filterList.indexOf(name) >= 0
}
var account = "18344141024"
var password = "helloworld"
var system = {
    ANDROID : 1,
    IOS : 2,
};
module.exports = {
    account : account,
    password : password,
    system : system,
    messageNameInLogFilterList : messageNameInLogFilterList
}
