<template>
  <div class="myChart">
    <div id="hotproduct" style="width: 100%; height: 100%"></div>
    <span class="iconfont arr_left" @click="toggleLeft" :style="fontSize">&#xe6ef;</span>
    <span class="iconfont arr_right" @click="toggleright" :style="fontSize">&#xe6ed;</span>
    <span class="title" style="color: aliceblue" :style="fontSize">{{ titles }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, getCurrentInstance, onBeforeUnmount, shallowRef } from 'vue'
import { gethotproduct } from '@/api/hotproduct/hotproductApi'
const { proxy }: any = getCurrentInstance()

const myChart = shallowRef<any>(null)
const allData = ref<any>()
const allDataLingth = ref<number>(0)
const titleFontSize = ref<any>()
onMounted(() => {
  getDate()
  initEcharts()
  window.addEventListener('resize', screenAdapter)
  screenAdapter()
})
// 初始化Echarts
const initEcharts = () => {
  myChart.value = proxy.$echarts.init(document.getElementById('hotproduct'))
  const option = {
    title: {
      text: '▎热销商品占比',
      top: '20',
      left: '40',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        let tipArray: any = []
        params.data.children.forEach((element: any) => {
          let childStr = `
            ${element.name}&nbsp;&nbsp;
            ${parseInt((element.value / params.value) * 100) + '%'}
            `
          tipArray.push(childStr)
        })
        return tipArray.join('<br/>')
      }
    },
    legend: {
      orient: 'horizontal',
      left: 'center',
      top: '13%',
      icon: 'circle',
      textStyle: {
        color: '#fff',
        fontSize: '20'
      }
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ],
        label: {
          color: 'inherit'
        }
      }
    ]
  }
  myChart.value.setOption(option)
}
const getDate = () => {
  gethotproduct().then((res) => {
    allData.value = res.data
    updataEch()
  })
}
// eslint-disable-next-line vue/return-in-computed-property
const titles = computed(() => {
  if (allData.value) {
    return allData.value[allDataLingth.value].name
  }
})
// eslint-disable-next-line vue/return-in-computed-property
const fontSize = computed(() => {
  return {
    fontSize: titleFontSize.value + 'px'
  }
})
const updataEch = async () => {
  const seriesData = allData.value[allDataLingth.value].children.map((item: any) => {
    return {
      name: item.name,
      value: item.value,
      children: item.children
    }
  })
  console.log(seriesData, '123456789')

  const option = {
    series: [
      {
        data: seriesData
      }
    ]
  }
  myChart.value.setOption(option)
}
// 数据进行切换
const toggleLeft = () => {
  allDataLingth.value--
  if (allDataLingth.value < 0) {
    allDataLingth.value = allData.value.length - 1
  }
  updataEch()
}
const toggleright = () => {
  allDataLingth.value++
  if (allDataLingth.value > allData.value.length - 1) {
    allDataLingth.value = 0
  }
  updataEch()
}
// 图表进行适配
const screenAdapter = () => {
  titleFontSize.value = (document.getElementById('hotproduct')?.offsetWidth / 100) * 3.6
  const option = {
    title: {
      textStyle: {
        fontSize: titleFontSize.value
      }
    },
    legend: {
      textStyle: {
        fontSize: titleFontSize.value / 2
      }
    }
  }
  myChart.value.setOption(option)
  myChart.value.resize()
}
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
  .arr_left {
    position: absolute;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #fff;
  }
  .arr_right {
    position: absolute;
    right: 10%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #fff;
  }
  .title {
    position: absolute;
    bottom: 80px;
    right: 100px;
  }
}
</style>
