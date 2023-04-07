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
export function getAdvices(data: any) {
  return request({
    url: '/backend/selectadvicestatu',
    method: 'POST',
    data,
  })
}
//回复建议
export function updatedAdvice(data: { statu: string; re: string; id: string; account: string }) {
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
export function ForAccount(data: { key: any; skip: number; page: number; flag: number }) {
  return request({
    url: '/backend/searchaccinfo',
    method: 'POST',
    data,
  })
}
//提交账号状态
export function updateAccount(data: { account: string; accstatus: any; isloginallowed: any, user_id: number, role_list: number }) {
  return request({
    url: '/backend/useraccounthand',
    method: 'POST',
    data,
  })
}
//删除账号状态
export function deleteAccount(data: { account: String, user_id: number }) {
  return request({
    url: '/user/userdel',
    method: 'POST',
    data,
  })
}
//添加用户
export function createAccount(data: any) {
  return request({
    url: '/user/registration',
    method: 'POST',
    data,
  })
}
//选择账号状态搜索
export function selectAccount(data: any) {
  return request({
    url: '/backend/selectaccstatu',
    method: 'POST',
    data,
  })
}
//处理账号注册信息
export function changeAccount(data: { account: string; isloginallowed: any }) {
  return request({
    url: '/backend/userregiinfohand',
    method: 'POST',
    data,
  })
}
