import server from '../utils/server'

/**
 * 后台
 */
server
    .get('/content/getCookie',(request, sender, sendResponse)=>{
        // 读取cookie
        sendResponse({
          cookie:window.document.cookie
        })
    })