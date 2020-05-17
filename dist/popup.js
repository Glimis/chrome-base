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
/******/ 	return __webpack_require__(__webpack_require__.s = "./popup/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./popup/index.js":
/*!************************!*\
  !*** ./popup/index.js ***!
  \************************/
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
	.get('/popup/ct2pp', async (request, sender, sendResponse) => {
		console.log('server-ct2pp', request)
		sendResponse({
			ct2pp: true
		})
	})
	.get('/popup/bg2pp', async (request, sender, sendResponse) => {
		console.log('server-bg2pp', request)
		sendResponse({
			bg2pp: true
		})
	})

setTimeout(() => {

	_utils_ajax__WEBPACK_IMPORTED_MODULE_1__["default"]
		.get('/content/bg2ct')
		.then((data) => {
			console.log('get-bg2ct:', data)
		})

	_utils_ajax__WEBPACK_IMPORTED_MODULE_1__["default"]
		.get('/popup/bg2pp')
		.then((data) => {
			console.log('get-bg2pp:', data)
		})

}, 5000);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vcG9wdXAvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vdXRpbHMvYWpheC5qcyIsIndlYnBhY2s6Ly8vLi91dGlscy9zZXJ2ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9wb3B1cC9pbmRleC5qc1wiKTtcbiIsImltcG9ydCBzZXJ2ZXIgZnJvbSAnLi4vdXRpbHMvc2VydmVyJ1xuaW1wb3J0IGFqYXggZnJvbSAnLi4vdXRpbHMvYWpheCdcblxuLyoqXG4gKiDlkI7lj7BcbiAqL1xuc2VydmVyXG5cdC5nZXQoJy9wb3B1cC9jdDJwcCcsIGFzeW5jIChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuXHRcdGNvbnNvbGUubG9nKCdzZXJ2ZXItY3QycHAnLCByZXF1ZXN0KVxuXHRcdHNlbmRSZXNwb25zZSh7XG5cdFx0XHRjdDJwcDogdHJ1ZVxuXHRcdH0pXG5cdH0pXG5cdC5nZXQoJy9wb3B1cC9iZzJwcCcsIGFzeW5jIChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuXHRcdGNvbnNvbGUubG9nKCdzZXJ2ZXItYmcycHAnLCByZXF1ZXN0KVxuXHRcdHNlbmRSZXNwb25zZSh7XG5cdFx0XHRiZzJwcDogdHJ1ZVxuXHRcdH0pXG5cdH0pXG5cbnNldFRpbWVvdXQoKCkgPT4ge1xuXG5cdGFqYXhcblx0XHQuZ2V0KCcvY29udGVudC9iZzJjdCcpXG5cdFx0LnRoZW4oKGRhdGEpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdnZXQtYmcyY3Q6JywgZGF0YSlcblx0XHR9KVxuXG5cdGFqYXhcblx0XHQuZ2V0KCcvcG9wdXAvYmcycHAnKVxuXHRcdC50aGVuKChkYXRhKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnZ2V0LWJnMnBwOicsIGRhdGEpXG5cdFx0fSlcblxufSwgNTAwMCk7IiwiLyoqXG4gKiDlsIbmnI3liqHms6jlhows5Lyq6KOF5oiQZXhwcmVzcy5yb3V0ZXJcbiAqIFxuICogY29udGVudC0+YmFja2dyb3VuZCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZVxuICogcG9wdXAtPmJhY2tncm91bmQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UvY2hyb21lLmV4dGVuc2lvbi5nZXRCYWNrZ3JvdW5kUGFnZVxuICogXG4gKiBjb250ZW50LT5wb3B1cCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZVxuICogYmFja2dyb3VuZC0+cG9wdXAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UvY2hyb21lLmV4dGVuc2lvbi5nZXRWaWV3c1xuICogXG4gKiBwb3B1cC0+Y29udGVudCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZVxuICogYmFja2dyb3VuZC0+Y29udGVudCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZVxuICogXG4gKiDnroDljZXnmoTor7TlsLHmmK/jgJBwb3B1cC9iYWNrZ3JvdW5k5pys6Lqr5bCx5YW35pyJ55u45ZCM55qE5p2D6ZmQ44CRXG4gKiBcbiAqIFxuICovXG5sZXQgbWV0aG9kcyA9IHt9XG5jb25zdCBhamF4ID0ge1xuICAgIGdldChrZXksIHBhcmFtcykge1xuICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoJy9iYWNrZ3JvdW5kLycpKSB7XG4gICAgICAgICAgICAvLyBjb250ZW50LT5iYWNrZ3JvdW5kIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlXG4gICAgICAgICAgICAvLyBwb3B1cC0+YmFja2dyb3VuZCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZS9jaHJvbWUuZXh0ZW5zaW9uLmdldEJhY2tncm91bmRQYWdlXG4gICAgICAgICAgICAvLyDor7vlj5blkI7lj7DmlbDmja5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgLi4ucGFyYW1zXG4gICAgICAgICAgICAgICAgfSwgcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSBpZiAoa2V5LnN0YXJ0c1dpdGgoJy9wb3B1cC8nKSkge1xuICAgICAgICAgICAgLy8gKiBjb250ZW50LT5wb3B1cCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZVxuICAgICAgICAgICAgLy8gKiBiYWNrZ3JvdW5kLT5wb3B1cCBjaHJvbWUuZXh0ZW5zaW9uLmdldFZpZXdzXG4gICAgICAgICAgICAvLyDor7vlj5Zjb250ZW505pWw5o2uXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBrZXksXG4gICAgICAgICAgICAgICAgICAgIC4uLnBhcmFtc1xuICAgICAgICAgICAgICAgIH0sIHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKGtleS5zdGFydHNXaXRoKCcvY29udGVudC8nKSkge1xuICAgICAgICAgICAgLy8gKiBwb3B1cC0+Y29udGVudCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZVxuICAgICAgICAgICAgLy8gKiBiYWNrZ3JvdW5kLT5jb250ZW50IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlXG4gICAgICAgICAgICAvLyDor7vlj5Zjb250ZW505pWw5o2uXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0sIGZ1bmN0aW9uICh0YWIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJbMF0uaWQsIHsgbWV0aG9kOiBrZXksIC4uLnBhcmFtcyB9LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgYWpheCIsIi8qKlxuICog5bCG5pyN5Yqh5rOo5YaMLOS8quijheaIkGV4cHJlc3Mucm91dGVyXG4gKiBcbiAqIOazqOWGjOS6i+S7tumDveaYryBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXJcbiAqL1xubGV0IG1ldGhvZHMgPSB7fVxuXG5jb25zdCBhcHAgPSB7XG4gICAgZ2V0KGtleSwgZm4pIHtcbiAgICAgICAgbWV0aG9kc1trZXldID0gZm5cbiAgICAgICAgcmV0dXJuIGFwcFxuICAgIH0sXG4gICAgLy8g5qih5ouf6Ieq5a6a5LmJXG4gICAgcG9zdChrZXksIGZuKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGtleSwgZm4sIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIGFwcFxuICAgIH1cbn1cblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAgIGlmIChtZXRob2RzW3JlcXVlc3QubWV0aG9kXSkge1xuICAgICAgICBtZXRob2RzW3JlcXVlc3QubWV0aG9kXShyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSlcbiAgICB9XG59KVxuZXhwb3J0IGRlZmF1bHQgYXBwIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM3REE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBIiwic291cmNlUm9vdCI6IiJ9