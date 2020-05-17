import server from '../utils/server'
import ajax from '../utils/ajax'

/**
 * 后台
 */
server
    .get('/background/ct2bg', async (request, sender, sendResponse) => {
        console.log('server-ct2bg', request)
        sendResponse({
            ct2bg: true
        })
    })
    .get('/background/pp2bg', async (request, sender, sendResponse) => {
        console.log('server-pp2bg', request)
        sendResponse({
            pp2bg: true
        })
    })


setTimeout(() => {
    // 需要打开content或pp
    ajax
        .get('/content/bg2ct')
        .then((data) => {
            console.log('get-bg2ct:', data, '依赖content选中')
        })

    ajax
        .get('/popup/bg2pp')
        .then((data) => {
            console.log('get-bg2pp:', data, '依赖pp打开')
        })

}, 5000)
