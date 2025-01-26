import { onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import store from '@/store'

const { body } = document
const WIDTH = 480
export default function () {
  // 在手机页面，点击路由后，收缩侧边栏

  const $_isMobile = () => {
    // return /Mobi|Android|iPhone/i.test(navigator.userAgent)
    const rect = body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }
  const $_resizeHandler = () => {
    if (!document.hidden) {
      const isMobile = $_isMobile()
      store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')
    }
  }
  onBeforeMount(() => {
    window.addEventListener('resize', $_resizeHandler)
  })
  onMounted(() => {
    const isMobile = $_isMobile()
    console.log("isMobile", isMobile)
    store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', $_resizeHandler)
  })
}
