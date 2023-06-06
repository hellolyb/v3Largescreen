import type { App } from 'vue'
import echarts from './registerEcharts'
export const globalRgeisters = {
  install: (app: App) => {
    app.use(echarts)
  }
}
