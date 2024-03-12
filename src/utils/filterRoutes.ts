// 过滤当前角色需要的路由对象
export const filterAsyncRoute = (asyncRoute: any[], userRoute: string[]): any[] => {
  return asyncRoute.filter((item) => {
    if (userRoute.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, userRoute)
      }
      return true
    }
  })
}
