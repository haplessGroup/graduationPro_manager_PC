import request from '../request'
//
export function getEnrollInfo() {
  return request({
    url: '/user/usercount',
    method: 'GET',
  })
}
export function getweekData() {
  return request({
    url: '/user/userweek',
    method: 'GET',
  })
}
