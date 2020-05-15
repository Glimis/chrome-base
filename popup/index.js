import ajax from '../utils/ajax'


$('#getCookie')
	.click(async ()=>{
		let data = await ajax.get('/content/getCookie')
		$('#show').text(JSON.stringify(data))
	})

$('#changeLog')
	.click(()=>{
		ajax.get('/background/changeLog')
	})