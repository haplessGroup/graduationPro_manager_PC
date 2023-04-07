import request from '../request'
export function getRole(query: any) {
  return request({
    url: "/user/getrole",
    method: 'GET',
    params: query
  })
}
export function createRole(data: any) {
  return request({
    url: "/user/createrole",
    method: 'POST',
    data
  })
}
export function deleteRole(data: any) {
  return request({
    url: "/user/delrole",
    method: 'POST',
    data
  })
}
