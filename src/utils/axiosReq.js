import axios from 'axios'
import { ElMessage } from 'element-plus'
import i18n from '@/lang'
import Cookies from 'js-cookie' // 引入 js-cookie


let requestData
const service = axios.create({
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // 超时时间
})

const appLocal = localStorage.getItem('language');
const localSet = appLocal && appLocal.indexOf('chinese') > -1 ? 'zh-CN' : 'en'

axios.defaults.xsrfHeaderName = 'Admin-Token'
// 请求拦截
service.interceptors.request.use(
  (request) => {
    /* 下载文件*/
    // 从 cookie 中获取 token
    const token = Cookies.get('gs_userToken'); // 使用 js-cookie 读取 token

    // 如果 token 存在，则在请求头中添加 Authorization 字段
    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`;
    }
    if (request.isDownLoadFile) {
      request.responseType = 'blob'
    }
    if (request.isUploadFile) {
      request.headers['Content-Type'] = 'multipart/form-data'
    }
    requestData = request
    if (request.method === 'get' && request.data) {
      request.params = request.data
      request.params['local'] = localSet
      request.data = {}
    }
    return request
  },
  (err) => {
    Promise.reject(err)
  }
)

// 响应拦截
service.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    if (err && err.response && (err.response.code || err.response.status)) {
       const message = err.response?.data?.message ? i18n.global.t(`Error.${err.response?.data?.message}`) : err
      // window.location.href = `/${status}`
      ElMessage({
        showClose: true,
        message: message,
        type: 'error',
      })
    } else {
      ElMessage({
        showClose: true,
        message: err,
        type: 'error',
      })
    }
    return Promise.reject(err)
  }
)

export default function khReqMethod({
  url,
  data,
  method,
  isParams,
  bfLoading,
  afHLoading,
  isUploadFile,
  isDownLoadFile,
  baseURL,
  timeout,
  isAlertErrorMsg
}) {
  return service({
    url: url,
    method: method ?? 'post',
    data: data ?? {},
    isParams: isParams ?? false,
    bfLoading: bfLoading ?? true,
    afHLoading: afHLoading ?? true,
    isUploadFile: isUploadFile ?? false,
    isDownLoadFile: isDownLoadFile ?? false,
    isAlertErrorMsg: isAlertErrorMsg ?? true,
    baseURL: baseURL ?? import.meta.env.VITE_APP_BASE_URL, // 设置基本基础url
    timeout: timeout ?? 15000 // 配置默认超时时间
  })
}
