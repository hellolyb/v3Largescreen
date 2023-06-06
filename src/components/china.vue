<template>
  <div class="myChart" @dblclick="revertMap">
    <div id="map" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount, getCurrentInstance, onMounted, shallowRef } from 'vue'
import axios from 'axios'
import { name2pinyin } from '../utils/maps/map_utils.js'
import { mapData } from '@/api/china/chinaApi'
const { proxy }: any = getCurrentInstance()
const myChart = shallowRef<any>(null)
const allData = ref<any>()
onMounted(() => {
  getData()
  echartsInit()
  window.addEventListener('resize', screenAdapter)
})
// 初始化echarts 并渲染地图
const echartsInit = async () => {
  myChart.value = proxy.$echarts.init(document.getElementById('map'))
  const chinaItem = await axios.get('map/china.json')
  proxy.$echarts.registerMap('china', chinaItem.data)
  const initOption = {
    title: {
      text: '▎商家分布',
      left: 20,
      top: 20,
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      left: '5%',
      bottom: '5%',
      orient: 'vertical',
      textStyle: {
        color: '#fff'
      }
    },
    geo: {
      type: 'map',
      map: 'china',
      top: '5%',
      bottom: '5%',
      roam: true, //支持拖拽缩放
      itemStyle: {
        areaColor: '#2E72BF',
        borderColor: '#333'
      },
      label: {
        normal: {
          //静态的时候展示样式
          show: true, //是否显示地图省份得名称
          textStyle: {
            color: '#fff',
            fontSize: 16,
            fontFamily: 'Arial'
          }
        },
        emphasis: {
          //动态展示的样式
          color: '#43d0d6'
        }
      }
    }
  }
  myChart.value.setOption(initOption)
  // 点击地图省份 切换个个省份的地图
  myChart.value.on('click', async (arg: any) => {
    const chinaItem = await axios.get(`map/province/${name2pinyin[arg.name]}.json`)
    proxy.$echarts.registerMap(name2pinyin[arg.name], chinaItem.data)
    myChart.value.setOption({
      legend: {
        data: []
      },
      geo: {
        map: name2pinyin[arg.name]
      }
    })
  })
}
const getData = async () => {
  const mapItem = await mapData()
  allData.value = mapItem.data
  updateChart()
  console.log(mapItem, '99999999999')
}
// 配置波点
const updateChart = () => {
  // legend数据
  const legendData = allData.value.map((item: any) => item.name)
  // 散点数据
  const seriesArr = allData.value.map((item: any) => {
    return {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      name: item.name,
      data: item.children,
      rippleEffect: {
        scale: 15,
        brushType: 'stroke',
        number: 5
      }
    }
  })
  const options = {
    legend: {
      data: legendData
    },
    series: seriesArr
  }
  myChart.value.setOption(options)
}
// 当窗口浏览器发生变化会触发的方法
const screenAdapter = () => {
  const titleFontSize = (document.getElementById('map')?.offsetWidth / 100) * 3.6
  const options = {
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    legend: {
      itemWidth: titleFontSize / 2,
      itemHeight: titleFontSize / 2,
      itemGap: titleFontSize / 2,
      textStyle: {
        fontSize: titleFontSize / 2
      }
    },
    geo: {
      label: {
        normal: {
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
    }
  }
  myChart.value.setOption(options)
  myChart.value.resize()
}
// 点击回到中国地图
const revertMap = () => {
  myChart.value.setOption({
    geo: {
      map: 'china'
    }
  })
  updateChart()
}
onBeforeUnmount(() => {
  window.removeEventListener('resize', screenAdapter)
})
defineExpose({
  screenAdapter
})
</script>
<style scoped lang="scss"></style>
