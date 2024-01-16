// 封装本地数据的存储、读取与删除方法
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}

export const GET_TOKEN = () => {
  return localStorage.getItem('TOKEN')
}

export const REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN')
}
