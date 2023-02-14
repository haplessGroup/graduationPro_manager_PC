import request from '../request'
export function ForDoubanMessage(query: any) {
  return request({
    url: '/data/dbmoviemessage',
    method: 'GET',
    params: query,
  })
}
export function ForHotTravelCityMessage(query) {
  return request({
    url: '/data/hottravelcitymess',
    method: 'GET',
    params: query,
  })
}
export function ForProLanguageMessage(query) {
  return request({
    url: '/data/getprolanguagemess',
    method: 'GET',
    params: query,
  })
}
