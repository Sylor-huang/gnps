import { createStore } from 'vuex'
import getters from './getters'

// 使用 import.meta.glob 替代 import.meta.globEager
const modulesFiles = import.meta.glob('./modules/*.js', { eager: true })

let modules = {}
for (const path in modulesFiles) {
  const moduleName = path.replace(/(.*\/)*([^.]+).*/gi, '$2')
  modules[moduleName] = modulesFiles[path].default
}

export default createStore({
  modules,
  getters
})
