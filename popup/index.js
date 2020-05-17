import server from '../utils/server'
import ajax from '../utils/ajax'

/**
 * 后台
 */
server
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

	ajax
		.get('/content/bg2ct')
		.then((data) => {
			console.log('get-bg2ct:', data)
		})

	ajax
		.get('/popup/bg2pp')
		.then((data) => {
			console.log('get-bg2pp:', data)
		})

}, 5000);