/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./content/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./content/index.js":
/*!**************************!*\
  !*** ./content/index.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/server */ "./utils/server.js");
/* harmony import */ var _utils_ajax__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/ajax */ "./utils/ajax.js");



/**
 * 后台
 */
_utils_server__WEBPACK_IMPORTED_MODULE_0__["default"]
  .get('/content/bg2ct', async (request, sender, sendResponse) => {
    console.log('server-bg2ct', request)
    sendResponse({
      bg2ct: true
    })
  })
  .get('/content/pp2ct', async (request, sender, sendResponse) => {
    console.log('server-pp2ct', request)
    sendResponse({
      pp2ct: true
    })
  })

_utils_ajax__WEBPACK_IMPORTED_MODULE_1__["default"]
  .get('/background/ct2bg', { ct: 1 })
  .then((data) => {
    console.log('get-ct2bg:', data)
  })

_utils_ajax__WEBPACK_IMPORTED_MODULE_1__["default"]
  .get('/popup/ct2pp', { ct: 2 })
  .then((data) => {
    console.log('get-ct2pp:', data, 'pp没有打开，获取可能为undefined')
  })


/***/ }),

/***/ "./utils/ajax.js":
/*!***********************!*\
  !*** ./utils/ajax.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * 将服务注册,伪装成express.router
 * 
 * content->background chrome.runtime.sendMessage
 * popup->background chrome.runtime.sendMessage/chrome.extension.getBackgroundPage
 * 
 * content->popup chrome.runtime.sendMessage
 * background->popup chrome.runtime.sendMessage/chrome.extension.getViews
 * 
 * popup->content chrome.tabs.sendMessage
 * background->content chrome.tabs.sendMessage
 * 
 * 简单的说就是【popup/background本身就具有相同的权限】
 * 
 * 
 */
let methods = {}
const ajax = {
    get(key, params) {
        if (key.startsWith('/background/')) {
            // content->background chrome.runtime.sendMessage
            // popup->background chrome.runtime.sendMessage/chrome.extension.getBackgroundPage
            // 读取后台数据
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({
                    method: key,
                    ...params
                }, res => {
                    resolve(res)
                })
            })
        } else if (key.startsWith('/popup/')) {
            // * content->popup chrome.runtime.sendMessage
            // * background->popup chrome.extension.getViews
            // 读取content数据
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({
                    method: key,
                    ...params
                }, res => {
                    resolve(res)
                })
            })
        } else if (key.startsWith('/content/')) {
            // * popup->content chrome.tabs.sendMessage
            // * background->content chrome.tabs.sendMessage
            // 读取content数据
            return new Promise((resolve, reject) => {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
                    if (tab.length > 0) {
                        chrome.tabs.sendMessage(tab[0].id, { method: key, ...params }, function (data) {
                            resolve(data)
                        });
                    } else {
                        reject()
                    }
                })
            })
        }
    }
}
/* harmony default export */ __webpack_exports__["default"] = (ajax);

/***/ }),

/***/ "./utils/server.js":
/*!*************************!*\
  !*** ./utils/server.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * 将服务注册,伪装成express.router
 * 
 * 注册事件都是 chrome.runtime.onMessage.addListener
 */
let methods = {}

const app = {
    get(key, fn) {
        methods[key] = fn
        return app
    },
    // 模拟自定义
    post(key, fn) {
        window.addEventListener(key, fn, false);
        return app
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (methods[request.method]) {
        methods[request.method](request, sender, sendResponse)
    }
})
/* harmony default export */ __webpack_exports__["default"] = (app);

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9jb250ZW50L2luZGV4LmpzIiwid2VicGFjazovLy8uL3V0aWxzL2FqYXguanMiLCJ3ZWJwYWNrOi8vLy4vdXRpbHMvc2VydmVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vY29udGVudC9pbmRleC5qc1wiKTtcbiIsImltcG9ydCBzZXJ2ZXIgZnJvbSAnLi4vdXRpbHMvc2VydmVyJ1xuaW1wb3J0IGFqYXggZnJvbSAnLi4vdXRpbHMvYWpheCdcblxuLyoqXG4gKiDlkI7lj7BcbiAqL1xuc2VydmVyXG4gIC5nZXQoJy9jb250ZW50L2JnMmN0JywgYXN5bmMgKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ3NlcnZlci1iZzJjdCcsIHJlcXVlc3QpXG4gICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgIGJnMmN0OiB0cnVlXG4gICAgfSlcbiAgfSlcbiAgLmdldCgnL2NvbnRlbnQvcHAyY3QnLCBhc3luYyAocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICBjb25zb2xlLmxvZygnc2VydmVyLXBwMmN0JywgcmVxdWVzdClcbiAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgcHAyY3Q6IHRydWVcbiAgICB9KVxuICB9KVxuXG5hamF4XG4gIC5nZXQoJy9iYWNrZ3JvdW5kL2N0MmJnJywgeyBjdDogMSB9KVxuICAudGhlbigoZGF0YSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdnZXQtY3QyYmc6JywgZGF0YSlcbiAgfSlcblxuYWpheFxuICAuZ2V0KCcvcG9wdXAvY3QycHAnLCB7IGN0OiAyIH0pXG4gIC50aGVuKChkYXRhKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ2dldC1jdDJwcDonLCBkYXRhLCAncHDmsqHmnInmiZPlvIDvvIzojrflj5blj6/og73kuLp1bmRlZmluZWQnKVxuICB9KVxuIiwiLyoqXG4gKiDlsIbmnI3liqHms6jlhows5Lyq6KOF5oiQZXhwcmVzcy5yb3V0ZXJcbiAqIFxuICogY29udGVudC0+YmFja2dyb3VuZCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZVxuICogcG9wdXAtPmJhY2tncm91bmQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UvY2hyb21lLmV4dGVuc2lvbi5nZXRCYWNrZ3JvdW5kUGFnZVxuICogXG4gKiBjb250ZW50LT5wb3B1cCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZVxuICogYmFja2dyb3VuZC0+cG9wdXAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UvY2hyb21lLmV4dGVuc2lvbi5nZXRWaWV3c1xuICogXG4gKiBwb3B1cC0+Y29udGVudCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZVxuICogYmFja2dyb3VuZC0+Y29udGVudCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZVxuICogXG4gKiDnroDljZXnmoTor7TlsLHmmK/jgJBwb3B1cC9iYWNrZ3JvdW5k5pys6Lqr5bCx5YW35pyJ55u45ZCM55qE5p2D6ZmQ44CRXG4gKiBcbiAqIFxuICovXG5sZXQgbWV0aG9kcyA9IHt9XG5jb25zdCBhamF4ID0ge1xuICAgIGdldChrZXksIHBhcmFtcykge1xuICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoJy9iYWNrZ3JvdW5kLycpKSB7XG4gICAgICAgICAgICAvLyBjb250ZW50LT5iYWNrZ3JvdW5kIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlXG4gICAgICAgICAgICAvLyBwb3B1cC0+YmFja2dyb3VuZCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZS9jaHJvbWUuZXh0ZW5zaW9uLmdldEJhY2tncm91bmRQYWdlXG4gICAgICAgICAgICAvLyDor7vlj5blkI7lj7DmlbDmja5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgLi4ucGFyYW1zXG4gICAgICAgICAgICAgICAgfSwgcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSBpZiAoa2V5LnN0YXJ0c1dpdGgoJy9wb3B1cC8nKSkge1xuICAgICAgICAgICAgLy8gKiBjb250ZW50LT5wb3B1cCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZVxuICAgICAgICAgICAgLy8gKiBiYWNrZ3JvdW5kLT5wb3B1cCBjaHJvbWUuZXh0ZW5zaW9uLmdldFZpZXdzXG4gICAgICAgICAgICAvLyDor7vlj5Zjb250ZW505pWw5o2uXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBrZXksXG4gICAgICAgICAgICAgICAgICAgIC4uLnBhcmFtc1xuICAgICAgICAgICAgICAgIH0sIHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKGtleS5zdGFydHNXaXRoKCcvY29udGVudC8nKSkge1xuICAgICAgICAgICAgLy8gKiBwb3B1cC0+Y29udGVudCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZVxuICAgICAgICAgICAgLy8gKiBiYWNrZ3JvdW5kLT5jb250ZW50IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlXG4gICAgICAgICAgICAvLyDor7vlj5Zjb250ZW505pWw5o2uXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0sIGZ1bmN0aW9uICh0YWIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJbMF0uaWQsIHsgbWV0aG9kOiBrZXksIC4uLnBhcmFtcyB9LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgYWpheCIsIi8qKlxuICog5bCG5pyN5Yqh5rOo5YaMLOS8quijheaIkGV4cHJlc3Mucm91dGVyXG4gKiBcbiAqIOazqOWGjOS6i+S7tumDveaYryBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXJcbiAqL1xubGV0IG1ldGhvZHMgPSB7fVxuXG5jb25zdCBhcHAgPSB7XG4gICAgZ2V0KGtleSwgZm4pIHtcbiAgICAgICAgbWV0aG9kc1trZXldID0gZm5cbiAgICAgICAgcmV0dXJuIGFwcFxuICAgIH0sXG4gICAgLy8g5qih5ouf6Ieq5a6a5LmJXG4gICAgcG9zdChrZXksIGZuKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGtleSwgZm4sIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIGFwcFxuICAgIH1cbn1cblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAgIGlmIChtZXRob2RzW3JlcXVlc3QubWV0aG9kXSkge1xuICAgICAgICBtZXRob2RzW3JlcXVlc3QubWV0aG9kXShyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSlcbiAgICB9XG59KVxuZXhwb3J0IGRlZmF1bHQgYXBwIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzlCQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzdEQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0EiLCJzb3VyY2VSb290IjoiIn0=