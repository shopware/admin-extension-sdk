"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5596],{3905:function(e,t,n){n.d(t,{Zo:function(){return o},kt:function(){return v}});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var d=r.createContext({}),s=function(e){var t=r.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},o=function(e){var t=s(e.components);return r.createElement(d.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},g=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,d=e.parentName,o=p(e,["components","mdxType","originalType","parentName"]),g=s(n),v=i,k=g["".concat(d,".").concat(v)]||g[v]||m[v]||a;return n?r.createElement(k,l(l({ref:t},o),{},{components:n})):r.createElement(k,l({ref:t},o))}));function v(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,l=new Array(a);l[0]=g;var p={};for(var d in t)hasOwnProperty.call(t,d)&&(p[d]=t[d]);p.originalType=e,p.mdxType="string"==typeof e?e:i,l[1]=p;for(var s=2;s<a;s++)l[s]=n[s];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}g.displayName="MDXCreateElement"},922:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return p},contentTitle:function(){return d},metadata:function(){return s},toc:function(){return o},default:function(){return g}});var r=n(7462),i=n(3366),a=(n(7294),n(3905)),l=["components"],p={id:"privileges_privilege_resolver",title:"Module: privileges/privilege-resolver",sidebar_label:"privileges/privilege-resolver",sidebar_position:0,custom_edit_url:null},d=void 0,s={unversionedId:"api/modules/privileges_privilege_resolver",id:"api/modules/privileges_privilege_resolver",isDocsHomePage:!1,title:"Module: privileges/privilege-resolver",description:"Functions",source:"@site/docs/api/modules/privileges_privilege_resolver.md",sourceDirName:"api/modules",slug:"/api/modules/privileges_privilege_resolver",permalink:"/admin-extension-sdk/docs/api/modules/privileges_privilege_resolver",editUrl:null,tags:[],version:"current",sidebarPosition:0,frontMatter:{id:"privileges_privilege_resolver",title:"Module: privileges/privilege-resolver",sidebar_label:"privileges/privilege-resolver",sidebar_position:0,custom_edit_url:null},sidebar:"API",previous:{title:"privileges/missing-privileges-error",permalink:"/admin-extension-sdk/docs/api/modules/privileges_missing_privileges_error"},next:{title:"ui/actionButton",permalink:"/admin-extension-sdk/docs/api/modules/ui_actionButton"}},o=[{value:"Functions",id:"functions",children:[{value:"sendPrivileged",id:"sendprivileged",children:[{value:"Parameters",id:"parameters",children:[],level:4},{value:"Returns",id:"returns",children:[],level:4},{value:"Defined in",id:"defined-in",children:[],level:4}],level:3},{value:"handlePrivileged",id:"handleprivileged",children:[{value:"Parameters",id:"parameters-1",children:[],level:4},{value:"Returns",id:"returns-1",children:[],level:4},{value:"Defined in",id:"defined-in-1",children:[],level:4}],level:3},{value:"findExtensionByBaseUrl",id:"findextensionbybaseurl",children:[{value:"Parameters",id:"parameters-2",children:[],level:4},{value:"Returns",id:"returns-2",children:[],level:4},{value:"Defined in",id:"defined-in-2",children:[],level:4}],level:3}],level:2},{value:"Type aliases",id:"type-aliases",children:[{value:"privilegeString",id:"privilegestring",children:[{value:"Defined in",id:"defined-in-3",children:[],level:4}],level:3},{value:"privileges",id:"privileges",children:[{value:"Type declaration",id:"type-declaration",children:[],level:4},{value:"Defined in",id:"defined-in-4",children:[],level:4}],level:3},{value:"extension",id:"extension",children:[{value:"Type declaration",id:"type-declaration-1",children:[],level:4},{value:"Defined in",id:"defined-in-5",children:[],level:4}],level:3}],level:2}],m={toc:o};function g(e){var t=e.components,n=(0,i.Z)(e,l);return(0,a.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"functions"},"Functions"),(0,a.kt)("h3",{id:"sendprivileged"},"sendPrivileged"),(0,a.kt)("p",null,"\u25b8 ",(0,a.kt)("strong",{parentName:"p"},"sendPrivileged"),"(",(0,a.kt)("inlineCode",{parentName:"p"},"messageType"),"): ",(0,a.kt)("a",{parentName:"p",href:"/admin-extension-sdk/docs/api/modules/privileges_privilege_resolver#privilegestring"},(0,a.kt)("inlineCode",{parentName:"a"},"privilegeString")),"[] ","|"," ",(0,a.kt)("inlineCode",{parentName:"p"},"null")),(0,a.kt)("h4",{id:"parameters"},"Parameters"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,a.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"messageType")),(0,a.kt)("td",{parentName:"tr",align:"left"},"keyof ",(0,a.kt)("a",{parentName:"td",href:"/admin-extension-sdk/docs/api/modules/messages_types#shopwaremessagetypes"},(0,a.kt)("inlineCode",{parentName:"a"},"ShopwareMessageTypes")))))),(0,a.kt)("h4",{id:"returns"},"Returns"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/admin-extension-sdk/docs/api/modules/privileges_privilege_resolver#privilegestring"},(0,a.kt)("inlineCode",{parentName:"a"},"privilegeString")),"[] ","|"," ",(0,a.kt)("inlineCode",{parentName:"p"},"null")),(0,a.kt)("h4",{id:"defined-in"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/shopware/admin-extension-sdk/blob/aa3a4f3/src/privileges/privilege-resolver.ts#L20"},"src/privileges/privilege-resolver.ts:20")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"handleprivileged"},"handlePrivileged"),(0,a.kt)("p",null,"\u25b8 ",(0,a.kt)("strong",{parentName:"p"},"handlePrivileged"),"(",(0,a.kt)("inlineCode",{parentName:"p"},"messageType"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"origin"),"): ",(0,a.kt)("a",{parentName:"p",href:"/admin-extension-sdk/docs/api/modules/privileges_privilege_resolver#privilegestring"},(0,a.kt)("inlineCode",{parentName:"a"},"privilegeString")),"[] ","|"," ",(0,a.kt)("inlineCode",{parentName:"p"},"null")),(0,a.kt)("h4",{id:"parameters-1"},"Parameters"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,a.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"messageType")),(0,a.kt)("td",{parentName:"tr",align:"left"},"keyof ",(0,a.kt)("a",{parentName:"td",href:"/admin-extension-sdk/docs/api/modules/messages_types#shopwaremessagetypes"},(0,a.kt)("inlineCode",{parentName:"a"},"ShopwareMessageTypes")))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"origin")),(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"string"))))),(0,a.kt)("h4",{id:"returns-1"},"Returns"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/admin-extension-sdk/docs/api/modules/privileges_privilege_resolver#privilegestring"},(0,a.kt)("inlineCode",{parentName:"a"},"privilegeString")),"[] ","|"," ",(0,a.kt)("inlineCode",{parentName:"p"},"null")),(0,a.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/shopware/admin-extension-sdk/blob/aa3a4f3/src/privileges/privilege-resolver.ts#L31"},"src/privileges/privilege-resolver.ts:31")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"findextensionbybaseurl"},"findExtensionByBaseUrl"),(0,a.kt)("p",null,"\u25b8 ",(0,a.kt)("strong",{parentName:"p"},"findExtensionByBaseUrl"),"(",(0,a.kt)("inlineCode",{parentName:"p"},"baseUrl"),"): ",(0,a.kt)("a",{parentName:"p",href:"/admin-extension-sdk/docs/api/modules/privileges_privilege_resolver#extension"},(0,a.kt)("inlineCode",{parentName:"a"},"extension"))," ","|"," ",(0,a.kt)("inlineCode",{parentName:"p"},"undefined")),(0,a.kt)("h4",{id:"parameters-2"},"Parameters"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,a.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"baseUrl")),(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"string"))))),(0,a.kt)("h4",{id:"returns-2"},"Returns"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/admin-extension-sdk/docs/api/modules/privileges_privilege_resolver#extension"},(0,a.kt)("inlineCode",{parentName:"a"},"extension"))," ","|"," ",(0,a.kt)("inlineCode",{parentName:"p"},"undefined")),(0,a.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/shopware/admin-extension-sdk/blob/aa3a4f3/src/privileges/privilege-resolver.ts#L75"},"src/privileges/privilege-resolver.ts:75")),(0,a.kt)("h2",{id:"type-aliases"},"Type aliases"),(0,a.kt)("h3",{id:"privilegestring"},"privilegeString"),(0,a.kt)("p",null,"\u01ac ",(0,a.kt)("strong",{parentName:"p"},"privilegeString"),": ","`","${keyof privileges}:${string}","`"),(0,a.kt)("h4",{id:"defined-in-3"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/shopware/admin-extension-sdk/blob/aa3a4f3/src/privileges/privilege-resolver.ts#L5"},"src/privileges/privilege-resolver.ts:5")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"privileges"},"privileges"),(0,a.kt)("p",null,"\u01ac ",(0,a.kt)("strong",{parentName:"p"},"privileges"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"Object")),(0,a.kt)("h4",{id:"type-declaration"},"Type declaration"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,a.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"additional?")),(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"string"),"[]")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"create?")),(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"string"),"[]")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"read?")),(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"string"),"[]")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"update?")),(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"string"),"[]")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"delete?")),(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"string"),"[]")))),(0,a.kt)("h4",{id:"defined-in-4"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/shopware/admin-extension-sdk/blob/aa3a4f3/src/privileges/privilege-resolver.ts#L7"},"src/privileges/privilege-resolver.ts:7")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"extension"},"extension"),(0,a.kt)("p",null,"\u01ac ",(0,a.kt)("strong",{parentName:"p"},"extension"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"Object")),(0,a.kt)("h4",{id:"type-declaration-1"},"Type declaration"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,a.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"baseUrl")),(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"string"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"permissions")),(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("a",{parentName:"td",href:"/admin-extension-sdk/docs/api/modules/privileges_privilege_resolver#privileges"},(0,a.kt)("inlineCode",{parentName:"a"},"privileges")))))),(0,a.kt)("h4",{id:"defined-in-5"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/shopware/admin-extension-sdk/blob/aa3a4f3/src/privileges/privilege-resolver.ts#L15"},"src/privileges/privilege-resolver.ts:15")))}g.isMDXComponent=!0}}]);