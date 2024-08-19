<template>
  <div>
    <el-row>
      <el-col :span="18" :offset="3">
        <div class="message-box" style="margin-top: 10px">
          <el-button type="primary" style="float: left" @click="getPackage()"
            >开始检测</el-button
          >
          <el-button type="primary" style="float: left" @click="downloadFile()"
            >数据下载</el-button
          >
          <br />
          <br />
          <br />

          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane name="first">
              <div slot="label">
                异常流量
                <!-- <span :style="{ color: messages.length > 10 ? 'red' : '' }"
                  >({{ messages.length }})</span
                > -->
              </div>
              <MyClientLog
                which="ask"
                :getMessage="messages"
                @getConnectMessage="getConnectMessage"
                :loading1="loading"
                v-if="flag"
                ref="log"
              ></MyClientLog>
            </el-tab-pane>
            <!-- <el-tab-pane label="其他消息" name="second">
              <div slot="label">模型聚合日志</div>
              <MyClientLog
                which="other"
                :getMessage="messages"
                @getConnectMessage="getConnectMessage"
              ></MyClientLog>
            </el-tab-pane>
            <el-tab-pane label="其他消息" name="thrid">
              <div slot="label">服务端参数同步</div>
              <MyClientLog
                which="other"
                :getMessage="messages"
                @getConnectMessage="getConnectMessage"
              ></MyClientLog>
            </el-tab-pane>
            <el-tab-pane label="其他消息" name="forth">
              <div slot="label">客户端参数同步</div>
              <MyClientLog
                which="other"
                :getMessage="messages"
                @getConnectMessage="getConnectMessage"
              ></MyClientLog>
            </el-tab-pane> -->
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
    
<script>
import MyClientLog from "@/components/MyClientLog";
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  components: {
    MyClientLog,
  },
  data() {
    return {
      // 上面选择全部消息/未读消息/已读消息的数据
      activeName: "first",
      // 从服务端接收到的全部数据
      messages: [
        {
          ip: "192.168.43.59",
          clientName: "admin",
          time: "2024-3-21 11:29:53",
          status: "已加入",
        },
      ],
      token: null,
      flag: true,
      loading: false,
    };
  },
  activated() {},
  created() {
    this.getConnectMessage();
  },
  methods: {
    downloadFile() {
      axios({
        method: "get",
        url: "/localRequest/common/detect/file",
        headers: {
          token: this.token,
        },
        responseType: "blob",
      }).then((res) => {
        let downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
        let anchor = document.createElement("a");
        //设置下载的文件名
        anchor.download = "异常流量.csv";
        anchor.href = downloadUrl;
        anchor.click();
        // console.log(123);
      });
    },
    dataURLtoBlob(base64Str) {
      let bstr = atob(base64Str),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      // 下载的是csv格式的文件
      return new Blob([u8arr], { type: "text/tab-separated-values" });
    },
    getPackage() {
      this.loading = true;
      this.flag = false;
      this.flag = true;
      console.log(123132132);
      console.log(234);
      this.$refs.log.load();
      console.log(2344);
      axios({
        method: "get",
        url: "/localRequest/common/train",
        headers: {
          token: this.token,
        },
      })
        .then((res) => {
          this.$refs.log.getPageInfo(res.data.detect);
          this.loading = false;
          this.flag = false;
          this.flag = true;
          // console.log(123);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getConnectMessage() {
      this.token = VueCookies.get("token");
      // // console.log(this.token);
      axios({
        method: "get",
        url: "http://192.168.43.34:7000/connect/getConnectionMessage",
        headers: { token: this.token },
      })
        .then((res) => {
          // // console.log(res);
          this.messages = res.data.message;
        })
        .catch((action) => {
          return;
        });
    },
    getUserId() {
      // 从cookie中获取id
      this.token = VueCookies.get("token");
      if (this.token) {
        axios({
          method: "get",
          url: `/serverRequest/user/getUserId`,
          headers: {
            token: this.token,
          },
          timeout: 30000,
        }).then((res) => {
          this.userId = res.data.userId;
          // // console.log(this.userId);
        });
      }
    },
    // 上面选择全部消息/未读消息/已读消息的方法
    handleClick(tab, event) {
      // // // console.log(tab, event);
    },
    // 获取页面的表格所有数据
    // 还未修改的代码
    // getTicket() {
    //   let that = this;
    //   that.$axios
    //     .get(that.baseURL + "PROD/ticket/documents/")
    //     .then(function (res) {
    //       if (res.data.code === 1) {
    //         that.ticket = res.data.data;
    //         //获取返回记录的总行数
    //         that.total = res.data.data.length;
    //         //获取当前页的数据
    //         that.getPageInfo(); //在这里调用获取当前页的数据信息方法
    //         that.$message({
    //           message: "数据加载成功!",
    //           type: "success",
    //         });
    //       } else {
    //         // 失败的提示
    //         that.$message.error(res.data.msg);
    //       }
    //     })
    //     .catch(function (err) {
    //       // // console.log(err);
    //     });
    // },
  },
};
</script>

<style lang='less' scoped>
.el-autocomplete {
  padding: 0;
  height: 30px;
}

.message-box {
  margin-top: 0px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>