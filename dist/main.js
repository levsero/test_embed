!function t(e,n,r){function i(o,s){if(!n[o]){if(!e[o]){var a="function"==typeof require&&require;if(!s&&a)return a(o,!0);if(u)return u(o,!0);throw new Error("Cannot find module '"+o+"'")}var c=n[o]={exports:{}};e[o][0].call(c.exports,function(t){var n=e[o][1][t];return i(n?n:t)},c,c.exports,t,e,n,r)}return n[o].exports}for(var u="function"==typeof require&&require,o=0;o<r.length;o++)i(r[o]);return i}({1:[function(t,e){"use strict";function n(){return g.origin===f&&v?d-v:0}var r=t("./utils/backend").sendData,i=t("./utils/utils").getBuid,u=t("./utils/utils").store,o=t("./utils/utils").retrieve,s=t("./utils/utils").parseUrl,a=t("./utils/utils").win,c=t("./utils/utils").document,l=t("./identity").identity,f=location.origin,d=Date.now(),p=i(),g=s(c.referrer),v=o("currentTime","session")||0,m=function(t){f=t.url||"",r(t,function(t){console.log(t)})};u("currentTime",d,"session"),m({url:location.href,buid:p,useragent:navigator.userAgent,referrer:g.href,time:n(),metrics:["beacon"]}),a.Zd=e.exports={identity:l}},{"./identity":2,"./utils/backend":3,"./utils/utils":4}],2:[function(t,e,n){"use strict";var r=t("./utils/utils").getBuid,i={getBuid:r,email:""};n.identity=i},{"./utils/utils":4}],3:[function(t,e,n){"use strict";function r(t){return JSON.stringify(t)}function i(t,e){var n=new XMLHttpRequest;n.open("POST","http://zensnow.herokuapp.com/api/blips",!0),n.addEventListener("readystatechange",function(){4===n.readyState&&n.status>=200&&n.status<=300&&e(n.responseText)},!1),n.setRequestHeader("Content-Type","application/json"),n.send(r(t))}n.sendData=i},{}],4:[function(t,e,n){"use strict";function r(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}function i(){return[r(),r(),r(),r(),r(),r(),r(),r()].join("")}function u(){var t=s("buid");return t||(t=i(),o("buid",t)),t}function o(t,e,n){n=n||"local","object"==typeof e&&(e=JSON.stringify(e)),c[n+"Storage"].setItem("ZD-"+t,e)}function s(t,e){e=e||"local";var n=c[e+"Storage"].getItem("ZD-"+t);try{return JSON.parse(n)}catch(r){return n}}function a(t){return f.href=t,f}var c=window.top,l=c.document;n.win=c,n.document=l;var f=l.createElement("a");n.getBuid=u,n.store=o,n.retrieve=s,n.parseUrl=a},{}]},{},[1]);