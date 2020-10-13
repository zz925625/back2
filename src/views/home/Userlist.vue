<template>
  <div>
    <Listheader></Listheader>
    <!--  -->
    <a-row style="margin-top: 20px; margin-left: 10px">
      <!-- 搜索框 -->
      <a-col :span="6">
        <a-input-search
          placeholder="请输入用户名"
          enter-button
          @search="onSearch"
          size="large"
        />
      </a-col>
      <a-col :span="6" :offset="10">
        <a-range-picker
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          :placeholder="['注册开始日期', '注册结束日期']"
          @ok="onOk"
          separator="至"
        >
          <a-icon slot="suffixIcon" type="calendar" />
        </a-range-picker>
      </a-col>
    </a-row>
    <a-table
      :columns="columns"
      :data-source="data"
      :scroll="{ x: 1000, y: 380 }"
      bordered
    >
      <span slot="operation" class="table-operation" slot-scope="text, record">
        <a-button type="primary" size="large" style="border-radius: 20px">
          分配角色
        </a-button>
        <a-button
          type="danger"
          size="large"
          @click="delect(record.user_id)"
          style="
            border-radius: 50%;
            margin-left: 5px;
            width: 42px;
            height: 42px;
          "
        >
          <a-icon type="delete" style="margin-left: -3px" />
        </a-button>
      </span>
    </a-table>
  </div>
</template>

<script>
import moment from "moment";
import Listheader from "@/components/listheader/Listheader";
import { get, deluserlist } from "@/api/axios";
const columns = [
  { title: "编号", dataIndex: "user_id", key: "1", width: 0 },
  { title: "所属角色", dataIndex: "role_name", key: "2", width: 0 },
  { title: "用户名", dataIndex: "username", key: "3", width: 0 },
  { title: "手机号 ", dataIndex: "mobile_phone", key: "4", width: 0 },
  { title: "冻结 ", dataIndex: "state", key: "5", width: 0 },
  { title: "登陆时间 ", dataIndex: "reg_time", key: "6", width: 0 },
  {
    title: "操作",
    key: "operation",
    width: 0,
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  data() {
    return {
      disabledHours: () => this.range(0, 60).splice(20, 4),
      disabledMinutes: () => this.range(0, 31),
      disabledSeconds: () => [55, 56],
      data: [],
      columns,
      pagenum: 0,
      pagesize: 0,
      uname: "",
      start_time: "",
      end_time: "",
    };
  },

  computed: {},

  components: { Listheader },

  created() {
    this.getuserlist();
  },

  mounted() {},

  methods: {
    async delect(key) {
      console.log(key);
      let res = await deluserlist("/users/delete.php", { user_id: key });
      console.log(res);
      this.getuserlist();
    },
    async getuserlist() {
      let res = await get("/users/index.php", {
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        uname: this.uname,
        start_time: this.start_time,
        end_time: this.end_time,
      });
      console.log(res.data);
      this.data = res.data.data.list;
    },
    onOk(value, dateString) {
      (this.start_time = value[0]._d.toLocaleString()),
        (this.end_time = value[1]._d.toLocaleString());
    },
    moment,
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    onSearch(a) {
      this.uname = a;
      this.getuserlist();
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf("day");
    },

    disabledDateTime() {
      return {
        disabledHours: () => this.range(0, 24).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    },
  },
};
</script>

<style scoped lang='scss'>
</style>