<template>
  <div class="myChart">
    <div id="Rank"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, reactive, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { rankData } from '@/api/rank/rankApi'
const myChart = shallowRef<any>(null)
// 平移动画所需参数
const toggle = reactive<any>({
  chartInstance: null,
  allData: null,
  startValue: 0,
  endValue: 9,
  timerId: null
})

const { proxy }: any = getCurrentInstance()
onMounted(() => {
  initEcharts()
  getData()
  window.addEventListener('resize', screenAdapter)
  screenAdapter()
})
// 初始化Echarts
const initEcharts = () => {
  myChart.value = proxy.$echarts.init(document.getElementById('Rank'))
  const option = {
    title: {
      text: '▎地区销售排行',
      left: 20,
      top: 30,
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      show: true
    },
    xAxis: {
      type: 'category',
      data: [],
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true // 不显示坐标轴线
      },
      splitLine: {
        show: false
      }
    },
    grid: {
      top: '40%',
      left: '5%',
      bottom: '5%',
      right: '5%',
      containLabel: true
    },
    series: [
      {
        data: [],
        type: 'bar',
        label: {
          show: true,
          position: 'top',
          rotate: 40,
          distance: 15,
          textStyle: {
            color: '#fff'
          }
        }
      }
    ]
  }
  myChart.value.on('mouseover', () => {
    clearInterval(toggle.timerId)
  })
  myChart.value.on('mouseout', () => {
    startInterval()
  })
  myChart.value.setOption(option)
}
// 获取rank的数据
const getData = async () => {
  const rankList = await rankData()
  toggle.allData = await rankList.data
  const sortrankList = rankList.data.sort((a: any, b: any) => {
    return b.value - a.value
  })
  // y轴的数据
  const name = sortrankList.map((item: any) => {
    return item.name
  })
  // x轴的数据
  const value = sortrankList.map((item: any) => {
    return item.value
  })
  // 柱子颜色
  const colorArr = [
    ['#0BA82C', '#4FF778'],
    ['#2E72BF', '#23E5E5'],
    ['#5052EE', '#AB6EE5']
  ]
  const option = {
    xAxis: {
      data: name
    },
    dataZoom: {
      show: false,
      startValue: toggle.startValue,
      endValue: toggle.endValue
    },
    series: {
      data: value,
      itemStyle: {
        borderRadius: [33, 33, 0, 0],
        color: (arg: any) => {
          let targetColorArr = null
          if (arg.value > 300) {
            targetColorArr = colorArr[0]
          } else if (arg.value >= 200) {
            targetColorArr = colorArr[1]
          } else {
            targetColorArr = colorArr[2]
          }
          return new proxy.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: targetColorArr[0]
            },
            {
              offset: 1,
              color: targetColorArr[1]
            }
          ])
        }
      }
    }
  }
  myChart.value.setOption(option)
  startInterval()
}
// 当窗口浏览器发生变化自适应
const screenAdapter = () => {
  const titleFontSize = (document.getElementById('Rank')?.offsetWidth / 100) * 3.6
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
          barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
          label: {
            fontSize: titleFontSize / 2
          }
        }
      }
    ]
  }
  myChart.value.setOption(option)
  myChart.value.resize()
}
// 平移动画
const startInterval = () => {
  if (toggle.timerId) {
    clearInterval(toggle.timerId)
  }
  toggle.timerId = setInterval(() => {
    toggle.startValue++
    toggle.endValue++
    if (toggle.endValue > toggle.allData.length - 1) {
      toggle.startValue = 0
      toggle.endValue = 9
    }
    getData()
  }, 1500)
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', screenAdapter)
  clearInterval(toggle.timerId)
})
defineExpose({
  screenAdapter
})
</script>
<style scoped lang="scss">
#Rank {
  width: 100%;
  height: 100%;
}
</style>
