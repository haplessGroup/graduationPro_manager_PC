import request from '../request'
//
export function ForDoubanMessage(query: any) {
  return request({
    url: '/data/dbmoviemessage',
    method: 'GET',
    params: query,
  })
}
export function ForHotTravelCityMessage(query: any) {
  return request({
    url: '/data/hottravelcitymess',
    method: 'GET',
    params: query,
  })
}
export function ForProLanguageMessage(query: any) {
  return request({
    url: '/data/getprolanguagemess',
    method: 'GET',
    params: query,
  })
}
export function deleteLanguageMessage(data: any) {
  return request({
    url: '/data/languagemesstodel',
    method: 'DELETE',
    data,
  })
}
export function deleteMovieMessage(data: any) {
  return request({
    url: '/data/deletemessage',
    method: 'DELETE',
    data,
  })
}
export function deleteCityMessage(data: any) {
  return request({
    url: '/data/languagemesstodel',
    method: 'DELETE',
    data,
  })
}
