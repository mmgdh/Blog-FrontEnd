import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue';
import qs from 'qs'

// const BaseURL='http://118.195.172.226:88'
const BaseURL='http://localhost:80'

const service = axios.create({
  // 联调
  // baseURL: 'http://172.17.0.11:80',
  // baseURL: 'http://localhost:83',
  baseURL:BaseURL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  // 是否跨站点访问控制请求
  withCredentials: true,
  timeout: 1000 * 60 * 5,
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true
  },
  paramsSerializer: params => {
    return qs.stringify(params, {
      indices: false
    })
  }
})

// 请求拦截器
service.interceptors.request.use((config: AxiosRequestConfig) => {
  if (localStorage.getItem('JWT') && config.headers) {
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('JWT');
  }
  return config
}, (error) => {
  // 错误抛到业务代码
  error.data = {}
  error.data.msg = '服务器异常，请联系管理员！'
  return Promise.resolve(error)
})

// 响应拦截器
service.interceptors.response.use((response: AxiosResponse) => {
  const status = response.status
  let msg = ''
  if (status < 200 || status >= 300) {
    // 处理http错误，抛到业务代码
    if (response.data == "" || response.data) {
      msg = showStatus(status)
    }
    else {
      msg = response.data
    }

    message.warn(msg);
    if (typeof response.data === 'string') {
      response.data = { msg }
    } else {
      response.data.msg = msg
    }
  }
  return response
}, (error) => {
  // 错误抛到业务代码
  error.data = {}
  error.data.msg = '请求超时或服务器异常，请检查网络或联系管理员！'
  return Promise.resolve(error)
})

/* 同步Get方法
*/
export function get(url:string,params: any = undefined, timeout: number = 1000 * 60 * 5) :any{
  return service.get(url)
}

/**
 * get 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function getAsync(url: any, params: any = undefined, timeout: number = 1000 * 60 * 5): any {
  return new Promise((resolve, reject) => {
    let method: Promise<any>;
    if (params) {
      method = service
        .get(url, { params: params, timeout: timeout })
    }
    else {
      method = service.get(url)
    }
    method
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url: any, data = {}, timeout: number = 1000 * 60 * 5): any {
  return new Promise((resolve, reject) => {
    service.post(url, data, { timeout: timeout }).then(
      (response) => {
        resolve(response.data)
      },
      (err) => {
        reject(err)
      }
    )
  })
}
/**
* post 请求方法
* @param url
* @param data
* @returns {Promise}
*/
export function put(url: any, data = {}, timeout: number = 1000 * 60 * 5): any {
  return new Promise((resolve, reject) => {
    service.put(url, data, { timeout: timeout }).then(
      (response) => {
        resolve(response.data)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

/**
* Delete 请求方法
* @param url
* @param data
* @returns {Promise}
*/
export function Delete(url: any, data = {}, timeout: number = 1000 * 60 * 5): any {
  return new Promise((resolve, reject) => {
    service.delete(url, { params: data }).then(
      (response) => {
        resolve(response.data)
      },
      (err) => {
        reject(err)
      }
    )
  })
}


const showStatus = (status: number) => {
  let message = ''
  switch (status) {
    case 400:
      message = '请求错误(400)'
      break
    case 401:
      message = '未授权，请重新登录(401)'
      break
    case 403:
      message = '拒绝访问(403)'
      break
    case 404:
      message = '请求出错(404)'
      break
    case 408:
      message = '请求超时(408)'
      break
    case 500:
      message = '服务器错误(500)'
      break
    case 501:
      message = '服务未实现(501)'
      break
    case 502:
      message = '网络错误(502)'
      break
    case 503:
      message = '服务不可用(503)'
      break
    case 504:
      message = '网络超时(504)'
      break
    case 505:
      message = 'HTTP版本不受支持(505)'
      break
    default:
      message = `连接出错(${status})!`
  }
  return `${message}，请检查网络或联系管理员！`
}
export function getUri(): string {
  return BaseURL;
} 