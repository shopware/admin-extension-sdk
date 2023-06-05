"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1719],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>c});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var d=r.createContext({}),p=function(e){var t=r.useContext(d),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},u=function(e){var t=p(e.components);return r.createElement(d.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,l=e.originalType,d=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),m=p(a),c=n,f=m["".concat(d,".").concat(c)]||m[c]||s[c]||l;return a?r.createElement(f,i(i({ref:t},u),{},{components:a})):r.createElement(f,i({ref:t},u))}));function c(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=a.length,i=new Array(l);i[0]=m;var o={};for(var d in t)hasOwnProperty.call(t,d)&&(o[d]=t[d]);o.originalType=e,o.mdxType="string"==typeof e?e:n,i[1]=o;for(var p=2;p<l;p++)i[p]=a[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,a)}m.displayName="MDXCreateElement"},5923:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>s,frontMatter:()=>l,metadata:()=>o,toc:()=>p});var r=a(7462),n=(a(7294),a(3905));const l={},i="Window",o={unversionedId:"guide/api-reference/window",id:"guide/api-reference/window",title:"Window",description:"Redirect to another URL",source:"@site/docs/guide/2_api-reference/window.md",sourceDirName:"guide/2_api-reference",slug:"/guide/api-reference/window",permalink:"/admin-extension-sdk/docs/guide/api-reference/window",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"Guide",previous:{title:"Notification",permalink:"/admin-extension-sdk/docs/guide/api-reference/notification"},next:{title:"Vue Devtools",permalink:"/admin-extension-sdk/docs/guide/tooling/vue-devtools"}},d={},p=[{value:"Redirect to another URL",id:"redirect-to-another-url",level:3},{value:"Usage:",id:"usage",level:4},{value:"Parameters:",id:"parameters",level:4},{value:"Return value:",id:"return-value",level:4},{value:"Push to another page",id:"push-to-another-page",level:3},{value:"Usage:",id:"usage-1",level:4},{value:"Parameters:",id:"parameters-1",level:4},{value:"Return value:",id:"return-value-1",level:4},{value:"Reload page",id:"reload-page",level:3},{value:"Usage:",id:"usage-2",level:4},{value:"Parameters:",id:"parameters-2",level:4},{value:"Return value:",id:"return-value-2",level:4}],u={toc:p};function s(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"window"},"Window"),(0,n.kt)("h3",{id:"redirect-to-another-url"},"Redirect to another URL"),(0,n.kt)("h4",{id:"usage"},"Usage:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},"sw.window.redirect({\n    url: 'https://www.shopware.com,\n    newTab: true\n})\n")),(0,n.kt)("h4",{id:"parameters"},"Parameters:"),(0,n.kt)("table",null,(0,n.kt)("thead",{parentName:"table"},(0,n.kt)("tr",{parentName:"thead"},(0,n.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,n.kt)("th",{parentName:"tr",align:"left"},"Required"),(0,n.kt)("th",{parentName:"tr",align:"left"},"Default"),(0,n.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,n.kt)("tbody",{parentName:"table"},(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},(0,n.kt)("inlineCode",{parentName:"td"},"url")),(0,n.kt)("td",{parentName:"tr",align:"left"},"true"),(0,n.kt)("td",{parentName:"tr",align:"left"}),(0,n.kt)("td",{parentName:"tr",align:"left"},"The title of the notification")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},(0,n.kt)("inlineCode",{parentName:"td"},"newTab")),(0,n.kt)("td",{parentName:"tr",align:"left"},"false"),(0,n.kt)("td",{parentName:"tr",align:"left"},"false"),(0,n.kt)("td",{parentName:"tr",align:"left"},"The message of the notification")))),(0,n.kt)("h4",{id:"return-value"},"Return value:"),(0,n.kt)("p",null,"Returns a promise without data."),(0,n.kt)("h3",{id:"push-to-another-page"},"Push to another page"),(0,n.kt)("p",null,"For redirecting to other pages in the admin."),(0,n.kt)("h4",{id:"usage-1"},"Usage:"),(0,n.kt)("p",null,"The usage matches the Vue Router push capabilities. Here are two examples how to use it for redirecting to your own modules:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},"sw.window.routerPush({\n    name: 'sw.extension.sdk.index',\n    params: {\n        id: 'the_id_of_the_module' // can be get with context.getModuleInformation\n    }\n})\n")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},"sw.window.routerPush({\n    path: `/extension/${the_id_of_the_module}` // id can be get with context.getModuleInformation\n})\n")),(0,n.kt)("h4",{id:"parameters-1"},"Parameters:"),(0,n.kt)("table",null,(0,n.kt)("thead",{parentName:"table"},(0,n.kt)("tr",{parentName:"thead"},(0,n.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,n.kt)("th",{parentName:"tr",align:"left"},"Required"),(0,n.kt)("th",{parentName:"tr",align:"left"},"Default"),(0,n.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,n.kt)("tbody",{parentName:"table"},(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},(0,n.kt)("inlineCode",{parentName:"td"},"name")),(0,n.kt)("td",{parentName:"tr",align:"left"},"false"),(0,n.kt)("td",{parentName:"tr",align:"left"},"undefined"),(0,n.kt)("td",{parentName:"tr",align:"left"},"The name of the route")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},(0,n.kt)("inlineCode",{parentName:"td"},"path")),(0,n.kt)("td",{parentName:"tr",align:"left"},"false"),(0,n.kt)("td",{parentName:"tr",align:"left"},"undefined"),(0,n.kt)("td",{parentName:"tr",align:"left"},"The path of the route")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},(0,n.kt)("inlineCode",{parentName:"td"},"params")),(0,n.kt)("td",{parentName:"tr",align:"left"},"false"),(0,n.kt)("td",{parentName:"tr",align:"left"},"undefined"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Additional params for the new route")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},(0,n.kt)("inlineCode",{parentName:"td"},"replace")),(0,n.kt)("td",{parentName:"tr",align:"left"},"false"),(0,n.kt)("td",{parentName:"tr",align:"left"},"false"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Should not change the browser history")))),(0,n.kt)("h4",{id:"return-value-1"},"Return value:"),(0,n.kt)("p",null,"Returns a promise without data."),(0,n.kt)("h3",{id:"reload-page"},"Reload page"),(0,n.kt)("p",null,"Useful for development. You can trigger a page reload on file changes."),(0,n.kt)("h4",{id:"usage-2"},"Usage:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},"sw.window.reload()\n")),(0,n.kt)("h4",{id:"parameters-2"},"Parameters:"),(0,n.kt)("p",null,"No parameters required."),(0,n.kt)("h4",{id:"return-value-2"},"Return value:"),(0,n.kt)("p",null,"Returns a promise without data."))}s.isMDXComponent=!0}}]);