var firstTime=optionsGetKey("firstRun");
if(firstTime!=false){
    var testWebReqList = [];
    var testCookieList = [];
    var testWhiteList = [];

    webReqRule = function(pattern,domain,flag){
        this.pattern = pattern;
        this.domain = domain;
    }

    cookieRule = function(dompat,keypat){
        this.domain = dompat;
        this.keypat = keypat;
    }

    //construct webreqlist
    for(var i=0;i<10;i++){
        testWebReqList[i] = new webReqRule("pattern"+i,"domain"+i,true);
    }

    for(var i=0;i<10;i++){
        testCookieList[i] = new cookieRule("domain"+i,"keypat"+i);
    }

    for(var i=0;i<10;i++){
        testWhiteList[i] = "domain"+i;
    }

    testWebReqList[9]= new webReqRule("http://zodiacg.net/js/gallery.js","");

    storageSet("webReqRuleList",testWebReqList);
    storageSet("cookieRuleList",testCookieList);
    storageSet("domainWhiteList",testWhiteList);    
};

optionsSetKey("firstRun",false);

ruleMan.init();
chrome.webRequest.onBeforeRequest.addListener(onBeforeRequestDealer, {urls: ["http://*/*", "https://*/*"]}, ["blocking"]);
chrome.cookies.onChanged.addListener(cookieOnChangeDealer);
chrome.tabs.onRemoved.addListener(onTabClosedHandler);
chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeadersDealer,{urls: ["http://*/*", "https://*/*"]}, 
["requestHeaders", "blocking"]);