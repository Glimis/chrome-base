/**
 * 将服务注册,伪装成express.router
 * 
 * 对于content/background,注册事件都是 chrome.runtime.onMessage.addListener
 */
let methods = {}
 const ajax = {
    get(key,params){
        if(key.startsWith('/content/')){
            // 读取content数据
            return new Promise((resolve,reject)=>{
                chrome.tabs.query({active:true,currentWindow: true},function(tab){
                    if(tab.length > 0){
                        chrome.tabs.sendMessage(tab[0].id, {method:key,...params}, function(data) {
                                resolve(data)
                        });
                    }else{
                        reject()
                    }
                })
            } )
        }else if(key.startsWith('/background/')){
            // 读取后台数据
            return new Promise((resolve,reject)=>{
                chrome.runtime.sendMessage({
                    method:key,
                    ...params
                }, res => {
                    resolve(res)
                })
            })
        }
    }
 }
 export default ajax