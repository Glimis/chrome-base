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
export default ajax