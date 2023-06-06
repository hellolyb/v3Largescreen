<template>
  <div class="myChart">
    <div id="main"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance, onBeforeUnmount, shallowRef } from 'vue'
import { sellerData } from '@/api/sellerApi/seller'
const { proxy }: any = getCurrentInstance()
const myChart = shallowRef<any>(null)
const EchartsDataAll = ref<any>([])
const showData = ref<any>([])
const pageNum = ref<number>(1)
const pageSize = ref<number>(5)
const Total = ref<number>()
const timer = ref<number>()
onMounted(() => {
  initEcharts()
  getsellerData()
  setTime()
  window.addEventListener('resize', screenAdapter)
  screenAdapter()
})
// 初始化echarts
const initEcharts = () => {
  myChart.value = proxy.$echarts.init(document.getElementById('main'))
  const option = {
    title: {
      text: '▎商家销量排行',
      left: 20,
      top: 20,
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      top: '20%',
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
      axisLine: {
        show: true // 不显示坐标轴线
      }
    },
    yAxis: {
      type: 'category',
      axisTick: {
        show: false
      }
    },
    tooltip: {
      axisPointer: {
        type: 'shadow'
      }
    },
    series: [
      {
        type: 'bar',
        barWidth: 66,
        itemStyle: {
          barBorderRadius: [0, 33, 33, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: '#5052EE' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#AB6EE5' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        label: {
          show: true,
          position: 'right',
          textStyle: {
            color: '#fff'
          }
        }
      }
    ]
  }
  myChart.value.setOption(option)
  // 鼠标悬停
  myChart.value.on('mouseover', () => {
    clearInterval(timer.value)
  })
  // 鼠标离开
  myChart.value.on('mouseout', () => {
    setTime()
  })
  window.addEventListener('resize', (onresize) => {
    myChart.value.resize()
  })
}
// 获取数据
const getsellerData = async () => {
  try {
    const sellerList = await sellerData()
    console.log('sellerList=>', sellerList)
    EchartsDataAll.value = sellerList.data
    // 进行排序
    EchartsDataAll.value = EchartsDataAll.value.sort((a: any, b: any) => {
      return a.value - b.value
    })
    // 计算总数量
    Total.value =
      EchartsDataAll.value.length % 5 === 0
        ? EchartsDataAll.value.length / 5 + 1
        : EchartsDataAll.value.length / 5 + 1
    EchartsOpins()
  } catch (e) {
    console.log(e)
  }
}
// 配置图表
const EchartsOpins = () => {
  // 进行剪切处理
  const start = (pageNum.value - 1) * 5
  const end = pageSize.value * pageNum.value
  showData.value = EchartsDataAll.value.slice(start, end)
  // 返回出name数组
  const name = showData.value.map((item: any) => {
    return item.name
  })
  // 返回出value数组
  const value = showData.value.map((item: any) => {
    return item.value
  })
  // 图表配置项
  const option = {
    yAxis: {
      data: name
    },
    series: [
      {
        data: value
      }
    ]
  }
  // 渲染图表
  myChart.value.setOption(option)
}
// 定义定时器
const setTime = () => {
  // 先销毁定时器 避免越来越快
  clearInterval(timer.value)
  // 每三秒执行一次
  timer.value = setInterval(() => {
    pageNum.value++
    // 如果总数量 等于pageNum的数量代表轮播到了最后一页
    if (Total.value === pageNum.value) {
      pageNum.value = 1
    }
    EchartsOpins()
  }, 3000)
}
// 当窗口浏览器发生变化会触发的方法
const screenAdapter = () => {
  const titleFontSize = (document.getElementById('main')?.offsetWidth / 100) * 3.6
  console.log(titleFontSize)
  const option = {
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    series: [
      {
        barWidth: titleFontSize,
        itemStyle: {
          barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
        }
      }
    ]
  }
  myChart.value.setOption(option)
  myChart.value.resize()
}
// 组件销毁触发的钩子函数
onBeforeUnmount(() => {
  clearInterval(timer.value)
  window.removeEventListener('resize', screenAdapter)
})
defineExpose({
  screenAdapter
})
</script>
<style scoped lang="scss">
#main {
  width: 100%;
  height: 100%;
}
</style>
