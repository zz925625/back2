<template>
  <div>
    <a-row type="flex" justify="space-between" align="middle">
      <a-col :span="6" push="1">
        <h1><slot>用户列表</slot></h1>
      </a-col>
      <a-col :span="2" pull="2">
        <a-button type="primary" size="large" block>
          <slot>创建</slot>
        </a-button>
      </a-col>
    </a-row>
    <hr />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  computed: {},

  components: {},

  created() {},

  mounted() {},

  methods: {},
};
</script>

<style scoped lang='scss'>
.ant-btn {
  border-radius: 20px;
}
.ant-row-flex {
  line-height: 70px;
  h1 {
    font-size: 24px;
    margin: 0;
  }
}
</style>