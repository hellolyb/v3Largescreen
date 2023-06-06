import * as echarts from 'echarts'
import type { App } from 'vue'
export default function echartsController(app: App) {
  app.config.globalProperties.$echarts = echarts
}
