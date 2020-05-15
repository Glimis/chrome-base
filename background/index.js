import server from '../utils/server'
/**
 * 后台
 */
server
    .get('/background/changeLog',(request, sender, sendResponse)=>{
        // 修改log
        chrome.browserAction.setIcon({path: `img/collect.png`});
    })
