var ruleMan = {};

ruleMan.cache = {
    webreq:{},
    cook:{},
    white:{}
};

ruleMan.rules = {};

parseURL = function parseURL(url){
    var matches = /^(([^:]+(?::|$))(?:(?:\w+:)?\/\/)?(?:[^:@\/]*(?::[^:@\/]*)?@)?(([^:\/?#]*)(?::(\d*))?))((?:[^?#\/]*\/)*[^?#]*)(\?[^#]*)?(\#.*)?/.exec(url);
    // The key values are identical to the JS location object values for that key
    var keys = ["href", "origin", "protocol", "host", "hostname", "port",
              "pathname", "search", "hash"];
    var uri = {};
    for (var i=0; i<keys.length; i++)
        uri[keys[i]] = matches[i] || "";
    return uri;
};

extractDomain = function extractDomain(url){
    return parseURL(url).host;
};

ruleMan.init = function init(){
    ruleMan.loadRules();
};

ruleMan.loadRules = function loadRules(){
    var rules={
        webreq:optionsGetList("webreq"),
        cook:optionsGetList("cookie"),
        white:optionsGetList("white")
    };
    console.log(rules);
    for (var i=0,l=rules.webreq.length;i<l;i++){
        rules.webreq[i].pattern=ruleMan.transRule(rules.webreq[i].pattern);
        rules.webreq[i].domain=ruleMan.transRule(rules.webreq[i].domain);
//        rules.webreq[i].flag=ruleMan.transRule(rules.webreq[i].flag);
        console.log("transed webreq"+i);
    };
    for (var i=0,l=rules.cook.length;i<l;i++){
        rules.cook[i].domain=ruleMan.transRule(rules.cook[i].domain);
        rules.cook[i].keypat=ruleMan.transRule(rules.cook[i].keypat);
        console.log("transed cook"+i);
    };
    for (var i=0,l=rules.white.length;i<l;i++){
        rules.white[i]=ruleMan.transRule(rules.white[i]);
        console.log("transed white"+i);
    };
    ruleMan.rules=rules;
};

ruleMan.transRule = function transRule(pattern){
    pattern = pattern.replace(/([\\\+\|\{\}\[\]\(\)\^\$\.\#])/g, "\\$1");
//  pattern = pattern.replace(/\./g, "\\.");
    pattern = pattern.replace(/\*/g, ".*");
    pattern = pattern.replace(/\?/g, ".");
//  var regexp = /*new RegExp*/("^" + pattern + "$");
    var regexp = pattern;
    return regexp;
};

ruleMan.regExpMatch = function regExpMatch(url,pattern){
    var regexp = new RegExp(pattern);
    return regexp.test(url);
};

ruleMan.testWebReq = function testWebReq(instWebReq){
    var cacheKey = instWebReq.url + " " + instWebReq.domain;
    var result=false;
    if(ruleMan.cache.webreq[cacheKey] != undefined){
        return ruleMan.cache.webreq[cacheKey]
    };
    var jsDomain = extractDomain(instWebReq.url);
    for(var i=0,l=ruleMan.rules.webreq.length;i<l;i++){
        if(ruleMan.regExpMatch(instWebReq.url,ruleMan.rules.webreq[i].pattern)){
            if(ruleMan.rules.webreq[i].domain != ""){
                if(ruleMan.rules.webreq[i].domain===instWebReq.domain){
                    result=false;
                    break;
                }else{
                    result=true;
                    break;
                };
            }else{
                result=true;
                break;
            };
        };
    };
    ruleMan.cache.webreq[cacheKey]=result;
    return result;
};

ruleMan.testCook = function testCook(instCook){
    
};

ruleMan.testWhite = function testWhite(url){
    var cacheKey = url;
    var result = false;
    if(ruleMan.cache.white[cacheKey] != undefined){
        return ruleMan.cache.white[cacheKey]
    };
    for(var i=0,l=ruleMan.rules.white.length;i<l;i++){
        if(regExpMatch(url,ruleMan.rules.white[i])){
            result=true;
            break;
        };
    };
    ruleMan.cache.white[cacheKey]=result;
    return result;
}