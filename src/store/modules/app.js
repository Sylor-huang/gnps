const state = {
  device: 'desktop',
  cachedViews: [],
  theme: localStorage["theme"] || "default",
  userInfo: JSON.parse(localStorage.getItem("gs_userInfo")) || {}, // 从 localStorage 中获取用户信息
}

const mutations = {

  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  /*keepAlive缓存*/
  M_ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view)) return
    state.cachedViews.push(view)
  },
  M_DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view)
    index > -1 && state.cachedViews.splice(index, 1)
  },
  M_RESET_CACHED_VIEW: (state) => {
    state.cachedViews = []
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  TOGGLE_THEME: (state, theme) => {
    state.theme = theme
    localStorage.setItem('theme', theme)
  },
  SET_LOGIN_STATUS(state, status) {
    state.isLoggedIn = status;
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo;
  },
}
const actions = {
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  toggleTheme({ commit }, theme) {
    commit('TOGGLE_THEME', theme)
  },
  toggleUserInfo({ commit }, userInfo) {
    commit('SET_USER_INFO', userInfo)
    localStorage.setItem("gs_userInfo", JSON.stringify(userInfo)); // 将用户信息存储到 localStorage
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
