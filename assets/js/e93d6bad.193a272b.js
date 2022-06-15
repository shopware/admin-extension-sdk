"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9478],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},m=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),u=c(n),d=a,f=u["".concat(s,".").concat(d)]||u[d]||p[d]||i;return n?r.createElement(f,l(l({ref:t},m),{},{components:n})):r.createElement(f,l({ref:t},m))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,l=new Array(i);l[0]=u;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var c=2;c<i;c++)l[c]=n[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},6981:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return o},contentTitle:function(){return s},metadata:function(){return c},toc:function(){return m},default:function(){return u}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),l=["components"],o={},s="Register CMS element",c={unversionedId:"guide/api-reference/cms/registerCmsElement",id:"guide/api-reference/cms/registerCmsElement",isDocsHomePage:!1,title:"Register CMS element",description:"Important: This feature is currently not implemented yet and will be released soon",source:"@site/docs/guide/2_api-reference/cms/registerCmsElement.md",sourceDirName:"guide/2_api-reference/cms",slug:"/guide/api-reference/cms/registerCmsElement",permalink:"/admin-extension-sdk/docs/guide/api-reference/cms/registerCmsElement",tags:[],version:"current",frontMatter:{},sidebar:"Guide",previous:{title:"Window",permalink:"/admin-extension-sdk/docs/guide/api-reference/window"},next:{title:"Get",permalink:"/admin-extension-sdk/docs/guide/api-reference/data/get"}},m=[{value:"Important: This feature is currently not implemented yet and will be released soon",id:"important-this-feature-is-currently-not-implemented-yet-and-will-be-released-soon",children:[{value:"Usage:",id:"usage",children:[],level:4},{value:"Parameters",id:"parameters",children:[],level:4}],level:2}],p={toc:m};function u(e){var t=e.components,o=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,r.Z)({},p,o,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"register-cms-element"},"Register CMS element"),(0,i.kt)("h2",{id:"important-this-feature-is-currently-not-implemented-yet-and-will-be-released-soon"},"Important: This feature is currently not implemented yet and will be released soon"),(0,i.kt)("p",null,"With ",(0,i.kt)("inlineCode",{parentName:"p"},"cms.registerCmsElement")," you can register CMS elements to use in the Shopping Experiences Module.\nMore information on how to develop CMS elements can be found in ",(0,i.kt)("a",{parentName:"p",href:"https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-cms-element"},"this guide"),"."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Register a CMS element in your Shopping Experiences Module via App",src:n(8149).Z})),(0,i.kt)("h4",{id:"usage"},"Usage:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"void cms.registerCmsElement({\n    name: 'dailymotionElement',\n    label: 'Dailymotion Video',\n    defaultConfig: {\n        dailyUrl: {\n            source: 'static',\n            value: '',\n        },\n    },\n});\n")),(0,i.kt)("h4",{id:"parameters"},"Parameters"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Required"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"name")),(0,i.kt)("td",{parentName:"tr",align:"left"},"true"),(0,i.kt)("td",{parentName:"tr",align:"left"},"The name of the cms element, which will also be used to generate locationIds - Should have vendor prefix")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"label")),(0,i.kt)("td",{parentName:"tr",align:"left"},"true"),(0,i.kt)("td",{parentName:"tr",align:"left"},"The label, which is visible when selecting the cms element - Use snippet keys here!")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"defaultConfig")),(0,i.kt)("td",{parentName:"tr",align:"left"},"true"),(0,i.kt)("td",{parentName:"tr",align:"left"},"Object containing the defaultConfig; same like in plugin development.")))))}u.isMDXComponent=!0},8149:function(e,t,n){t.Z=n.p+"assets/images/register-cms-element-example-4359134b711ef9b82bcf444af03622b3.png"}}]);