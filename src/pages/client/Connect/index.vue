<template>
  <div>
    <p class="title">中央服务器连接</p>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="8" :offset="8">
        <div style="margin: 0px"></div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-position="left"
          label-width="120px"
          class="ruleForm"
          :disabled="formDisabled"
        >
          <el-form-item label="中央服务器IP" prop="ip">
            <el-input v-model="ruleForm.ip"></el-input>
          </el-form-item>
          <el-form-item label="客户端名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="部门" prop="department">
            <el-select
              v-model="ruleForm.department"
              placeholder="请选择部门"
              style="width: 100%"
            >
              <el-option label="车间1" value="车间1"></el-option>
              <el-option label="车间2" value="车间2"></el-option>
              <el-option label="车间3" value="车间3"></el-option>
              <el-option label="车间4" value="车间4"></el-option>
              <el-option label="车间5" value="车间5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >请求连接</el-button
            >
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-if="show" :span="8" :offset="8" v-show="agreeShow">
        <el-result
          v-loading="agreeLoading"
          element-loading-text="正在等待服务器接受连接"
          element-loading-background="#ffffff"
          :icon="agreeShow ? '' : 'error'"
          :title="agreeShow ? '' : '服务器拒绝连接'"
        >
        </el-result>
      </el-col>

      <el-col v-else :span="15" :offset="5" v-show="messageShow">
        <el-table
          v-loading="loading"
          element-loading-text="正在等待中央服务器的同步消息"
          element-loading-background="#ffffff"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column prop="algori" label="差分隐私" width="180">
          </el-table-column>
          <el-table-column prop="compress" label="同态加密" width="180">
          </el-table-column>
          <el-table-column prop="chafen" label="压缩方法" width="180">
          </el-table-column>
          <el-table-column prop="jiami" label="联邦方法" width="180">
          </el-table-column>
          <el-table-column prop="epochs" label="聚合轮次" width="180">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";
import SecurityCom from "@/store/securityCom.json";

export default {
  components: {},
  data() {
    return {
      userId: this.$store.state.userId,
      ip: this.$store.state.ip,

      show: this.$store.state.show, //显示哪个弹出框
      agreeShow: this.$store.state.agreeShow, //服务器是否同意
      agreeLoading: this.$store.state.agreeLoading,
      ruleForm: this.$store.state.ruleForm,

      messageShow: this.$store.state.messageShow,
      loading: false,
      formDisabled: this.$store.state.formDisabled,

      tableData: [
        {
          algori: this.$store.state.tableData[0].algori,
          compress: this.$store.state.tableData[0].compress,
          chafen: this.$store.state.tableData[0].chafen,
          epochs: this.$store.state.tableData[0].epochs,
          jiami: this.$store.state.tableData[0].jiami,
        },
      ],

      //校验表单规则
      rules: {
        // ip: [
        //   {
        //     required: true,
        //     message: "请填写中央服务器IP地址",
        //     trigger: "blur",
        //   },
        //   // 这里可以自定义规则，有空可以添加
        // ],
        // name: [
        //   { required: true, message: "请输入用户名", trigger: "blur" },
        //   {
        //     min: 3,
        //     max: 10,
        //     message: "长度在 3 到 10 个字符",
        //     trigger: "blur",
        //   },
        // ],
        // department: [
        //   { required: true, message: "请选择部门", trigger: "change" },
        // ],
      },
      //
      token: null,
      socket: null,
    };
  },
  created() {
    this.loading = this.$store.state.loading;
    // this.$store.dispatch("")
  },
  mounted() {
    this.init();
  },
  methods: {
    onOpen(event) {
      // 向服务端发送请求连接信息http://192.168.43.34:7000/connect/getConnection
      // // console.log("onopen----------------");
      // // console.log(this.ip);
      // // console.log(this.userId);
      // // console.log(this.ruleForm.name);
      // // console.log(this.ruleForm.department);
      // // console.log("-----------------------");
      let connectParma = {
        ip: this.ip,
        userId: this.userId,
        clientName: this.ruleForm.name,
        department: this.ruleForm.department,
      };
      this.$localRequest
        .post("user/getConnection", connectParma)
        .then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "请求连接信息发送成功",
              type: "success",
              offset: 100,
            });
            this.agreeShow = true; // 开始转圈等待同意连接
            this.$store.commit("setAgreeShow", true);
          }
        });
    },
    onMessage(event) {
      console.log(event);
      console.log(event.data.split(":")[0] == "connect");
      // 如果是请求处理信息，收到已经同意的信息，转圈等待停止，显示连接成功；如果是拒绝的信息，就关闭websocket
      // // console.log("onMessage--------" + event.data);
      if (
        event.data.split(":")[0] == "connect" &&
        event.data.split(":")[1] == "fail"
      ) {
        this.$message.error(event.data);
        this.agreeShow = false;
        this.messageShow = false;
        this.formDisabled = false;
        this.$message.error("服务端拒绝连接");
      } else if (
        event.data.split(":")[0] == "connect" &&
        event.data.split(":")[1] == "success"
      ) {
        this.$notify({
          title: "来自中央服务器的连接消息",
          message: "连接成功",
          duration: 0,
          offset: 100,
        });

        this.show = false;
        this.$store.commit("setShow", this.show);
        this.messageShow = true;
        this.$store.commit("setMessageShow", this.messageShow);
        // 可以禁用表单，可以优化成刷新仍然禁用
        this.formDisabled = true;
        this.$store.commit("setFormDisabled", this.formDisabled);
      }

      // 如果是方法同步信息，则赋值给tableData
      else if (event.data.split(":")[0] == "connect") {
        console.log(12313);
        // 2,服务端同步信息已发送,1,5,10,10
        this.loading = false; // 停止转圈获取到了服务器同步方法信息
        this.$store.commit("setLoading", false);
        this.$notify({
          title: "来自中央服务器的同步方法消息",
          message: "获取同步方法",
          duration: 0,
          offset: 100,
        });
        let trans_data = event.data.split(":")[1];
        // // console.log("trans_data----" + trans_data);
        let trans_dataArray = trans_data.split(",");
        console.log(trans_data);
        console.log(trans_dataArray);
        // // console.log("trans_dataArray----", trans_dataArray);
        //方法同步信息：2;CNNB,xx算法,xxx方法,xxxx方法,1000轮：2代表是方法同步信息，后续五个参数分别是：差分隐私，同态加密，压缩方法，联邦方法，聚合轮次（请按顺序）
        //transdataarray[0]差分隐私，transdataarray[1]同态加密，transdataarray[2]压缩方法，transdataarray[3]联邦方法，transdataarray[4]聚合轮次
        let tableData = [
          {
            algori: null,
            compress: null,
            chafen: null,
            jiami: null,
            epochs: null,
          },
        ];
        // console.log(tableData[0])
        try {
          if (trans_dataArray.length == 4) {
            tableData[0].algori = this.fun1(trans_dataArray[0]);
            tableData[0].compress = this.fun1(trans_dataArray[1]);
            tableData[0].chafen = "";
            tableData[0].jiami = this.fun1(trans_dataArray[2]);
            tableData[0].epochs = trans_dataArray[3];
          } else {
            tableData[0].algori = this.fun1(trans_dataArray[0]);
            tableData[0].compress = this.fun1(trans_dataArray[1]);
            tableData[0].chafen = this.fun1(trans_dataArray[2]);
            tableData[0].jiami = this.fun1(trans_dataArray[3]);
            tableData[0].epochs = trans_dataArray[4];
          }
        } catch (e) {
          tableData[0].algori = "高斯噪声";
          tableData[0].compress = "CKKS";
          tableData[0].chafen = "Huffman";
          tableData[0].jiami = "平均联邦";
          tableData[0].epochs = 10;
        }
        console.log(tableData[0]);
        console.log(this.loading);

        // // console.log("tableDate----" + tableData[0]);

        this.$store.commit("setTableData", tableData[0]);
        // // console.log(this.$store.state.tableData[0]);
        this.tableData = tableData;
        // // console.log("-------------");
      }
      // 序号为3，表示是同步的模型数据
      if (event.data.split(",")[0] == "3") {
        //模型同步数据：3;[88,51,89,98,99],10,13.1,分别为准确率，loss，通信时间
        let trans_data = JSON.parse(event.data.split(";")[1]);
        // // console.log("trans_data----", trans_data);
        // // // console.log(trans_data[0]);
        this.$store.commit("setAccuracyData", trans_data[0]);
        // // // console.log(this.$store.state.accuracyData);
        this.$store.commit("setLossData", trans_data[1]);
        this.$store.commit("setTimeData", trans_data[2]);
      }
      // this.message = event.data;
      // // // console.log('Received message: ' + this.message);
    },
    fun1(code) {
      for (let key in SecurityCom) {
        if (SecurityCom[key].id == code) {
          return SecurityCom[key].name;
        }
      }
    },
    onClose(event) {
      this.agreeShow = false;
      this.messageShow = false;
      this.formDisabled = false;
      this.show = false;
      this.$store.commit("setShow", this.show);
      this.messageShow = true;
      this.$store.commit("setMessageShow", this.messageShow);
      // 可以禁用表单，可以优化成刷新仍然禁用
      this.formDisabled = true;
      this.$store.commit("setFormDisabled", this.formDisabled);
      // 还未测试
      // // console.log("close....");
      // this.$message.error("服务端断开了连接");
    },
    onError(event) {
      // 还未测试
      console.error("WebSocket error: " + event);
    },
    init() {
      if (!this.userId) {
        this.getUserId();
      }
      if (!this.ip) {
        this.getUserIP((ip) => {
          this.ip = ip;
        });
        this.ip = "10.128.4.13";
      }
    },
    getUserId() {
      // 从cookie中获取id
      // 向服务器请求userid
      this.token = VueCookies.get("token");
      console.log(this.token);
      if (this.token) {
        axios({
          method: "get",
          url: `/serverRequest/user/getUserId`,
          headers: {
            token: this.token,
          },
          timeout: 30000,
        })
          .then((res) => {
            this.userId = res.data.userId;
          })
          .catch((action) => {
            return;
          });
      }
      console.log(this.token);
      // this.userId = "123";
    },
    getUserIP(onNewIP) {
      let MyPeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
      let pc = new MyPeerConnection({
        iceServers: [],
      });
      let noop = () => {};
      let localIPs = {};
      let ipRegex =
        /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
      let isFirstIPFound = false; // 添加一个标志来判断是否已经找到第一个IP
      let iterateIP = (ip) => {
        if (!isFirstIPFound) {
          // 只在第一个IP找到时调用回调函数
          onNewIP(ip);

          isFirstIPFound = true;
        }
        localIPs[ip] = true;
      };
      // let iterateIP = (ip) => {
      //   if (!localIPs[ip]) onNewIP(ip);
      //   localIPs[ip] = true;
      // };
      pc.createDataChannel("");
      pc.createOffer()
        .then((sdp) => {
          sdp.sdp.split("\n").forEach(function (line) {
            if (line.indexOf("candidate") < 0) return;
            line.match(ipRegex).forEach(iterateIP);
          });
          pc.setLocalDescription(sdp, noop, noop);
        })
        .catch((reason) => {
          return;
        });
      pc.onicecandidate = (ice) => {
        if (
          !ice ||
          !ice.candidate ||
          !ice.candidate.candidate ||
          !ice.candidate.candidate.match(ipRegex)
        )
          return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
    },
    submitForm(formName) {
      this.token = VueCookies.get("token");
      console.log(this.token);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let url = "http://" + this.ruleForm.ip + "/server/" + this.userId;
          // 本处实际上是和本地的后端建立连接
          // let url ='http://localhost:8000/'+"webSocket"; //与本地后端建立连接，并且通知本地后端和服务器建立连接
          // 本地测试
          let url = "ws://172.20.10.9:8000/webSocket";
          // 实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
          let socketUrl = url.replace("https", "ws").replace("http", "ws");
          this.$store.dispatch(
            "createWebSocket",
            socketUrl +
              "/" +
              this.token +
              "/" +
              this.ruleForm.ip +
              "/" +
              this.ruleForm.name +
              "/" +
              this.ruleForm.department +
              "/" +
              this.userId
          );
          // // console.log(socketUrl);
          this.socket = this.$store.getters.websocket;
          this.$store.commit("setWebSocketEvent", {
            event: "onopen",
            handler: (event) => {
              // this.$message.success("连接成功");
              // this.onOpen(event);
              this.agreeShow = true; // 开始转圈等待同意连接
              this.$store.commit("setAgreeShow", true);
            },
          });
          this.$store.commit("setWebSocketEvent", {
            event: "onmessage",
            handler: (event) => {
              this.onMessage(event);
            },
          });
          this.$store.commit("setWebSocketEvent", {
            event: "onerror",
            handler: (event) => {
              this.onError(event);
            },
          });
          this.$store.commit("setWebSocketEvent", {
            event: "onclose",
            handler: (event) => {
              this.onClose(event);
            },
          });
          this.$store.commit("setRuleForm", formName);
        } else {
          // // console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    agreeMessage() {
      this.$notify({
        title: "提示",
        message: "方法已启用",
        duration: 0,
        offset: 100,
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("setUserId", this.userId);
    this.$store.commit("setShow", this.show);
    this.$store.commit("setIp", this.ip);
    this.$store.commit("setRuleForm", this.ruleForm);
    this.$store.commit("setMessageShow", this.messageShow);
    this.$store.commit("setAgreeShow", this.agreeShow);
    this.$store.commit("setTableData", this.tableData[0]);
    this.$store.commit("setFormDisabled", this.formDisabled);
    this.$store.commit("setAgreeLoading", this.agreeLoading);
    this.$store.commit("setLoading", this.loading);

    // // console.log("set----->" + this.userId);
    // // console.log("set----->" + this.show);
    // // console.log("set----->" + this.ip);
    // // console.log("set----->" + this.ruleForm);
    // // console.log("set----->" + this.messageShow);
    // // console.log("set----->" + this.agreeShow);
    // // console.log("set----->" + this.tableData[0]);
    // // console.log("set----->" + this.formDisabled);
    // // console.log("set----->" + this.agreeLoading);
    // // console.log("set----->" + this.loading);
    next();
  },
  beforeDestroy() {
    // 在组件销毁前清除定时器，以防止内存泄漏
    clearInterval(this.timer);
  },
};
</script>

<style lang='less' scoped>
.title {
  margin-top: 20px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 2em;
  text-align: center;
}

// Loading
body {
  margin: 0;
}

// Layout
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>