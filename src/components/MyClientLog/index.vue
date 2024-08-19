<template>
  <div class="main">
    <el-table
      v-loading="loading1"
      ref="multipleTable"
      border
      :header-cell-style="{
        background: '#f5f7fa',
        color: '#909399',
        padding: '8px 0px',
      }"
      :cell-style="{ padding: '8px 0px' }"
      :data="currentMessage"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        prop="srcIp"
        label="源IP"
        show-overflow-tooltip
        align="center"
      >
      </el-table-column>
      <el-table-column prop="srcPort" label="源端口" align="center">
      </el-table-column>
      <el-table-column prop="dstIp" label="目标IP" align="center">
        <!-- <template slot-scope="scope">{{ scope.row.gmtCreate | formatDateTime }}</template> -->
      </el-table-column>
      <el-table-column prop="dstPort" label="目标端口" align="center">
      </el-table-column>
      <el-table-column label="攻击类型" align="center">
        DDOS
      </el-table-column>
      <el-table-column prop="timestamp" label="时间" align="center">
      </el-table-column>
    </el-table>
    <div class="block" style="margin: 20px 0px 0px 0px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="allMessage.length"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";
export default {
  data() {
    return {
      // 全部消息的数据
      allMessage: [],
      // 当前页面的消息
      currentMessage: [],
      // 分页的数据
      currentPage: 1,
      pagesize: 10,
      userId: null,
      loading: false,
    };
  },
  props: {
    which: {
      type: String,
    },
    getMessage: {
      type: Array,
    },
    loading1: {
      type: Boolean,
    },
  },
  watch: {
    // getMessage: mounted(),
  },
  created() {
    // console.log(123132)
    this.allMessage = [];
    // this.getPageInfo();
    this.getUserId();
    this.loading = this.loading1;
    console.log("123123");
    console.log(this.loading);
  },
  activated() {},
  methods: {
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
          // // // console.log(this.userId)
        });
      }
    },
    load() {
      this.loading = false;
    },
    // 分页的方法
    // 获取当前页的数据信息
    getPageInfo(data) {
      if (data != null) {
        this.allMessage = data;
      }
      //清空currentMessage中的数据
      this.currentMessage = [];
      // 获取当前页的数据
      for (
        let i = (this.currentPage - 1) * this.pagesize;
        i < this.allMessage.length;
        i++
      ) {
        //把遍历的数据添加到currentMessage里面
        this.currentMessage.push(this.allMessage[i]);
        //判断是否达到一页的要求
        if (this.currentMessage.length === this.pagesize) break;
      }
      // this.loading1 = false;
      this.loading = false;
    },
    handleSizeChange(val) {
      this.currentMessage = this.allMessage.slice(0, val);
      // // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      //修改当前的页码
      this.currentPage = val;
      //数据重新分页
      this.getPageInfo(null);
    },
  },
};
</script>

<style lang='less' scoped>
label {
  margin-bottom: 0px !important;
}

.main {
  position: relative;
  min-height: 550.28px;
}

.block {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 0px;
}
</style>