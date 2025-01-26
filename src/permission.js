import router from '@/router'
import store from './store'
import NProgress from 'nprogress'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/getPageTitle'
const userRoutes = ["Reanalysis", "Customed", "Molecular", "Spectrum", "Results", "TaskDetail"]

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  if (to.path.indexOf('chinese') > -1 || to.path.indexOf('english') > -1) {
    localStorage.setItem('language', to.path)
    window.location.reload()
  } else {
    // set page title
    document.title = getPageTitle(to.meta.title)
    // 判断用户是否登录
    const userInfo = store.getters.userInfo // 从 getters 中获取用户信息
    const isLoggedIn = !!userInfo?.id // 如果 userInfo 存在，则认为用户已登录
    // 如果访问的是需要登录的路由且用户未登录
    if (userRoutes.includes(to.name) && !isLoggedIn) {
      next({ path: '/login', query: { redirect: to.fullPath } }) // 跳转到登录页，并记录当前路由
      NProgress.done()
      return
    }

    // next()
    let accessRoutes = []
    accessRoutes = await store.dispatch('permission/generateRoutes', [])
    accessRoutes.forEach((route) => {
      router.addRoute(route)
    })
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})
