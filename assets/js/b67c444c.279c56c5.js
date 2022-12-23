"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4830],{3905:(e,n,t)=>{t.d(n,{Zo:()=>s,kt:()=>u});var i=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function p(e,n){if(null==e)return{};var t,i,r=function(e,n){if(null==e)return{};var t,i,r={},o=Object.keys(e);for(i=0;i<o.length;i++)t=o[i],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(i=0;i<o.length;i++)t=o[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var l=i.createContext({}),d=function(e){var n=i.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},s=function(e){var n=d(e.components);return i.createElement(l.Provider,{value:n},e.children)},c={inlineCode:"code",wrapper:function(e){var n=e.children;return i.createElement(i.Fragment,{},n)}},m=i.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),m=d(t),u=r,k=m["".concat(l,".").concat(u)]||m[u]||c[u]||o;return t?i.createElement(k,a(a({ref:n},s),{},{components:t})):i.createElement(k,a({ref:n},s))}));function u(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,a=new Array(o);a[0]=m;var p={};for(var l in n)hasOwnProperty.call(n,l)&&(p[l]=n[l]);p.originalType=e,p.mdxType="string"==typeof e?e:r,a[1]=p;for(var d=2;d<o;d++)a[d]=t[d];return i.createElement.apply(null,a)}return i.createElement.apply(null,t)}m.displayName="MDXCreateElement"},2556:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>a,default:()=>c,frontMatter:()=>o,metadata:()=>p,toc:()=>d});var i=t(7462),r=(t(7294),t(3905));const o={id:"ui_componentSection",title:"Module: ui/componentSection",sidebar_label:"ui/componentSection",sidebar_position:0,custom_edit_url:null},a=void 0,p={unversionedId:"api/modules/ui_componentSection",id:"api/modules/ui_componentSection",title:"Module: ui/componentSection",description:"Functions",source:"@site/docs/api/modules/ui_componentSection.md",sourceDirName:"api/modules",slug:"/api/modules/ui_componentSection",permalink:"/admin-extension-sdk/docs/api/modules/ui_componentSection",draft:!1,editUrl:null,tags:[],version:"current",sidebarPosition:0,frontMatter:{id:"ui_componentSection",title:"Module: ui/componentSection",sidebar_label:"ui/componentSection",sidebar_position:0,custom_edit_url:null},sidebar:"API",previous:{title:"ui/cms",permalink:"/admin-extension-sdk/docs/api/modules/ui_cms"},next:{title:"ui/mainModule",permalink:"/admin-extension-sdk/docs/api/modules/ui_mainModule"}},l={},d=[{value:"Functions",id:"functions",level:2},{value:"add",id:"add",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"Defined in",id:"defined-in",level:4},{value:"Type Aliases",id:"type-aliases",level:2},{value:"uiComponentSectionRenderer",id:"uicomponentsectionrenderer",level:3},{value:"Defined in",id:"defined-in-1",level:4}],s={toc:d};function c(e){let{components:n,...t}=e;return(0,r.kt)("wrapper",(0,i.Z)({},s,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"functions"},"Functions"),(0,r.kt)("h3",{id:"add"},"add"),(0,r.kt)("p",null,"\u25b8 ",(0,r.kt)("strong",{parentName:"p"},"add"),"(",(0,r.kt)("inlineCode",{parentName:"p"},"messageOptions"),"): ",(0,r.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,r.kt)("inlineCode",{parentName:"p"},"void"),">"),(0,r.kt)("h4",{id:"parameters"},"Parameters"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,r.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"messageOptions")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"Omit"),"<",(0,r.kt)("a",{parentName:"td",href:"/admin-extension-sdk/docs/api/modules/channel#messagedatatype"},(0,r.kt)("inlineCode",{parentName:"a"},"MessageDataType")),"<",(0,r.kt)("inlineCode",{parentName:"td"},'"uiComponentSectionRenderer"'),">",", ",(0,r.kt)("inlineCode",{parentName:"td"},'"src"'),">")))),(0,r.kt)("h4",{id:"returns"},"Returns"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,r.kt)("inlineCode",{parentName:"p"},"void"),">"),(0,r.kt)("h4",{id:"defined-in"},"Defined in"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://github.com/shopware/admin-extension-sdk/blob/a766d9a/src/channel.ts#L401"},"src/channel.ts:401")),(0,r.kt)("h2",{id:"type-aliases"},"Type Aliases"),(0,r.kt)("h3",{id:"uicomponentsectionrenderer"},"uiComponentSectionRenderer"),(0,r.kt)("p",null,"\u01ac ",(0,r.kt)("strong",{parentName:"p"},"uiComponentSectionRenderer"),": { ",(0,r.kt)("inlineCode",{parentName:"p"},"responseType"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"void")," ; ",(0,r.kt)("inlineCode",{parentName:"p"},"component"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"string")," ; ",(0,r.kt)("inlineCode",{parentName:"p"},"positionId"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"string")," ; ",(0,r.kt)("inlineCode",{parentName:"p"},"props"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"unknown")," ; ",(0,r.kt)("inlineCode",{parentName:"p"},"src?"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"string"),"  } & ",(0,r.kt)("inlineCode",{parentName:"p"},"cardComponentRender")),(0,r.kt)("p",null,"Contains all possible components for the sections"),(0,r.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://github.com/shopware/admin-extension-sdk/blob/a766d9a/src/ui/componentSection/index.ts#L11"},"src/ui/componentSection/index.ts:11")))}c.isMDXComponent=!0}}]);