/** 对 axios 进行二次封装 */
import axios from 'axios'

const request = axios.create({
  // 基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时时间
  timeout: 5000,
})

/** 添加请求拦截器 */
request.interceptors.request.use((config) => {
  /** 存储 token */
  // 返回配置对象
  return config
})

/** 添加响应拦截器 */
request.interceptors.response.use(
  (response) => {
    // 请求成功
    // 返回数据
    return response.data
  },
  (error) => {
    // 请求失败
    /** 主要处理 http 网络错误 */
    console.log(error)
  },
)

export default request
