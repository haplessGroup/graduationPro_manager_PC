import request from '../request'
//登录
export function LoginAdmin(data: any) {
  return request({
    url: '/backend/adminlogin',
    method: 'POST',
    data: data,
  })
}
//获取全部登录信息
export function ForAllAdvice(query: any) {
  return request({
    url: '/backend/getalladvice',
    method: 'GET',
    params: query,
  })
}
//获取账号状态
export function ForAccountStatus() {
  return request({
    url: '/backend/countaccstatus',
    method: 'GET',
  })
}
//获取全部建议
export function getAdvices(data) {
  return request({
    url: '/backend/selectadvicestatu',
    method: 'POST',
    data,
  })
}
//回复建议
export function updatedAdvice(data) {
  return request({
    url: '/backend/submitreresult',
    method: 'POST',
    data,
  })
}
//获取全部账号
export function ForAllAccount(query: any) {
  return request({
    url: '/backend/getallaccount',
    method: 'GET',
    params: query,
  })
}
//获取账号详情
export function ForAccount(data) {
  return request({
    url: '/backend/searchaccinfo',
    method: 'POST',
    data,
  })
}
//提交账号状态
export function updateAccount(data) {
  return request({
    url: '/backend/useraccounthand',
    method: 'POST',
    data,
  })
}
//选择账号状态搜索
export function selectAccount(data) {
  return request({
    url: '/backend/selectaccstatu',
    method: 'POST',
    data,
  })
}
//处理账号注册信息
export function changeAccount(data) {
  return request({
    url: '/backend/userregiinfohand',
    method: 'POST',
    data,
  })
}
