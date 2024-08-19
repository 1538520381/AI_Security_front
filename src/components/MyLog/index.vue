<template>
  <div class="main">
    <el-table
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
        prop="userIp"
        label="客户端IP"
        show-overflow-tooltip
        align="center"
      >
      </el-table-column>
      <el-table-column prop="userName" label="客户端名称" align="center">
      </el-table-column>
      <el-table-column prop="department" label="部门" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="请求时间" align="center">
        <!-- <template slot-scope="scope">{{ scope.row.gmtCreate | formatDateTime }}</template> -->
      </el-table-column>
      <el-table-column prop="deleted" label="状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.deleted == 0 ? "已连接" : "已断开" }}
        </template>
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
    };
  },
  props: {
    which: {
      type: String,
    },
    getMessage: {
      type: Array,
    },
  },
  watch: {},
  created() {
    this.getConnectMessage();
  },
  mounted() {
    // this.allMessage = this.getMessage;
    // this.getPageInfo();
    // this.getUserId();
  },
  activated() {},
  methods: {
    getConnectMessage() {
      this.token = VueCookies.get("token");
      // // console.log(this.token);
      axios({
        method: "get",
        url: "/serverRequest/connection",
        headers: { token: this.token },
      })
        .then((res) => {
          // // console.log("321");
          // // console.log(res);
          // // console.log(res.data.connections);

          this.allMessage = res.data.connections;

          // this.getMessage = this.allMessage;
          this.getPageInfo();
          this.getUserId();
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
          // // // console.log(this.userId)
        });
      }
    },
    // 分页的方法
    // 获取当前页的数据信息
    getPageInfo() {
      // // console.log("123");
      // // console.log(this.allMessage);
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
    },
    handleSizeChange(val) {
      this.currentMessage = this.allMessage.slice(0, val);
      // // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      //修改当前的页码
      this.currentPage = val;
      //数据重新分页
      this.getPageInfo();
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