import axios from 'axios'

function httpForAllAdvice() {
  const path = 'http://127.0.0.1:5310/getalladvice'
  return axios.get(path)
}
function httpForAllAccount() {
  const path = 'http://127.0.0.1:5310/getallaccount'
  return axios.get(path)
}
function httpForAccountStatus() {
  const path = 'http://127.0.0.1:5310/countaccstatus'
  return axios.get(path)
}
function httpForDoubanMessage() {
  const path = 'http://127.0.0.1:5310/dbmoviemessage'
  return axios.get(path)
}
function httpForProLanguageMessage() {
  const path = 'http://127.0.0.1:5310/getprolanguagemess'
  return axios.get(path)
}
function httpForHotTravelCityMessage() {
  const path = 'http://127.0.0.1:5310/hottravelcitymess'
  return axios.get(path)
}

export default {
  httpForAllAdvice,
  httpForAllAccount,
  httpForAccountStatus,
  httpForDoubanMessage,
  httpForProLanguageMessage,
  httpForHotTravelCityMessage,
}
