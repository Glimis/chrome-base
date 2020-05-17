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
export default app