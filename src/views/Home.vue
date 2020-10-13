<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-sub-menu key="sub1">
          <span slot="title"><a-icon type="user" />用户管理</span>
          <a-menu-item key="1">
            <router-link to="/home/userlist" tag="li">用户列表</router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link to="/home/usercreate" tag="li">用户新建</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-row>
          <a-col :span="2">
            <!-- 左移按钮 -->
            <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="() => (collapsed = !collapsed)"
            />
          </a-col>
          <a-col :span="8">
            <!-- 面包屑 -->
            <div>
              <a-breadcrumb :routes="routes">
                <template
                  slot="itemRender"
                  slot-scope="{ route, params, routes, paths }"
                >
                  <!-- <span v-if="routes.indexOf(route) === routes.length - 1">
                {{ route.breadcrumbName }}
              </span>
              <router-link v-else :to="`${basePath}/${paths.join('/')}`">
                {{ route.breadcrumbName }}
              </router-link> -->
                </template>
              </a-breadcrumb>
              {{ $route.path }}
            </div>
          </a-col>
          <a-col :span="4" :offset="8">
            <!-- 右侧个人中心 -->
            {{ this.uname }}
            {{ this.roleName }}

            <a-dropdown>
              <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                个人中心 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="goback">退出</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">个人中心</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          background: '#fff',
          minHeight: '280px',
        }"
      >
        <router-view></router-view>
        <!-- content -->
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    const { lang } = this.$route.params;
    const uname = localStorage.getItem("uname");
    const roleName = localStorage.getItem("roleName");
    return {
      basePath: "首页",
      routes: this.$router.options.routes,
      collapsed: false,
      uname,
      roleName,
    };
  },
  mounted() {
    // console.log(this.$router.options.routes);
    console.log(this.uname);
    console.log(this.roleName);
  },
  methods: {
    goback() {
      localStorage.removeItem("token");
      localStorage.removeItem("roleName");
      localStorage.removeItem("uname");
      this.$router.push("/log");
      this.$message.success("退出成功");
    },
  },
};
</script>
<style>
#components-layout-demo-custom-trigger {
  height: 100%;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  align-items: ;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>