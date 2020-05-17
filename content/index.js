import server from '../utils/server'
import ajax from '../utils/ajax'

/**
 * 后台
 */
server
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

ajax
  .get('/background/ct2bg', { ct: 1 })
  .then((data) => {
    console.log('get-ct2bg:', data)
  })

ajax
  .get('/popup/ct2pp', { ct: 2 })
  .then((data) => {
    console.log('get-ct2pp:', data, 'pp没有打开，获取可能为undefined')
  })
