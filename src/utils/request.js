import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: '/sys', // url = base url + request url
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
service.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'
service.defaults.transformRequest = [function(data) {
  let src = ''
  for (var item in data) {
    src += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
  }
  return src
}]

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // 如果返回的数据中有access_token则把token储存起来(注：这个是后台在请求的时候验证token快要超时时，重新给返回了一个token)
    if (res.data && res.data.access_token) {
      store.dispatch('user/saveToken', res.data.access_token)
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code != null && res.code !== 20000) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014 || res.code === 50015) {
        var message = res.code === 50015 ? res.msg : '登录已过期！请重新登录'
        // to re-login
        MessageBox.confirm(message, '重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        Message({
          message: res.msg || 'error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      // return Promise.reject(res.msg || 'error')
    }
    const indexs = response.config.responseType
    if (indexs === 'blob') {
      const blob = new Blob([res], { type: 'image/png' })
      const url = window.URL.createObjectURL(blob)
      return Promise.resolve(url)
    }
    return res
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
