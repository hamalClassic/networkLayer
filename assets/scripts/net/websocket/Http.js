var CustomHttpClient = require('CustomHttpClient');
var CustomHttpRequest = require('CustomHttpRequest');
cc.VERSION = 20170524;
cc.Class({
    extends: cc.Component,

    statics: {
        sessionId: 0,
        userId: 0,
        sendRequest: function (path, data, handler, extraUrl) {
            if (extraUrl == null)
                extraUrl = gHost;
            let requestUrl = extraUrl + path;
            let requestText = JSON.stringify(data);
            cc.log("http req path:", path, ", data:", requestText);
            let customHttpRequest = new CustomHttpRequest();
            customHttpRequest.setRequestType('POST');
            customHttpRequest.setTimeout(5000);
            customHttpRequest.setUrl(requestUrl);
            customHttpRequest.setData(requestText);
            CustomHttpClient.instance.send(customHttpRequest, function (customHttpRequest) {
                if (! customHttpRequest) {
                    handler(null, '网络错误');
                }
                let responseText = customHttpRequest.xhr.responseText;
                cc.log("http res path:", path, ", data:", responseText)
                var data = JSON.parse(responseText);
                handler(data);
            });
        },
    },
});