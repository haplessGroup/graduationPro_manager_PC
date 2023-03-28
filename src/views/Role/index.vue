<template>
  <view class="container">
    <CustomHeader title="豆瓣电影Top250"></CustomHeader>
    <!-- 豆瓣电影信息 -->
    <view class="tit">豆瓣电影Top250排行</view>
    <view class="mtable">
      <uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据" style="height: 500px;">
        <uni-tr>
          <uni-th width="150" align="center">ID</uni-th>
          <uni-th width="150" align="center">中国名</uni-th>
          <uni-th width="150" align="center">外国名</uni-th>
          <uni-th width="150" align="center">电影评分</uni-th>
          <uni-th width="150" align="center">评分人数</uni-th>
          <uni-th width="150" align="center">评价</uni-th>
          <uni-th width="150" align="center">电影信息</uni-th>
        </uni-tr>
        <uni-tr v-for="(item, index) in movieData" :key="item.img">
          <uni-td align="center">{{ item.id }}</uni-td>
          <uni-td align="center">{{ item.cname }}</uni-td>
          <uni-td align="center">{{ item.oname }}</uni-td>
          <uni-td align="center">{{ item.rate }}</uni-td>
          <uni-td align="center">{{ item.judge }}</uni-td>
          <uni-td align="center">{{ item.inq }}</uni-td>
          <uni-td align="center">{{ item.about }}</uni-td>
        </uni-tr>
      </uni-table>
    </view>
    <!-- 豆瓣电影评分 -->
    <view class="tit">豆瓣电影Top250评分</view>
    <view style="width: 100%;display: flex;justify-content: center;">
      <uni-card style="width: 100%;">
        <!-- 为 图标 准备一个定义了宽高的 DOM -->
        <view id="main">
          <view class="charts-box">
            <qiun-data-charts type="column" :opts="opts" :chartData="chartData" background="none" />
          </view>
        </view>
      </uni-card>
    </view>
    <view>
      <uni-section title="数据专业分析" type="circle">
        <uni-collapse accordion v-model="accordionVal">
          <uni-collapse-item title="1、目前大众的购票渠道有哪些?">
            <view class="contents">
              <text class="text">
                1、<strong>实体店购买</strong>:这种方式对于目前的群众来说只是和朋友出去游玩的时候适用，但占比也相对较少;
                <br>2、<strong>线上购买</strong>:目前线上购买的手段层出不穷,例如有猫眼电影等,现在的年轻群众对此十分喜欢;
                <br>3、<strong>黄牛购买</strong>:在电影行业等领域逐渐发展起来之后.出现的一种职业叫做票贩子,也就是黄牛,利用购票时的差价赚取利润,但目前也只是占据小部分市场;
                <br>4、<strong>线上转卖</strong>:这种方式的出现是因为人们买票之后因故不能去影院看电影,只能便宜出售电影票。就目前来看主要发生在大学生之间，其余人群也有;
              </text>
            </view>
          </uni-collapse-item>
          <uni-collapse-item title="2、目前大众看电影的方式有哪些?">
            <view class="contents">
              <text class="text">
                1、<strong>线下影院</strong>:目前线下影院观看电影依旧是较为的主流;
                <br>2、<strong>私人影院</strong>:其实依旧是线下影院的一种,只是相对来说更加的私密;
                <br>3、<strong>线上APP</strong>:目前人群中有部分人希望能够白嫖电影,所以就会等到影院电影在视频APP(例如爱奇艺，腾讯视频等)上能够观看后才会选择看电影;,
              </text>
            </view>
          </uni-collapse-item>
          <uni-collapse-item title="3、目前大众喜欢观看的电影类别有哪些?">
            <view class="contents">
              <text class="text">
                1、<strong>青春</strong>:在前几年,以青春为主的电影可以说占据了影视市场的大半壁江山。从《那些年我们追过的女孩》、《致青春》等电影开始似乎正慢慢拉开了青春电影的大门;
                <br>2、<strong>家国</strong>:近几年的家国情怀逐渐变成电影的主流,宣传和平、正能量，让大家对这种类型的电影有了的期待。吴京的《战狼2》宣言了爱国，爱和平，看着振奋人心;
                <br>3、<strong>喜剧</strong>:喜剧无疑也是最受观众喜爱的类型之一。例如宁浩的疯狂三部曲都获得了不错的票房成绩,以话剧扬名的开心麻花,在进入影视市场后一路上升。2015年一部《夏洛特烦恼》彻底让开心麻花进入到了大众的视线;
                <br>4、<strong>科幻</strong>:现在我国电影市场越来越开放,科幻等电影也获得了不错的成绩。2019年的《流浪地球》在一路逆袭中票房达到了46.88亿元,更是弥补了我国科幻电影的空白;
                <br>&nbsp;&nbsp;&nbsp;&nbsp;当然，还有悬疑、犯罪等也是当代人喜欢看的电影,在这就不多说啦~',
              </text>
            </view>
          </uni-collapse-item>
          <uni-collapse-item title="4、为什么会出现这样的结果呢?">
            <view class="contents">
              <text class="text">
                1、<strong>目前社会趋势</strong>:随着社会的逐渐发展,科技在不断的进步,很多方便人们生活的软件、小程序等随之也被开发出来,人们的生活习惯也随之改变;
                <br>2、<strong>生活年轻化</strong>:目前喜欢看电影的人群中,年轻人占了大部分。换句话说,现在的年轻人更懂得如何享受生活,相对年长的
                人群,他们的重心更偏向于家庭以及生活的负担;
                <br>3、<strong>年轻人更“懒”</strong>:其实说“懒”或许不太准确,更应该说年轻人更加懂得如何利用身边的资源,以达到减少时间的浪费;
                <br>4、<strong>压力“山”大</strong>:现在的社会是快节奏的,各方面的压力也随之加大,速度更快的冲向人们的肩膀。所以如何减轻其他方面的压力就成了首要问题,这时候“网上购票”等手段就帮大部分人减轻了线下买票排队等压力;
                <br>&nbsp;&nbsp;&nbsp;&nbsp;(如有不准确的地方，还望各位多多担待~)
              </text>
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </uni-section>
    </view>
    <!-- 用户评论 -->
    <view class="judge">
      <view class="textarea">
        <view class="minp">
          <uni-easyinput placeholder="请发表您的评论...(不超过255个汉字)" maxlength="255" type="textarea" autoHeight
            v-model="textvalue" clearable @input="sumWords"></uni-easyinput>
        </view>
        <view class="mbut">
          <button type="primary" @click="sureToSend()">确认发表</button>
        </view>
      </view>
      <!-- 分割线 -->
      <view class="mdiv">
        <view class="divider"></view>
      </view>
      <!-- 展示用户评论 -->
      <view class="content">
        <view style="text-align: center;" v-if="userMessage.length == 0">
          暂无评论，快来抢占沙发啦~
        </view>
        <!-- 如果获取的评论不为空 -->
        <view v-if="userMessage.length != 0" style="width: 100%;">
          <view v-for="(item, index) in userMessage" :key="index">
            <!-- 用户留言内容 -->
            <view class="usermessage">
              {{ item.dbcontent }}<span style="font-size: 15px;color: gray;">({{ item.dbtime }})</span>
            </view>
            <!-- 用户信息 -->
            <view class="userinfo">
              <!-- 楼数 -->
              <span class="uspan">第{{ index + 1 }}楼</span>
              <!-- 用户账号 -->
              <span class="uspan">{{ item.dbaccount }}</span>
              <!-- 用户昵称 -->
              <span class="uspan">{{ item.dbnickname }}</span>
              <!-- 删除操作 -->
              <span v-if="item.dbaccount === userInfo.account">
                操作:<span class="oper" @click="deleteMessage(item.id)">
                  删除
                </span>
              </span>
            </view>
            <!-- 分割线 -->
            <view style="width: 100%;margin: 0 auto;">
              <view class="divider"></view>
            </view>
          </view>
        </view>

      </view>
    </view>

  </view>
</template>

<script>
import {
  mapState
} from 'vuex'
import {
  getRate,
  getMovie,
  getMovieMess,
  delMovieMess,
  sendMovieMess
} from "../../../requests/data.js"
import CustomHeader from "../../../components/CustomHeader.vue"
export default {
  onLoad() {
    this.showMovieData()
    this.showRateData()
    this.showMovieMessage()
    // 获取屏幕信息
    uni.getSystemInfo({
      success: (res) => {
        console.log(res.windowWidth)
        this.windowWidth = res.windowWidth
      }
    })
  },
  data() {
    return {
      // 电影数据
      movieData: [],
      loading: false,
      // 柱状图数据
      chartData: {
        "categories": [],
        "series": [{
          "name": "数量",
          "data": []
        }]
      },
      // 可视化图表的配置
      opts: {
        extra: {
          column: {
            type: "group",
            width: 15,
            activeBgColor: "#000000",
            activeBgOpacity: 0.08
          }
        }
      },
      textvalue: '',
      userMessage: [],
      windowWidth: 0,
      accordionVal: "0"
    }
  },
  components: {
    CustomHeader
  },
  computed: {
    ...mapState(["userInfo"])
  },
  onPullDownRefresh() {
    console.log('refresh');
    setTimeout(() => {
      this.refresh()
    }, 1000)
  },
  methods: {
    // ...mapActions(["getUserInfo"]),
    goBack() {
      uni.navigateBack({
        delta: 1,
        animationType: 'pop-out',
        animationDuration: 200
      })
    },
    showRateData() {
      getRate().then(res => {
        var categories = []
        var serires = []
        for (var i = 0; i < res.data.data.length; i++) {
          categories.push(res.data.data[i].rate)
          serires.push(res.data.data[i].rate__count)
        }
        this.chartData.categories = categories
        this.chartData.series[0]["data"] = serires
      })
    },
    showMovieData() {
      this.loading = true
      getMovie().then(res => {
        console.log(res);
        this.movieData = res.data.data
        this.loading = false
      })
    },
    // 当用户输入的字数大于等于255时，提示不能再输入
    sumWords() {
      if (this.textvalue.length >= 255) {
        uni.showToast({
          title: "您不能再输入啦~",
          icon: "error",
        })
      }
    },
    // 请求用户评论
    showMovieMessage() {
      getMovieMess().then(res => {
        if (res.data.data.length == 0) {
          console.log("暂无评论")
        } else if (res.data.msg == "DataBase is Wrong!" && res.data.code == 400) {
          uni.showToast({
            title: "系统内部出现错误，请稍后再试!",
            icon: "none"
          })
        } else {
          this.userMessage = res.data.data
          // 处理时间格式
          this.userMessage = this.userMessage.map(item => {
            item.dbtime = item.dbtime.replace("T", " ").split(".")[0]
            return item
          })
        }
      }).catch(err => {
        uni.showToast({
          title: "数据请求失败。",
          icon: "error"
        })
      })
    },
    deleteMessage(id) {
      uni.showLoading({
        title: "删除中..."
      })
      delMovieMess({
        "id": id,
        "account": this.userInfo.account
      }).then(res => {
        if (res.data.msg == 'OK') {
          uni.showToast({
            title: '删除成功！',
            icon: 'none',
          })
          this.userMessage = this.userMessage.filter(item => {
            return item.id != id
          })
        } else {
          uni.showToast({
            title: '系统内部出现错误，请稍后再试!',
            icon: 'error',
          })
        }
      })
    },
    sureToSend() {
      var user = this.userInfo
      if (this.textvalue === "") {
        uni.showToast({
          title: '多少写点东西。',
          icon: 'error',
        })
      } else {
        uni.showLoading({
          title: "发表中..."
        })
        sendMovieMess({
          "dbaccount": user.account,
          "dbnickname": user.nickname,
          "dbidentity": user.identity,
          "dbcontent": this.textvalue,
        }).then(res => {
          uni.hideLoading()
          if (res.data.msg == "OK") {
            uni.showToast({
              title: '发表成功！',
              icon: 'success',
            })
            setTimeout(() => {
              this.textvalue = ""
              uni.redirectTo({
                url: "dbmovie"
              })
            }, 1000)
          } else {
            uni.showToast({
              title: '系统内部出现错误，请稍后再试!',
              icon: 'error',
            })
          }
        })
      }
    },
    // 下拉刷新
    refresh() {
      uni.showLoading({
        title: "刷新中..."
      })
      uni.redirectTo({
        url: "dbmovie",
        success: () => {
          uni.hideLoading()
          uni.stopPullDownRefresh();
        }
      })
    }
  }
}
</script>

<style scoped>
.charts-box {
  width: 100%;
  height: 300px;
}

.data {
  width: 100%;
}

.container {
  background-color: white;
  height: 100%;
}

.tit {
  font-weight: bold;
  font-size: 30rpx;
  text-align: center;
  margin-top: 30px;
}

.judge {
  width: 100%;
  background-color: #DCDCDC;
  height: 500px;
  overflow: auto;
}

.textarea {
  width: 80%;
  margin: 0px auto;
  overflow: hidden;
  /*解决外边距塌陷*/
}

.divider {
  border-top: 0.5px solid #000;
  margin-top: 10px;
  width: 100%;
}

.content {
  padding: 10px;
  width: 80%;
  height: 30px;
  text-indent: 2em;
  margin: 0 auto;
  width: 80%;
}

.oper {
  font-size: 10px;
  cursor: pointer;
  color: #005CC5;
}

.mtable {
  margin-top: 10px;
  height: 500px;
  overflow-y: auto;
}

.minp {
  width: 100%;
  background-color: white;
  margin-top: 30px;
}

.mbut {
  width: 100px;
  margin-top: 10px;
  float: right;
}

.mdiv {
  width: 80%;
  margin: 0 auto;
}

.usermessage {
  font-size: 15px;
  font-weight: bold;
  font-family: "仿宋";
}

.userinfo {
  margin-top: 20px;
  font-size: 10px;
  display: flex;
  flex-direction: row;
}

.uspan {
  flex: 1;
}

.contents {
  padding: 15px;
}

.text {
  font-size: 14px;
  color: #666;
  line-height: 20px;
}
</style>
