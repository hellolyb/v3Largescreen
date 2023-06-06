<template>
  <div class="myChart">
    <div id="stock" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, getCurrentInstance, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { stockData } from '@/api/stock/stockApi'
const { proxy }: any = getCurrentInstance()
const myChart = shallowRef<any>(null)
const stockList = ref<any>()
const showData = ref<any>()
const currentIndex = ref<number>(0) // 页码
const timerId = ref<number>() // 定时器
onMounted(() => {
  initEcharts()
  getData()
  window.addEventListener('resize', screenAdapter)
})
// 初始化Echarts
const initEcharts = () => {
  myChart.value = proxy.$echarts.init(document.getElementById('stock'))
  const option = {
    title: {
      text: '▎库存销售量',
      left: 20,
      top: 20,
      textStyle: {
        color: '#fff'
      }
    }
  }
  myChart.value.on('mouseover', () => {
    clearInterval(timerId.value)
  })
  myChart.value.on('mouseout', () => {
    startInterval()
  })
  myChart.value.setOption(option)
}
// 获取数据
const getData = async () => {
  stockData().then((res) => {
    stockList.value = res.data
    updataEcharts()
    screenAdapter()
    startInterval()
  })
}
// 更新图表
const updataEcharts = () => {
  // 处理图表需要的数据
  // 5个圆环对应的圆心点
  const centerPointers = [
    ['18%', '40%'],
    ['50%', '40%'],
    ['82%', '40%'],
    ['34%', '75%'],
    ['66%', '75%']
  ]
  // 增加5个圆环的渐变颜色范围
  const colorArrs = [
    ['#4FF778', '#0BA82C'],
    ['#E5DD45', '#E8B11C'],
    ['#E8821C', '#E55445'],
    ['#5052EE', '#AB6EE5'],
    ['#23E5E5', '#2E72BF']
  ]
  // 先展示前五条数据
  const start = currentIndex.value * 5
  const end = (currentIndex.value + 1) * 5
  showData.value = stockList.value.slice(start, end)
  const seriesArr = showData.value.map((item: any, index: number) => {
    return {
      type: 'pie',
      center: centerPointers[index],
      hoverAnimation: false, // 移除划过动画
      labelLine: {
        show: false // 移除指标线
      },
      data: [
        {
          value: item.sales,
          name: item.name + '\n\n' + item.stock,
          itemStyle: {
            color: new proxy.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: colorArrs[index][0]
              },
              {
                offset: 1,
                color: colorArrs[index][1]
              }
            ])
          },
          label: {
            show: true,
            position: 'center',
            color: colorArrs[index][0]
          }
        },
        {
          value: item.stock,
          itemStyle: {
            color: '#333'
          }
        }
      ]
    }
  })
  const options = {
    series: seriesArr
  }
  myChart.value.setOption(options)
}
const startInterval = () => {
  if (!timerId.value) {
    clearInterval(timerId.value)
  }
  timerId.value = setInterval(() => {
    currentIndex.value++
    if (currentIndex.value > 1) {
      currentIndex.value = 0
    }
    updataEcharts()
  }, 5000)
}
// 自适应
const screenAdapter = () => {
  const titleFontSize = (document.getElementById('stock')?.offsetWidth / 100) * 3.6
  const adapterOption = {
    tooltip: {
      trigger: 'item'
    },
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    series: [
      {
        radius: [titleFontSize * 2.8, titleFontSize * 2.8 * 1.125],
        label: { fontSize: titleFontSize / 2 }
      },
      {
        radius: [titleFontSize * 2.8, titleFontSize * 2.8 * 1.125],
        label: { fontSize: titleFontSize / 2 }
      },
      {
        radius: [titleFontSize * 2.8, titleFontSize * 2.8 * 1.125],
        label: { fontSize: titleFontSize / 2 }
      },
      {
        radius: [titleFontSize * 2.8, titleFontSize * 2.8 * 1.125],
        label: { fontSize: titleFontSize / 2 }
      },
      {
        radius: [titleFontSize * 2.8, titleFontSize * 2.8 * 1.125],
        label: { fontSize: titleFontSize / 2 }
      }
    ]
  }

  myChart.value.setOption(adapterOption)
  myChart.value.resize()
}

onBeforeUnmount(() => {
  clearInterval(timerId.value)
  window.removeEventListener('resize', screenAdapter)
})
defineExpose({
  screenAdapter
})
</script>
<style scoped lang="scss"></style>
