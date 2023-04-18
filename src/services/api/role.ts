import request from '../request';
export function getRole(query: any) {
  return request({
    url: "/user/getrole",
    method: 'GET',
    params: query
  })
}
export function createRole(data: any) {
  console.log(data);

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
export function updateRole(data) {
  return request({
    url: "/user/updaterole",
    method: 'POST',
    data
  })
}

export function getRouteList(params) {
  return request({
    url: '/backend/routlist',
    method: 'GET',
    params
  })
}
