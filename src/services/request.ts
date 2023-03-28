import axios from 'axios'
import { ElMessage } from 'element-plus'

import errorCode from '@/utils/errorCode'

// 是否显示重新登录
export let isRelogin = { show: false }

// 指定Content-Type的格式，application/json
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL:
    (import.meta.env.VITE_BASE_URL as string) || 'http://127.0.0.1:8000/',
  // 'http://gapi.lltanalysis.cn',
  // 超时
  timeout: 10000,
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    if (getToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // // get请求映射params参数
    // if (config.method === 'get' && config.params) {
    //   let url = config.url + '?' + tansParams(config.params)
    //   url = url.slice(0, -1)
    //   config.params = {}
    //   config.url = url
    // }
    if (
      !isRepeatSubmit &&
      (config.method === 'post' || config.method === 'put')
    ) {
      const requestObj = {
        url: config.url,
        data:
          typeof config.data === 'object'
            ? JSON.stringify(config.data)
            : config.data,
        time: new Date().getTime(),
      }
    }
    return config
  },
  (error) => {
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code: number = res.data.code || 200
    // 获取错误信息
    const msg: string = res.data.msg || errorCode['default']
    // 二进制数据则直接返回
    if (
      res.request.responseType === 'blob' ||
      res.request.responseType === 'arraybuffer'
    ) {
      return res.data
    }
    if (code === 401) {
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      ElMessage({
        message: msg,
        type: 'error',
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      ElMessage.error({
        message: msg,
      })
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  (error) => {
    console.log('err' + error)
    let { message } = error
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  }
)

export default service
function getToken() {
  return window.localStorage.getItem('admintoken')
}
