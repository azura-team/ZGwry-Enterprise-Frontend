<template>
  <div id="taskAssess">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearchIcon="isShowSearchIcon"
      :showBorder="isShowBorder"
    >
      {{ moduleName }}
    </header-bar>
    <div class="main-content">
      <div class="top-box">
        <p class="ass-area">网格：{{ gridName }}</p>
        <p class="ass-date">时间：{{ thisDate }}</p>
        <div class="ass-taskcount-box">
          <p class="ass-task-all">
            总任务：
            <span>{{ thisAll }}</span>
          </p>
          <p class="ass-task-success">
            <span>{{ thisSuccess }}</span>
            已完成
          </p>
          <p class="ass-task-error">
            <span>{{ thisError }}</span>
            未完成
          </p>
        </div>
        <div class="chartbox">
          <div ref="chartbox"></div>
          <p class="task-chart-title">任务完成率</p>
          <div class="task-x-box">
            <p>{{ thisRate }}%</p>
            <p><i
                class="triangle"
                :class="(thisRate - lastRate) >=0 ? 'up' : 'down'"
              ></i>{{ Math.abs(thisRate - lastRate) }}%</p>
            <p>同比上月</p>
          </div>
        </div>
      </div>
      <p class="gang"></p>
      <p class="item-box-top-title">下级网格</p>
      <div class="scroll-box">
        <div
          class="box-item"
          v-for="item in list"
          :key="item.grid.id"
          @click="checkItem(item.grid)"
        >
          <span class="item-title1">{{ item.grid.name }}</span>
          <span class="item-title2">完成率：{{ item.thisval }}%</span>
          <span class="item-title3">{{ gridMap[item.grid.level] }}级网格</span>
          <span class="item-title4">上月完成率：{{ item.lastval }}%</span>
          <p class="checkbox">&nbsp;</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import HighCharts from 'highcharts'
import SolidGauge from 'highcharts/modules/solid-gauge'
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(HighCharts)
SolidGauge(HighCharts)
export default {
  name: 'taskAssess',
  data () {
    return {
      moduleName: '任务考核',
      searchKey: '',
      isShowSearchIcon: false,
      isShowBorder: true,
      id: '',
      contentText: '',
      imgData: [],
      data: null,
      staffName: '',
      thisMonthTasks: [],
      lastMonthTasks: [],
      grids: [],
      gridMap: {
        0: '国',
        1: '县',
        2: '乡',
        3: '村'
      },
      gridName: '',
      thisDate: moment().format('YYYY-MM')
    }
  },
  computed: {
    thisAll () {
      return this.thisMonthTasks.length
    },
    thisSuccess () {
      return this.thisMonthTasks.filter(item => {
        return item.state === 6
      }).length
    },
    thisError () {
      return this.thisMonthTasks.filter(item => {
        return item.state === 0
      }).length
    },
    thisRate () {
      if (!this.thisAll) {
        return 0
      }
      return Number(((this.thisSuccess / this.thisAll) * 100).toFixed(1))
    },
    lastAll () {
      return this.lastMonthTasks.length
    },
    lastSuccess () {
      return this.lastMonthTasks.filter(item => {
        return item.state === 6
      }).length
    },
    lastError () {
      return this.lastMonthTasks.filter(item => {
        return item.state === 0
      }).length
    },
    lastRate () {
      if (!this.lastAll) {
        return 0
      }
      return Number(((this.lastSuccess / this.lastAll) * 100).toFixed(1))
    },
    list () {
      let temp = JSON.parse(JSON.stringify(this.grids))
      temp.forEach(item => {
        if (item.lastMonthTasks.length) {
          let all = item.lastMonthTasks.length
          let success = item.lastMonthTasks.filter(a => {
            return a.state === 6
          }).length
          item.lastval = ((success / all) * 100).toFixed(1)
        } else {
          item.lastval = 0
        }
        if (item.thisMonthTasks.length) {
          let all = item.thisMonthTasks.length
          let success = item.thisMonthTasks.filter(a => {
            return a.state === 6
          }).length
          item.thisval = ((success / all) * 100).toFixed(1)
        } else {
          item.thisval = 0
        }
      })
      return temp
    }
  },
  mounted () {
    this.id = this.$route.params.id
    if (this.id && this.id !== '0') {
      this.getData(this.id)
    } else {
      this.getUser()
    }
  },
  methods: {
    checkItem (data) {
      if (data.level >= 3) {
        this.$router.push('/taskAssessC/' + data.id)
      } else {
        this.$router.push('/taskAssess/' + data.id)
      }
    },
    getUser () {
      this.$api.getUser().then(res => {
        if (res) {
          this.getStaffInfo(res.id)
        }
      })
    },
    getStaffInfo (id) {
      this.$api.getStaffInfo({
        id
      }).then(res => {
        if (res) {
          this.gridName = res.gridName
          this.getData(res.grid)
        }
      })
    },
    getData (grid) {
      this.$api.getGridTaskAssessment({
        year: moment().format('YYYY'),
        month: moment().format('MM'),
        grid
      }).then(res => {
        if (res) {
          this.gridName = res.grid.name
          this.thisMonthTasks = res.thisMonthTasks
          this.lastMonthTasks = res.lastMonthTasks
          this.grids = res.grids
          let val = Number((this.thisSuccess / this.thisAll) * 100)
          this.setChartList(val)
        }
      })
    },
    setChartList (data) {
      HighCharts.chart(this.$refs.chartbox, {
        chart: {
          type: 'solidgauge'
        },
        credits: {
          enabled: false // 禁用版权信息
        },
        title: {
          text: ''
        },
        tooltip: {
          enabled: false
        },
        yAxis: {
          min: 0,
          max: 100,
          lineWidth: 0,
          tickPositions: []
        },
        plotOptions: {
          solidgauge: {
            borderWidth: '20px',
            dataLabels: {
              enabled: false
            },
            linecap: 'round',
            stickyTracking: false
          }
        },
        series: [{
          borderColor: '#F09426',
          data: [{
            radius: '100%',
            innerRadius: '100%',
            y: data
          }]
        }]
      })
    }
  }
}
</script>

<style lang="scss">
#taskAssess {
  .triangle {
    display: inline-block;
    height: 0.1rem;
    width: 0.14rem;
    -ms-flex-item-align: center;
    align-self: center;
    border-left: 0.1rem solid transparent;
    border-right: 0.1rem solid transparent;
    &.up {
      border-bottom: 0.2rem solid #39d92d;
    }
    &.down {
      border-top: 0.2rem solid #e92c2c;
    }
  }
  .highcharts-pane-group {
    display: none;
  }
  .main-content {
    top: 1.29rem;
    background: #fff;
    height: calc(100% - 1.29rem);
    p {
      padding: 0;
      margin: 0;
    }
    .scroll-box {
      height: calc(100% - 5.57rem);
      overflow-y: auto;
    }
    .task-chart-title {
      line-height: 0.73rem;
      text-align: center;
      font-size: 0.3rem;
    }
    .task-x-box {
      position: absolute;
      top: 0.75rem;
      text-align: center;
      width: 100%;
      p {
        &:nth-child(1) {
          font-size: 0.46rem;
          line-height: 0.6rem;
          color: #f09426;
        }
        &:nth-child(2) {
          font-size: 0.26rem;
          line-height: 0.37rem;
          color: #eb3838;
        }
        &:nth-child(3) {
          font-size: 0.24rem;
          line-height: 0.33rem;
        }
      }
    }
    .chartbox {
      position: absolute;
      width: 2.8rem;
      height: 2.8rem;
      top: 0.5rem;
      right: 0.6rem;
      div {
        height: 100%;
        width: 100%;
      }
    }
    .item-box-top-title {
      background: #f1f5f7;
      font-size: 0.34rem;
      font-weight: 700;
      padding-left: 0.32rem;
      line-height: 0.8rem;
    }
    .top-box {
      position: relative;
      height: 4.37rem;
      .ass-area {
        position: absolute;
        font-size: 0.3rem;
        line-height: 0.42rem;
        left: 0.5rem;
        top: 0.6rem;
      }
      .ass-date {
        position: absolute;
        font-size: 0.3rem;
        line-height: 0.42rem;
        left: 0.5rem;
        top: 1.22rem;
      }
      .ass-taskcount-box {
        position: absolute;
        left: 0.5rem;
        top: 1.87rem;
        height: 1.9rem;
        width: 2.8rem;
        background: #fff8ef;
        color: #666;
        text-align: center;
        .ass-task-all {
          margin-top: 0.1rem;
          line-height: 0.56rem;
          font-size: 0.3rem;
          span {
            color: #3296fa;
            font-size: 0.4rem;
          }
        }
        .ass-task-success {
          width: 50%;
          position: absolute;
          top: 0.82rem;
          left: 0;
          font-size: 0.26rem;
          span {
            color: #0ebf0c;
            display: block;
            line-height: 0.56rem;
            font-size: 0.4rem;
          }
        }
        .ass-task-error {
          width: 50%;
          position: absolute;
          top: 0.82rem;
          right: 0;
          font-size: 0.26rem;
          span {
            color: #e34921;
            display: block;
            line-height: 0.56rem;
            font-size: 0.4rem;
          }
        }
      }
    }
    .gang {
      background: #f8f8f8;
      height: 0.4rem;
    }
    .mint-tab-item-label {
      font-size: 0.3rem;
    }
    .box-item {
      position: relative;
      min-height: 1.44rem;
      font-size: 0.34rem;
      line-height: 1.44rem;
      border-bottom: 1px solid #e0e0e0;
      background: #fff;
      overflow: hidden;
      box-sizing: border-box;
      padding-right: 0.32rem;
      .item-title1 {
        color: #333;
        line-height: 0.48rem;
        position: absolute;
        left: 0.32rem;
        top: 0.26rem;
      }
      .item-title2 {
        color: #333;
        line-height: 0.48rem;
        position: absolute;
        right: 0.8rem;
        top: 0.26rem;
      }
      .item-title3 {
        color: #888;
        line-height: 0.37rem;
        position: absolute;
        left: 0.32rem;
        font-size: 0.26rem;
        bottom: 0.26rem;
      }
      .item-title4 {
        color: #888;
        line-height: 0.37rem;
        position: absolute;
        right: 0.8rem;
        font-size: 0.26rem;
        bottom: 0.26rem;
      }
      input {
        width: 5rem;
        float: right;
        height: 1.12rem;
        border: 0;
        text-align: right;
        font-size: 0.3rem;
        color: #9e9e9e;
      }
      .input-unit {
        float: right;
        font-size: 0.3rem;
        color: #9e9e9e;
        margin-left: 0.1rem;
      }
      textarea {
        border: 0;
        display: block;
        margin-bottom: 0.3rem;
        color: #9e9e9e;
        font-size: 0.3rem;
        line-height: 0.4rem;
        width: 100%;
      }
      .checkbox {
        float: right;
        padding-right: 0.52rem;
        text-align: right;
        font-size: 0.3rem;
        color: #9e9e9e;
        background: url("../../../assets/images/right.png") no-repeat right
          center;
        background-size: auto 0.32rem;
      }
      .checkbox2 {
        float: right;
        text-align: right;
        font-size: 0.3rem;
        color: #9e9e9e;
      }
      .addbox {
        float: right;
        font-size: 0.3rem;
        line-height: 0.74rem;
        padding: 0 0.36rem 0 0.84rem;
        color: #3296fa;
        border: 0.02rem solid #3296fa;
        position: relative;
        margin-top: 0.2rem;
        &::before {
          content: "+";
          border: 0.02rem solid #3296fa;
          border-radius: 50%;
          line-height: 0.3rem;
          width: 0.3rem;
          text-align: center;
          font-size: 0.26rem;
          position: absolute;
          left: 0.37rem;
          height: 0.3rem;
          top: 0;
          bottom: 0;
          margin: auto;
          color: #3296fa;
        }
      }
      .item-ul {
        margin-bottom: 0.4rem;
        li {
          background: #f8f8f8;
          font-size: 0.3rem;
          line-height: 1rem;
          padding-left: 0.2rem;
          margin-bottom: 0.16rem;
          position: relative;
          i.delete {
            &::before {
              content: "-";
              border: 0.02rem solid #3296fa;
              border-radius: 50%;
              line-height: 0.3rem;
              width: 0.3rem;
              text-align: center;
              font-size: 0.26rem;
              position: absolute;
              right: 0.4rem;
              height: 0.3rem;
              top: 0;
              bottom: 0;
              margin: auto;
              color: #3296fa;
            }
          }
          i.jump {
            background: #f8f8f8 url("../../../assets/images/right.png")
              no-repeat right center;
            background-size: auto 0.32rem;
            right: 0.4rem;
            position: absolute;
            display: block;
            height: 0.32rem;
            width: 0.32rem;
            top: 0;
            bottom: 0;
            margin: auto;
          }
        }
      }
      .item-ul2 {
        li {
          line-height: 0.4rem;
          padding-left: 0.2rem;
          margin-bottom: 0.16rem;
          padding-top: 0.1rem;
          span {
            width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
          }
          p {
            color: #bdbdbd;
            font-size: 0.26rem;
            line-height: 0.5rem;
          }
        }
      }
    }
  }
}
</style>
