<template>
  <div class="myChart">
    <div id="trend" style="width: 100%; height: 100%"></div>
    <div class="title">
      <div @click="status = !status" :style="comStyle">
        {{ titles }}
        <span class="iconfont" :style="comStyle">&#xe6eb;</span>
      </div>
      <div v-if="status" :style="comStyle">
        <div v-for="item in titles2" :key="item.key" @click="toggle(item.key)">
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance, onBeforeUnmount, computed, shallowRef } from 'vue'
import { trendData } from '@/api/trendApi/trend'
const { proxy }: any = getCurrentInstance()
const myChart = shallowRef<any>()
const trendList = ref<any>(null)
const status = ref(false)
const viewData = ref('map')
const titleFontSize = ref<number>()
onMounted(() => {
  gettrend()
  initEcharts()
  window.addEventListener('resize', screenAdapter)
  screenAdapter()
})
// eslint-disable-next-line vue/return-in-computed-property
const titles = computed(() => {
  if (!trendList.value) {
    return ''
  } else {
    return trendList.value[viewData.value].title
  }
})
const titles2 = computed(() => {
  if (!trendList.value) {
    return []
  } else {
    return trendList.value.type.filter((item: any) => {
      return item.key !== viewData.value
    })
  }
})
// 计算字体大小
const comStyle = computed(() => {
  return {
    fontSize: titleFontSize.value + 'px'
  }
})
// 初始化Echarts
const initEcharts = () => {
  myChart.value = proxy.$echarts.init(document.getElementById('trend'))
  const option = {
    legend: {
      top: '15%',
      icon: 'circle',
      textStyle: {
        fontSize: 18, //字体大小
        color: '#fff' //字体颜色
      }
    },
    tooltip: {
      trigger: 'axis',
      show: true,
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    grid: {
      left: '3%',
      top: '35%',
      right: '4%',
      bottom: '1%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }
    ]
  }
  myChart.value.setOption(option)
}
// 获取销量列表的数据
const gettrend = () => {
  trendData().then((res) => {
    console.log(res)
    trendList.value = res.data
    EchartsOpins()
  })
}
// 图表配置项
const EchartsOpins = () => {
  // 获取x轴的数据
  const timeArrs = trendList.value.common.month
  // 获取y轴的数据
  const valueArrs = trendList.value[viewData.value].data
  // 获取legend数据
  const legendArrs = valueArrs.map((item: any) => item.name)
  // // 半透明的颜色值
  const colorArr1 = [
    'rgba(11, 168, 44, 0.5)',
    'rgba(44, 110, 255, 0.5)',
    'rgba(22, 242, 217, 0.5)',
    'rgba(254, 33, 30, 0.5)',
    'rgba(250, 105, 0, 0.5)'
  ]
  // 全透明的颜色值
  const colorArr2 = [
    'rgba(11, 168, 44, 0)',
    'rgba(44, 110, 255, 0)',
    'rgba(22, 242, 217, 0)',
    'rgba(254, 33, 30, 0)',
    'rgba(250, 105, 0, 0)'
  ]
  const seriesArrs = valueArrs.map((item: any, index: number) => {
    return {
      name: item.name,
      type: 'line',
      data: item.data,
      stack: 'map',
      smooth: true,
      showSymbol: false,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: colorArr1[index] // 0% 处的颜色
            },
            {
              offset: 1,
              color: colorArr2[index] // 100% 处的颜色
            }
          ],
          global: false // 缺省为 false
        }
      }
    }
  })
  const option = {
    xAxis: {
      data: timeArrs
    },
    legend: {
      data: legendArrs
    },
    series: seriesArrs
  }
  myChart.value.setOption(option)
}
// 点击切换对应的数据
const toggle = (val: string) => {
  status.value = false
  viewData.value = val
  EchartsOpins()
}
// 自适应
const screenAdapter = () => {
  console.log('111111111')

  titleFontSize.value = (document.getElementById('trend')?.offsetWidth / 100) * 3.6
  const adapterOption = {
    legend: {
      itemWidth: titleFontSize.value,
      itemHeight: titleFontSize.value,
      itemGap: titleFontSize.value,
      textStyle: {
        fontSize: titleFontSize.value / 2
      }
    }
  }
  myChart.value.setOption(adapterOption)
  myChart.value.resize()
}
// 浏览器适配
onBeforeUnmount(() => {
  window.removeEventListener('resize', screenAdapter)
})
defineExpose({
  screenAdapter
})
</script>
<style scoped lang="scss">
.myChart {
  position: relative;
}
#trend {
  width: 100%;
  height: 100%;
}
.title {
  position: absolute;
  top: 20px;
  left: 40px;
  z-index: 999;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}
</style>
