<template>
  <div class="Screen">
    <div class="top">
      <img src="https://bookbook.cc/vue2/data-view/img/header_border_dark.60ff0f66.png" alt="" />
      <div class="logo">
        <a href="https://www.baidu.com">bookbook.cc</a>
        <span class="title">王腾是大傻逼纯度100%</span>
        <div>
          <span @click="togColor(true)">😶‍🌫️</span>
          <span>2023/6/5 14/:36:59</span>
        </div>
      </div>
    </div>
    <div class="bodys" :style="SixteenColor.color">
      <div class="left">
        <div class="trend" :id="toggleObj.trend ? 'toggle' : ''">
          <trend ref="trends"></trend>
          <div id="icons"><span class="iconfont" @click="toggles('trend')">&#xe826;</span></div>
        </div>
        <div class="seller" :id="toggleObj.seller ? 'toggle' : ''">
          <seller ref="sellers"></seller>
          <div id="icons"><span class="iconfont" @click="toggles('seller')">&#xe826;</span></div>
        </div>
      </div>
      <div class="center">
        <div class="chinamap" :id="toggleObj.china ? 'toggle' : ''">
          <china ref="chinas"></china>
          <div id="icons"><span class="iconfont" @click="toggles('china')">&#xe826;</span></div>
        </div>
        <div class="rank" :id="toggleObj.Rank ? 'toggle' : ''">
          <Rank ref="Ranks"></Rank>
          <div id="icons"><span class="iconfont" @click="toggles('Rank')">&#xe826;</span></div>
        </div>
      </div>
      <div class="right">
        <div class="hotproduct" :id="toggleObj.hotproduct ? 'toggle' : ''">
          <hotproduct ref="hotproducts"></hotproduct>
          <div id="icons">
            <span class="iconfont" @click="toggles('hotproduct')">&#xe826;</span>
          </div>
        </div>
        <div class="stork" :id="toggleObj.stock ? 'toggle' : ''">
          <stock ref="stocks"></stock>
          <div id="icons"><span class="iconfont" @click="toggles('stock')">&#xe826;</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, getCurrentInstance } from 'vue'
import trend from '@/components/trend.vue'
import seller from '@/components/seller.vue'
import china from '@/components/china.vue'
import Rank from '@/components/Rank.vue'
import hotproduct from '@/components/hotproduct.vue'
import stock from '@/components/stock.vue'
const { proxy }: any = getCurrentInstance()
const SixteenColor = reactive<any>({
  color: ''
})
// 切换状态
const toggleObj = reactive<any>({
  trend: false,
  seller: false,
  china: false,
  Rank: false,
  hotproduct: false,
  stock: false
})
// 放大缩小
const toggles = (val: string) => {
  toggleObj[val] = !toggleObj[val]
  nextTick(() => {
    proxy.$refs[val + 's'].screenAdapter()
  })
}
const togColor = (flag: boolean) => {
  let r = Math.floor(Math.random() * 256)
  let g = Math.floor(Math.random() * 256)
  let b = Math.floor(Math.random() * 256)
  let hexadecimal =
    'background-color:' + '#' + r.toString(16) + g.toString(16) + b.toString(16) + ';'
  let rgbFormat = 'rgb(' + r + ',' + g + ',' + b + ')'
  if (flag == true) {
    SixteenColor.color = hexadecimal
  } else if (flag == false) {
    return rgbFormat
  }
}
</script>
<style scoped lang="scss">
.Screen {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  #icons {
    position: absolute;
    right: 20px;
    top: -10px;
    color: #fff;
    font-size: 50px;
    cursor: pointer;
  }
  .top {
    img {
      width: 100%;
    }
    position: relative;
    .logo {
      width: 100%;
      position: absolute;
      top: 50%;
      color: #fff;
      transform: translateY(-80%);
      display: flex;
      justify-content: space-between;
      .title {
        flex: 1;
        text-align: center;
        font-size: 20px;
      }
      a {
        text-decoration: none;
        color: #fff;
        font-size: 20px;
      }
    }
  }
  .bodys {
    width: 100%;
    height: 100%;
    display: flex;
    margin-top: 20px;
    #toggle {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      z-index: 100;
    }
    .left {
      width: 27.6%;
      height: 100%;
      position: relative;
      .trend {
        height: 53%;
      }
      .seller {
        height: 31%;
        margin-top: 25px;
      }
    }
    .center {
      height: 100%;
      width: 41.5%;
      margin-left: 1.6%;
      margin-right: 1.6%;
      .chinamap {
        height: 56%;
      }
      .rank {
        height: 28%;
        margin-top: 25px;
      }
    }
    .right {
      width: 27.6%;
      height: 100%;
      .hotproduct {
        height: 46%;
      }
      .stork {
        height: 38%;
        margin-top: 25px;
      }
    }
  }
}
</style>
