import axios from 'axios'

function httpForAllAdvice(){
	const path='http://127.0.0.1:5000/getalladvice'
	return axios.get(path)
}
function httpForAllAccount(){
	const path='http://127.0.0.1:5000/getallaccount'
	return axios.get(path)
}
function httpForAccountStatus(){
	const path='http://127.0.0.1:5000/countaccstatus'
	return axios.get(path)
}
function httpForDoubanMessage(){
	const path='http://127.0.0.1:5000/dbmoviemessage'
	return axios.get(path)
}
function httpForProLanguageMessage(){
	const path="http://127.0.0.1:5000/getprolanguagemess"
	return axios.get(path)
}
function httpForHotTravelCityMessage(){
	const path="http://127.0.0.1:5000/hottravelcitymess"
	return axios.get(path)
}

export default {
	httpForAllAdvice,
	httpForAllAccount,
	httpForAccountStatus,
	httpForDoubanMessage,
	httpForProLanguageMessage,
	httpForHotTravelCityMessage
}